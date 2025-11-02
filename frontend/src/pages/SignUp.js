import {useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";


export default function SignUp() {
    
    const [name, setName] = useState("");
    const[password,setPassword]=useState("");
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL
    

    const handleClick = async (e) =>{
        try{
            await axios.post(`${API_URL}/users/sign_up`, {
                user_name: name, 
                passcode: password
            }); 
        }
        catch(err)
        {
            console.log(err);
        }
        try{
        
            await axios.post(`${API_URL}/users/login`, {
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
    <div    
        className="custom-font" 
        style={{
            backgroundColor:"pink", 
            backgroundSize: "cover",
            height: "100vh",
            display:"flex",
            textAlign:"center",
            alignItems:"center",
            justifyContent:"center", 
            flexDirection:"column"}}>
        <h1 style={{fontSize:'40px'}}>Sign Up!</h1> 
            <div style={{fontSize:'20px'}}>
            Username: 
            <input 
               style={{
                    marginLeft: '5px', 
                    height: '25px'
                }}
                type="text"
                value = {name}
                onChange={(e)=>setName(e.target.value)}
            />
            <br/>
            Password: 
            <input 
                style={{
                    marginLeft: '5px', 
                    height: '25px'
                }}
                type="text"
                value = {password}
                onChange={(e)=>setPassword(e.target.value)}
            />
            <br/>
            <div style={{paddingTop: '5vh'}}>
            <button style={{
                backgroundColor: 'pink', 
                color: 'black',     
                padding: '10px 20px'
            }} className="custom-font"onClick={handleClick}>Submit</button>
            </div>
            </div>
    </div>
    );
}