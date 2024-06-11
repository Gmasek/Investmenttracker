import Form from "../components/Form"
import { useNavigate } from "react-router-dom"


function Login() {
    const navigate = useNavigate()

    return <>
        <Form route="/api/token/" method="login" />
        <br/>
        <div className="text-center">
            <h1 className="text-2xl p-5">Dont have an acocunt yet ? </h1>
            <button onClick={() => navigate("/register")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >Register</button>
        </div>
        
    </>
    

}

export default Login