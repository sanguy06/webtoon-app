import {useParams, useNavigate} from "react-router-dom";
import axios from "axios";
import {useState, useEffect} from "react";
import {FaRegStar} from "react-icons/fa";
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { IconButton } from "@mui/material";
import {Rating} from "@mui/material";
import NavBar from "../components/NavBar";


import "../App.css";

export default function WebtoonInfo() {
   
    
    useEffect(()=>{
            fetchWebtoonInfo();
            //getRating(); 
    }, []);

    const navigate = useNavigate();
    const {id} = useParams();
    const {webtoonID} = useParams();
    const[title,setTitle] = useState("");
    const[author, setAuthor] = useState("");
    const[userRating, setUserRating] = useState(0);
    const token = localStorage.getItem("accessToken");

    let webtoon; 

    // grab info on that specific webtoon
    const fetchWebtoonInfo = async() => {

        webtoon = await axios.post(`https://webtoon-app-production.up.railway.app/webtoon-info/${webtoonID}`);
        console.log(webtoon.data);
        
        setTitle(webtoon.data.title);
        setAuthor(webtoon.data.author);
        getRating(webtoon.data.title);
    }

    // get user-rating - if it doesn't exist it is 0
    const getRating = async(title) => {
       
        try {
            await axios.get(`https://webtoon-app-production.up.railway.app/users/${id}/get-rating?webtoonTitle=${title}`, {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            .then (res => {
                setUserRating(res.data);
            })  
        } catch (err) {
            console.log(err);
        }
    }

    const handleClick = async () => {
        
        try{
            await axios.post(`https://webtoon-app-production.up.railway.app/users/${id}/add-webtoons`, {webtoonTitle: title} , 
                {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
        .then(res =>{
                console.log(res.data);
        });
    } catch(err)
    {
        console.log(err);
    }
         
    }
    
    const changeRating = async (value) => {
        //console.log("userRating at infoPage is " + value);
        const addWebton = await axios.get(`https://webtoon-app-production.up.railway.app/users/${id}/my-webtoons`, {
            headers:{
                    Authorization: `Bearer ${token}`
                }
        })
        .then(async res => {
            
            if(res.data===""||!res.data.some(item=>item.title === title)){
                console.log("smth happened");
                await axios.post(`https://webtoon-app-production.up.railway.app/users/${id}/add-webtoons`, {
                    webtoonTitle: title
                }, {
                    headers:{
                    Authorization: `Bearer ${token}`
                }})
            } 

        });

        
        const ogRating = await axios.get(`https://webtoon-app-production.up.railway.app/users/${id}/get-rating?webtoonTitle=${title}`, {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            //.then ((res) => {(console.log(res.data))});
          
        if(ogRating.data==="")
        {
            await axios.post(`https://webtoon-app-production.up.railway.app/users/${id}/my-webtoons-ratings`, {
            webtoonTitle: title, 
            userRating: value}, 
            {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
        } else 
        {
        await axios.post(`https://webtoon-app-production.up.railway.app/users/${id}/update-my-webtoons-ratings`, {
            webtoonTitle: title, 
            userRating: value } ,
            {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
        }
    }

    
    return(
        <div style={{
            backgroundColor: "pink", 
            backgroundSize: "cover", 
            height: "100vh", 
            
        }}>
            <NavBar />
            <div className="custom-font"
            style={{
                textAlign:"center", 
                paddingTop: "5vh",
                display: 'flex',
                alignItems: "center",
                justifyContent: "center",
                flexDirection:"column"}}>
            <h1>{title}</h1> 
            <p style={{fontSize:"20px"}}>By: {author}</p>
            
            <div style= {{paddingTop:"5vh"}}>
                <Rating 
                    value= {userRating} 
                    onChange={(e, newUserRating)=> {
                        setUserRating(newUserRating );
                        changeRating(newUserRating)}}
                    precision={.5}
                />   
            </div>
            <button onClick={(handleClick)} style={{
               
                backgroundColor: 'pink', 
                color: 'black',     
                padding: '10px 20px', 
                
            }} className="custom-font">Add to library</button>
            
        </div>
        </div>
    )
}