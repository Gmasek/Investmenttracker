import React, { useEffect, useState } from "react";
import SimpleLineChart from "./Chart";
import api from "../api"


export default function Asset({asset,onDelete}){
    //const [data,setData] = useState([])
//
    //useEffect(()=>{
    //    stock_data();
    //},[])
//
    //const stock_data =()=>{
    //     api.post("api/getasset/",{ticker:asset.ticker})
    //     .then((res)=>res.data)
    //     .then((data)=>{setData(data)})
    //     .catch((err)=>alert(err))
    //}
    return <div>
        <p>{asset.ticker}</p>
        <p>{asset.qty}</p>
        <button onClick={() => onDelete(asset.id)}>
             Delete
        </button>
        <div>
            <SimpleLineChart ticker={asset.ticker}/>
        </div>
    </div>
}