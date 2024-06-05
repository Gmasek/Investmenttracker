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
    const [column,setColumn] = useState([])



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
        console.log(column)
        e.preventDefault();
        api.post("api/getasset/",{ticker:ticker.ticker,daysback:daysback,column:column})
        .then((res)=>res.data).then((data)=>setData(data));
 
    }
    const format_item = (tick) => `$${tick.toLocaleString()}`

   
    const handleColums = (checked,val)=> {
        if(checked){
            setColumn([...column,val])
        }
        else{
            const res = column.filter(col => col != val)
            setColumn(
                res
            )
        }
        console.log(column)
    }
    
    
    
    return (
        <div>
            <div>
                <form onSubmit={get_specificData}>
                    <label htmlFor="column">Displayed price data</label>
                    <input type="checkbox" id="open" name="options" value="Open"
                    onClick={(e) =>handleColums(e.target.checked,e.target.value) }/>
                    <label htmlFor="open">Open</label>
                    <input type="checkbox" id="close" name="options" value="Close"
                    onChange={(e) =>handleColums(e.target.checked,e.target.value) }/>
                    <label htmlFor="close">Close</label>
                    <input type="checkbox" id="high" name="options" value="High"
                    onChange={(e) =>handleColums(e.target.checked,e.target.value) }/>
                    <label htmlFor="high">High</label>
                    <input type="checkbox" id="low" name="options" value="Low"
                    onChange={(e) =>handleColums(e.target.checked,e.target.value) }/>
                    <label htmlFor="low">Low</label>
                    <input type="checkbox" id="volume" name="options" value="Volume"
                    onChange={(e) =>handleColums(e.target.checked,e.target.value)}/>
                    <label htmlFor="volume">Volume</label>
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