import { useState, useEffect } from "react";
import api from "../api";
import Asset from "../components/Asset";
import { useNavigate } from "react-router-dom"
import Login from "./Login";

function Home(){
    const [assets,setAssets] = useState([]);
    const [ticker,setTicker] = useState("")
    const [qty, setQty] = useState(0)
    
    const [indicatorcols,setIndicatorcols] = useState([])
    const navigate = useNavigate();

    useEffect(()=>{
        getAssets();
        getIndicators();
       
    },[])
    
    const getAssets =() =>{
        api
        .get("/api/assets/")
        .then((res)=>res.data)
        .then((data)=>{setAssets(data)})
        .catch((err)=>alert(err))
    };
    const getIndicators =()=>{
        api.get("api/getindicatorscols/")
        .then((res)=>res.data)
        .then((data)=>setIndicatorcols(data.data))
        .catch((err)=>alert(err))
    }
    
    
    const deleteAsset = (id) =>{
        api.delete(`/api/assets/delete/${id}/`).then((res)=>
        {
            if(res.status == 204) alert("Asset Removed from watchlist");
            else alert("Failed to remove");
            getAssets();
            
        }
        ).catch((err)=>alert(err))
        
    };

    const createAsset = (e) =>{
        e.preventDefault();
        api.post("api/assets/",{ticker:ticker, qty:qty}).then((res) =>
        {
            if (res.status == 201) alert("Asset Added to watchlist");
            else alert("Asset addition failed");
            getAssets();
        }
        ).catch((err)=> alert(err))
        setTicker("");
        setQty('');
    }
    
    const  Logout= () => {
        localStorage.clear()
        return navigate("/login")
      }
    

    return (
        <div className="p-5 bg-gray-200">
            <div>
                <h2 className="text-3xl text-center" >Asset List</h2>
            </div>
            <div className="flex flex-col items-end m-5 center-end p-6 content-center w-35">
                <button onClick={Logout} className="bg-blue-300 hover:bg-red-500 rounded p-2 m-2">Logout</button>
            </div>
            
            {assets.map((asset)=>(
                <Asset asset={asset} onDelete={deleteAsset}  indicatorcols={indicatorcols} key={asset.id} />)) 
            }
            <h2 className="text-3xl text-center pt-5">Add Asset</h2>
            <form onSubmit={createAsset} className="flex flex-col items-center m-5 center-block p-6 content-center">
                <label htmlFor="ticker">Title:</label>
                <br />
                <input
                className=" center-block p-4 m-4 bg-gray-50 
                appearance-none border-2 border-gray-300 
                rounded w-1/2 py-2 px-4 text-gray-700
                leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                type="text" 
                name="ticker" 
                id="ticker" 
                value={ticker}
                required 
                onChange={(e)=>setTicker(e.target.value)} />
                <br/>
                <label htmlFor="qty">StockQty:</label>
                <br />
                <input 
                className=" center-block p-4 m-4 bg-gray-50 
                appearance-none border-2  border-gray-300 
                rounded w-1/4 py-2 px-4 text-gray-700
                leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                type="number"
                name="qty" 
                id="content" 
                required 
                value={qty}
                onChange={(e)=>setQty(e.target.value)}>
                </input>
                <br />
                <input type="submit" value="Submit"
                className="bg-blue-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded
                "></input>
            </form>
        </div>
    )
   
}
export default Home;