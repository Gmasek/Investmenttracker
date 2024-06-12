import { useState } from "react";
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
import Checkbox from "./Checkbox";

const colorCodes = {
    1: "#FF5733",  
    2: "#33FF57",  
    3: "#3357FF",  
    4: "#FFFF33",  
    5: "#FF33FF",  
    6: "#33FFFF",  
    7: "#FFA500",  
    8: "#800080",  
    9: "#A52A2A",  
    10: "#000000"  
};


function ChartItem({route,ticker,options}) {
    const [price_data,setData] = useState(null)
    const [daysback,setDaysback] = useState(30)
    const [columns,setColumns] = useState([])
    



    const get_specificData = (e) =>{
        console.log(columns)
        e.preventDefault();
        api.post(route,{ticker:ticker,daysback:daysback,column:columns})
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
    }
    
    const transformData = (data) => {
        const keys = Object.keys(data);
        const length = data[keys[0]].length;
      
        return Array.from({ length }, (_, index) => {
          const point = { index:  `T-${length - index - 1} D` };
          keys.forEach((key) => {
            point[key] = data[key][index];
          });
          return point;
        });
      };
     
    const chartData = price_data!==null ? transformData(price_data.data) : null
    const keys = price_data!==null ? Object.keys(chartData[0]).filter(key => key !== 'index') : null
    
    return (
        <div className="p-3 bg-white rounded-3xl ">
            <div className="w-full">
                <form onSubmit={get_specificData} className=" p-5 ">
                    <label htmlFor="column" className="pb-3 pr-4">Data to visualise</label>
                    <br/>
                    {options.map((option) => (
                        <Checkbox option={option} onChange={handleColums} id={option}/>
                    ))}
                    <label htmlFor="daysback" className="pb-3 pr-4">Trading days back from today:</label>
                    <input 
                    type="number"
                    name="daysback"
                    id="daysback"
                    className="rounded  bg-gray-200 text-black pl-2 pr-2 w-12"
                    onChange={(e)=>setDaysback( parseInt(e.target.value))}/>
                    <br/>
                    <input type="submit" value="Submit" className="rounded bg-blue-400 text-white  p-2 "></input>
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
                <Line key={index} type="monotone" dataKey={key} stroke={colorCodes[index]}  />
                ))}
             
            </LineChart>
            </ResponsiveContainer>):
                (<p className="text-xl pl-5">
                    Select the data you want visualised
                </p>) 
            }
        </div>
       
      );
  }

export default ChartItem;