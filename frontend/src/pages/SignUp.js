import {useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";


export default function SignUp() {
    
    const [name, setName] = useState("");
    const[password,setPassword]=useState("");
    const navigate = useNavigate();
    
    

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
            .then(res => {
                console.log(res.data);
                if(res.data===false)
                {
                    console.log("no");
                    navigate("/usernotfound");
                } else 
                {
                    console.log("authenticating");
                    console.log(res.data.user.user_id);
                    console.log("access token at login is " + res.data.accessToken);
                    localStorage.setItem('accessToken', res.data.accessToken);
                    navigate(`/users/${res.data.user.user_id}/home-page`);
                    console.log(localStorage.getItem("accessToken"));
                }
            })
        
       
           
        } catch(err)
        {
            console.log(err);
        }
       
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