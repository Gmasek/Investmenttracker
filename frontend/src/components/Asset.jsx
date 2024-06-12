import React, { useEffect, useState } from "react";

import api from "../api"

import ChartItem from "./ChartItem";

export default function Asset({asset,onDelete,basiccols,indicatorcols}) {
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
        <p className="text-2xl pl-2">{asset.ticker}</p>
        <p className="text-xl pl-2">{asset.qty}</p>
        <p className="text-xl pl-2">Current Value:{Math.round(curr_value*100)/100}$</p>
        <button className="bg-blue-300 hover:bg-red-500 rounded p-2 m-2" onClick={() => onDelete(asset.id)}>
             Remove asset
        </button>
        <div className="mt-5">
            <ChartItem route={"api/getasset/"} ticker={asset.ticker} options={basiccols} />
        </div>
        <div className="mt-5">
           <ChartItem route={"api/getindicators/"} ticker={asset.ticker} options={indicatorcols} />
        </div>
    </div>
}