import {useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";


export default function SignUp() {
    
    const [name, setName] = useState("");
    const[password,setPassword]=useState("");
    const navigate = useNavigate();
    
    
    function navigateLogin(){
        try{
            navigate("/auth");
        } catch(err)
        {
            console.log(err);
        }
    }


    const handleClick = async (e) =>{
        try{
            await axios.post("http://localhost:5555/users/sign_up", {
                user_name: name, 
                passcode: password
            }); 
        }
        catch(err)
        {
            console.log(err);
        }
        try{
            await axios.post("http://localhost:5555/users/login", {
                user_name: name, 
                passcode: password
            })
            
            await axios.post("http://localhost:5555/users/auth",{
                user_name: name, 
                passcode: password
            })
            navigateLogin();

        } catch(err)
        {
            console.log(err);
        }
       
        navigateLogin();

    }
    return (
    <div>
        <h1>Sign Up!</h1> 
            <p>
            Username
            <input 
                type="text"
                value = {name}
                onChange={(e)=>setName(e.target.value)}
            />
            Password
            <input 
                type="text"
                value = {password}
                onChange={(e)=>setPassword(e.target.value)}
            />
            <button onClick={handleClick}>Submit</button>
            </p>
    </div>
    );
}