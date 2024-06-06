import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime,timedelta

def getSimplePricedata(ticker:str,columns:list,daysback=30)->list:
    curr_date = datetime.now()
    daysback = int(daysback)
    stock_data = yf.download(ticker,start=(curr_date-timedelta(daysback)),end=curr_date)
    stock_data = pd.DataFrame(stock_data)
    output = dict()
    for col in columns:
        output[col]=list(np.round(stock_data[col],3))
    print(output,"asd")
    return output


def getCurrentPrice(ticker:str):
    stock = yf.Ticker(ticker)
    return stock.info["currentPrice"]

