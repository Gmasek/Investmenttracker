import { useState,useEffect } from "react";
import {
    LineChart,
    ResponsiveContainer,
    Legend,
    Tooltip,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";
import api from "../api";

function SimpleLineChart(ticker){
    const [price_data,setData] = useState([])

    useEffect(()=>{
        stock_data(ticker);
    },[])

    const stock_data =(ticker)=>{
         api.post("api/getasset/",ticker)
         .then((res)=>res.data)
         .then((data)=>setData(data))
         .catch((err)=>alert(err))
    }
    console.log(price_data)
    //return (
    //    <div>
    //      {price_data.result.map((item) => (
    //        <p >{item}</p>
    //        ))}
    //    </div>
    //  );
  }

export default SimpleLineChart;