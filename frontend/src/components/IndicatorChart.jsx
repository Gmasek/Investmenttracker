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
    MACD: '#FF5733',  
    StcOsc: '#33FF57', 
    OBV: '#3357FF',  
    RSI: '#FF33A1',   
    RSI_volume: '#FF9633',
  };

function IndicatorChart(ticker){
    const [price_data,setData] = useState(null)
    const [daysback,setDaysback] = useState(30)
    const [columns,setColumns] = useState([])

    const get_specificData = (e) =>{
        console.log(columns)
        e.preventDefault();
        api.post("api/getindicators/",{ticker:ticker.ticker,daysback:daysback,column:columns})
        .then((res)=>res.data).then((data)=>setData(data));
 
    }

   
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
                    <label htmlFor="column">Displayed price data</label>
                    <input type="checkbox" id="MACD" name="MACD" value="MACD" 
                    onClick={(e) =>handleColums(e.target.checked,e.target.value) }/>
                    <label htmlFor="MACD">MACD</label>
                    <input type="checkbox" id="StcOsc" name="StcOsc" value="StcOsc"
                    onChange={(e) =>handleColums(e.target.checked,e.target.value) }/>
                    <label htmlFor="StcOsc">StcOsc</label>
                    <input type="checkbox" id="OBV" name="OBV" value="OBV"
                    onChange={(e) =>handleColums(e.target.checked,e.target.value) }/>
                    <label htmlFor="OBV">OBV</label>
                    <input type="checkbox" id="RSI" name="RSI" value="RSI"
                    onChange={(e) =>handleColums(e.target.checked,e.target.value) }/>
                    <label htmlFor="RSI">RSI</label>
                    <input type="checkbox" id="RSI_volume" name="RSI_volume" value="RSI_volume"
                    onChange={(e) =>handleColums(e.target.checked,e.target.value)}/>
                    <label htmlFor="RSI_volume">RSI_volume</label>
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
              <YAxis />
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

export default IndicatorChart;