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
    const [daysback,setDaysback] = useState(10)
    const [columns,setColumns] = useState(["Open","Close"])



    useEffect(()=>{
        stock_data(ticker);
       
    },[])
   
    const stock_data =(ticker)=>{
        api.post("api/getasset/",{ticker:ticker.ticker,daysback:daysback,column:columns})
        .then((res)=>res.data)
        .then((data)=>setData(data))
        .catch((err)=>console.log(err))
   }

    const get_specificData = (e) =>{
        console.log(columns)
        e.preventDefault();
        api.post("api/getasset/",{ticker:ticker.ticker,daysback:daysback,column:columns})
        .then((res)=>res.data).then((data)=>setData(data));
 
    }

    const format_item = (tick) => `$${tick.toLocaleString()}`

   
    const handleColums = (checked,val)=> {
        if(checked){
            setColumns([...columns,val])
        }
        else{
            const res = columns.filter(col => col != val)
            setColumns(
                res
            )
        }
        console.log(columns)
    }
    
    const transformData = (data) => {
        const keys = Object.keys(data);
        const length = data[keys[0]].length;
      
        return Array.from({ length }, (_, index) => {
          const point = { index: `Point ${index + 1}` };
          keys.forEach((key) => {
            point[key] = data[key][index];
          });
          return point;
        });
      };
      
    const chartData = transformData(price_data.data)
    const keys = Object.keys(chartData[0]).filter(key => key !== 'index');
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
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" />
              <YAxis tickFormatter={format_item}/>
              <Tooltip />
              <Legend />
              {keys.map((key, index) => (
                <Line key={index} type="monotone" dataKey={key} stroke={index % 2 === 0 ? "#8884d8" : "#82ca9d"} />
                ))}
             
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