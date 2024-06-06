import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime,timedelta

def getSimplePricedata(ticker:str,columns:list,daysback=30)->list:
    curr_date = datetime.now()
    daysback = int(daysback)
    window = daysback + 100 #needed for moving avg-es
    stock_data = yf.download(ticker,start=(curr_date-timedelta(window)),end=curr_date)
    stock_data = pd.DataFrame(stock_data)
    stock_data["SMA5D"] = stock_data["Close"].rolling(5).mean()
    stock_data["SMA20D"] = stock_data["Close"].rolling(20).mean()
    stock_data["SMA50D"] = stock_data["Close"].rolling(50).mean()
    stock_data = stock_data.dropna()
    stock_data = stock_data[-daysback:]
    print(stock_data.describe())
    output = dict()
    for col in columns:
        output[col]=list(np.round(stock_data[col],3))

    return output


def getCurrentPrice(ticker:str):
    stock = yf.Ticker(ticker)
    return stock.info["currentPrice"]

