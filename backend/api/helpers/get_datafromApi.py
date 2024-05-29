import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime,timedelta

def getSimplePricedata(ticker:str,window:int,field:str)->list:
    curr_date = datetime.now()
    stock_data = yf.download(ticker,start=(curr_date-timedelta(30)),end=curr_date)
    stock_data = pd.DataFrame(stock_data)
    stock_data[field] = np.round(stock_data[field],3)
    return pd.array(stock_data[field])

#print(getSimplePricedata("Goog",30,"Open"))

#todo more functions with different options of values returning.