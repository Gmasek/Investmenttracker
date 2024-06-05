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
    const [daysback,setDaysback] = useState(30)
    const [column,setColumn] = useState("Open")



    useEffect(()=>{
        stock_data(ticker);
    },[])
   
    const stock_data =(ticker)=>{
        
        api.post("api/getasset/",{ticker:ticker.ticker,daysback:daysback,column:column})
        .then((res)=>res.data)
        .then((data)=>setData(data))
        .catch((err)=>console.log(err))
    
        
   }
    const get_specificData = (e) =>{
        e.preventDefault();
        api.post("api/getasset/",{ticker:ticker.ticker,daysback:daysback,column:column})
        .then((res)=>res.data).then((data)=>setData(data));
 
    }
    const format_item = (tick) => `$${tick.toLocaleString()}`

    console.log(price_data)
    
    return (
        <div>
            <div>
                <form onSubmit={get_specificData}>
                    <label htmlFor="column">Displayed price data</label>
                    <input 
                    type="text"
                    name="column"
                    
                    id="column"
                    onChange={(e)=>setColumn(e.target.value)}/>
                    <br/>
                    <label htmlFor="daysback">Days back from today</label>
                    <input 
                    type="number"
                    name="daysback"
                    id="daysback"
                    onChange={(e)=>setDaysback(parseInt(e.target.value))}/>
                    <br/>
                    
                    <input type="submit" value="Submit"></input>
                </form>
            </div>

             {price_data !== null ?
            (
            <ResponsiveContainer width="100%" height={400}>
            <LineChart data={price_data.data.map((value, index) => ({ index, value }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" />
              <YAxis tickFormatter={format_item}/>
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