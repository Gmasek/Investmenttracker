import React, { useEffect, useState } from "react";
import SimpleLineChart from "./BasicChart";
import api from "../api"
import IndicatorChart from "./IndicatorChart";

export default function Asset({asset,onDelete}){
    const [currentPrice,setCurrentPrice] = useState(1)

    useEffect(()=>{
        stock_data();
    },[])
    const stock_data =()=>{
         api.post("api/getcurrprice/",{ticker:asset.ticker})
         .then((res)=>res.data)
         .then((data)=>{setCurrentPrice(data.data)})
         .catch((err)=>alert(err))
    }
    const curr_value = asset.qty * currentPrice
    return <div className="p-5 mb-2">
        <p className="text-2xl">{asset.ticker}</p>
        <p className="text-xl">{asset.qty}</p>
        <p className="text-xl">Current Value:{Math.round(curr_value*100)/100}$</p>
        <button className="bg-blue-300 hover:bg-red-500 rounded p-1 mt-2" onClick={() => onDelete(asset.id)}>
             Remove asset
        </button>
        <div className="mt-5">
            <SimpleLineChart ticker={asset.ticker}/>
        </div>
        <div className="mt-5">
            <IndicatorChart ticker={asset.ticker}/>
        </div>
    </div>
}