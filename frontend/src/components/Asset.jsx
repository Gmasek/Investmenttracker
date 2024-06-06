import React, { useEffect, useState } from "react";
import SimpleLineChart from "./BasicChart";
import api from "../api"


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
    return <div>
        <p>{asset.ticker}</p>
        <p>{asset.qty}</p>
        <p>Current Value:{curr_value}</p>
        <button onClick={() => onDelete(asset.id)}>
             Delete
        </button>
        <div>
            <SimpleLineChart ticker={asset.ticker}/>
        </div>
    </div>
}