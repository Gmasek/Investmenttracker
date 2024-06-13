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
        0: '#FF5733',   // Red-Orange
        1: '#33FF57',   // Lime Green
        2: '#3357FF',   // Blue
        3: '#FF33A1',   // Pink
        4: '#FFD700',   // Gold
        5: '#7FFF00',   // Chartreuse
        6: '#00FFFF',   // Cyan
        7: '#8A2BE2',   // BlueViolet
        8: '#FF4500',   // OrangeRed
        9: '#2E8B57',   // SeaGreen
        10: '#FF1493',  // DeepPink
        11: '#4B0082',  // Indigo
        12: '#FFDAB9',  // PeachPuff
        13: '#7B68EE',  // MediumSlateBlue
        14: '#48D1CC',  // MediumTurquoise
        15: '#ADFF2F',  // GreenYellow
        16: '#FF69B4',  // HotPink
        17: '#CD5C5C',  // IndianRed
        18: '#1E90FF',  // DodgerBlue
        19: '#00FA9A',  // MediumSpringGreen
        20: '#FFD700',  // Gold
        21: '#DC143C',  // Crimson
        22: '#8B4513',  // SaddleBrown
        23: '#B22222',  // FireBrick
        24: '#FF6347',  // Tomato
    
};


function ChartItem({route,ticker,options}) {
    const [price_data,setData] = useState(null)
    const [daysback,setDaysback] = useState(30)
    const [columns,setColumns] = useState([])



    const get_specificData = (e) =>{
        if(columns.length === 0){
            alert("Please select at least one column")
            setColumns([])
            return
        }   
        e.preventDefault();
        api.post(route,{ticker:ticker,daysback:daysback,column:columns})
        .then((res)=>res.data).then((data)=>setData(data));
    }

    const format_item = (tick) => new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(tick)
   
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
                    {options.map((option,index) => (
                        <Checkbox option={option} onChange={handleColums} id={option} key = {option} index={index}/>
                    ))}
                    <br/>
                    <label htmlFor="daysback" className="pb-3 pr-4">Trading days back from today:</label>
                    <input 
                    type="number"
                    name="daysback"
                    id="daysback"
                    className="rounded  bg-gray-200 text-black pl-2 pr-2 w-14"
                    value={daysback}
                    onChange={(e)=>setDaysback( parseInt(e.target.value))}/>
                    <br/>
                    <input type="submit" value="Submit" className="rounded bg-blue-400 text-white  p-2 "></input>
                </form>
            </div>

             {price_data !== null ?
            (<div className="flex align-middle justify-center ">
            <ResponsiveContainer width="95%" height={450}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" />
              <YAxis tickFormatter={format_item} />
              <Tooltip />
              <Legend />
              {keys.map((key, index) => (
                <Line key={index} type="monotone" dataKey={key} stroke={colorCodes[index]}  />
                ))}
             
            </LineChart>
            </ResponsiveContainer>
            </div>):
                (<p className="text-xl pl-5">
                    Select the data you want visualised
                </p>) 
            }
        </div>
       
      );
  }

export default ChartItem;