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
const colorCodes = {
    Open: '#FF5733',  
    Close: '#33FF57', 
    High: '#3357FF',  
    Low: '#FF33A1',   
    SMA5D: '#FF9633',
    SMA20D : '#AF9633',
    SMA50D : '#FF9643',
  };

function SimpleLineChart(ticker){
    const [price_data,setData] = useState(null)
    const [daysback,setDaysback] = useState(30)
    const [columns,setColumns] = useState([])

    

    /*useEffect(()=>{
        stock_data(ticker);
       
    },[])
   // Not sure if we want to load all the data on render
    const stock_data =(ticker)=>{
        api.post("api/getasset/",{ticker:ticker.ticker,daysback:daysback,column:columns})
        .then((res)=>res.data)
        .then((data)=>setData(data))
        .catch((err)=>console.log(err))
   }*/

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
    console.log(chartData)
    
    return (
        <div className="p-3 bg-white rounded-3xl ">
            <div className="w-full">
                <form onSubmit={get_specificData} className=" p-5 ">
                    <label htmlFor="column" className="pb-3">Basic information</label>
                    <input type="checkbox" id="open" name="options" value="Open" 
                    className=""
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
                    <br/>
                    <label>Simple moving avarages</label>
                    <input type="checkbox" id="5DSMA" name="options" value="SMA5D"
                    onChange={(e) =>handleColums(e.target.checked,e.target.value)}/>
                    <label htmlFor="volume">5DSMA</label>
                    <input type="checkbox" id="20DSMA" name="options" value="SMA20D"
                    onChange={(e) =>handleColums(e.target.checked,e.target.value)}/>
                    <label htmlFor="volume">20DSMA</label>
                    <input type="checkbox" id="50DSMA" name="options" value="SMA50D"
                    onChange={(e) =>handleColums(e.target.checked,e.target.value)}/>
                    <label htmlFor="volume">50DSMA</label>
                    <br/>
                    <label htmlFor="daysback">Trading days back from today</label>
                    <input 
                    type="number"
                    name="daysback"
                    id="daysback"
                    className="rounded  bg-blue-200 text-black pl-2 pr-2"
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
                <Line key={index} type="monotone" dataKey={key} stroke={colorCodes[key]} />
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

export default SimpleLineChart;