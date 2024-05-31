import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime,timedelta

def getSimplePricedata(ticker:str)->list:
    curr_date = datetime.now()
    stock_data = yf.download(ticker,start=(curr_date-timedelta(30)),end=curr_date)
    stock_data = pd.DataFrame(stock_data)
    stock_data["Open"] = np.round(stock_data["Open"],3)
    return pd.array(stock_data["Open"])
