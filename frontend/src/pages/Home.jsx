import { useState, useEffect } from "react";
import api from "../api";
import Asset from "../components/Asset";

function Home(){
    const [assets,setAssets] = useState([]);
    const [ticker,setTicker] = useState("")
    const [qty, setQty] = useState(0)

    useEffect(()=>{
        getAssets();
    },[])
    
    const getAssets =() =>{
        api
        .get("/api/assets/")
        .then((res)=>res.data)
        .then((data)=>{setAssets(data);console.log(data)})
        .catch((err)=>alert(err))
    };
    
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
    
    return (
        <div>
            <div>
                <h2 className="m-0.5  text-purple-500">Notes</h2>
            </div>
            <h2>
                Put new asset on watchlist
            </h2>
            {assets.map((asset)=>(
                <Asset asset={asset} onDelete={deleteAsset} key={asset.id} />)) 
            }
            <form onSubmit={createAsset} className="m-5">
                <label htmlFor="ticker">Title:</label>
                <br />
                <input
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
                type="number"
                name="qty" 
                id="content" 
                required 
                value={qty}
                onChange={(e)=>setQty(e.target.value)}>
                </input>
                <br />
                <input type="submit" value="Submit"></input>
            </form>
        </div>
    )
   
}
export default Home;