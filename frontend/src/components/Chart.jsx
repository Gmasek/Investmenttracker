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
    const [price_data,setData] = useState(null)
    



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
    
    return (
        <div>
             {price_data !== null ?
            (
            <ResponsiveContainer width="100%" height={400}>
            <LineChart data={price_data.data.map((value, index) => ({ index, value }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
            </ResponsiveContainer>):
                (<p>
                    No data
                </p>) 
            }
        </div>
       
      );
  }

export default SimpleLineChart;