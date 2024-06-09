import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime,timedelta

def getSimplePricedata(ticker:str,columns:list,daysback=30)->list:
    curr_date = datetime.now()
    daysback = int(daysback)
    window = daysback + ((daysback//7)*4) + (75 if "SMA50D" or "SMA20D" or "SMA5D" in columns else 0) #needed for moving avg-es
    stock_data = yf.download(ticker,start=(curr_date-timedelta(window)),end=curr_date)
    
    stock_data["SMA5D"] = stock_data["Close"].rolling(5).mean()
    stock_data["SMA20D"] = stock_data["Close"].rolling(20).mean()
    stock_data["SMA50D"] = stock_data["Close"].rolling(50).mean()
    stock_data = stock_data[-daysback:]
    
    output = dict()
    for col in columns:
        output[col]=list(np.round(stock_data[col].dropna(),3))

    return output


def getCurrentPrice(ticker:str):
    stock = yf.Ticker(ticker)
    return stock.info["currentPrice"]

def getIndicators(ticker:str,columns:list,daysback = 30)->list:
    curr_date = datetime.now()
    daysback = int(daysback)
    window = daysback + ((daysback//7)*4)
    df = yf.download(ticker,start=(curr_date-timedelta(window)),end=curr_date)
    df["Move_direct"]= (1-df['Open'] / df["Close"] )*100
    df["OBV"]=np.where(df['Close'] > df['Close'].shift(1), df['Volume'], np.where(df['Close'] < df['Close'].shift(1), -df['Volume'], 0)).cumsum()
    df["TR"]=np.maximum(df["High"]-df["Low"],df["High"]-df["Close"].shift(1),df["Close"].shift(1)-df["Low"])
    df['ATR14'] = df["TR"].rolling(14).mean()
    df["+DM"]=df["High"].shift(1)-df["High"]
    df["-DM"]=df["Low"].shift(1)-df["Low"]
    df["EMA14+"]=df["+DM"].ewm(com=0.1).mean()
    df["EMA14-"]=df["-DM"].ewm(com=0.1).mean()    
    df["+DI14"]=(df["EMA14+"]/df['ATR14'])*100
    df["-DI14"]=(df["EMA14-"]/df['ATR14'])*100
    df["DI14"]= np.abs(df["+DI14"]-df["-DI14"]) / np.abs(df["+DI14"] + df["-DI14"])
    df["ADX14"]= (df["DI14"].shift(1)*13 + df["DI14"])*100
    df["ADXUT"]= np.where((df["ADX14"] < 25) & (df["ADX14"].shift(1) > 25) & (df["+DI14"] > df["-DI14"]),1,0)
    df["ADXDT"]= np.where((df["ADX14"] < 25) & (df["ADX14"].shift(1) > 25) & (df["+DI14"] < df["-DI14"]),-1,0)
    df["StcOsc"]= 100*(df["Close"]-df["Close"].rolling(14).min())/(df["Close"].rolling(14).max() - df["Close"].rolling(14).min())
    macd,signal = calc_macd(df['Close'],12,26,9)
    df['MACD'] = macd
    df['MACD_signal']=signal
    df['RSI'] = calc_rsi(df['Close'],13)
    df['RSI_volume'] = calc_rsi(df['Close'],13)
    df.dropna()
    output = dict()
    df = df[-daysback:]
    for col in columns:
        
        output[col]=list(np.round(df[col].dropna(),3))

    return output
    
    
def calc_macd(data, len1,len2,len3):
    shortEMA = data.ewm(span = len1, adjust= False).mean()
    longEMA = data.ewm(span = len2, adjust= False).mean()
    MACD = shortEMA-longEMA
    signal = MACD.ewm(span = len3 , adjust= False).mean()
    return MACD , signal

def calc_rsi(data,period):
    delta = data.diff() #egy nappal shiftelt diff
    up = delta.clip(lower=0)
    down = -1*delta.clip(upper=0)
    ema_up = up.ewm(com = period, adjust=False).mean()
    ema_down = down.ewm(com = period, adjust=False).mean()
    rs = ema_up / ema_down
    rsi = 100 - (100/(1+rs))
    return rsi

