import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime,timedelta

def getSimplePricedata(ticker:str,daysback=30,column="Open")->list:
    curr_date = datetime.now()
    daysback = int(daysback)
    stock_data = yf.download(ticker,start=(curr_date-timedelta(daysback)),end=curr_date)
    stock_data = pd.DataFrame(stock_data)
    stock_data[column] = np.round(stock_data[column],3)
    return pd.array(stock_data[column])
