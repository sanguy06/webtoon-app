import {useParams, useNavigate} from "react-router-dom";
import axios from "axios";
import {useState, useEffect} from "react";
import {FaRegStar} from "react-icons/fa";
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { IconButton } from "@mui/material";
import {Rating} from "@mui/material";



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

        webtoon = await axios.post(`http://localhost:5555/webtoon-info/${webtoonID}`);
        console.log(webtoon.data);
        
        setTitle(webtoon.data.title);
        setAuthor(webtoon.data.author);
        getRating(webtoon.data.title);
    }

    // get user-rating - if it doesn't exist it is 0
    const getRating = async(title) => {
       
        try {
            await axios.get(`http://localhost:5555/users/${id}/get-rating?webtoonTitle=${title}`, {
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
            await axios.post(`http://localhost:5555/users/${id}/add-webtoons`, {webtoonTitle: title} , 
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
        const addWebton = await axios.get(`http://localhost:5555/users/${id}/my-webtoons`, {
            headers:{
                    Authorization: `Bearer ${token}`
                }
        })
        .then(async res => {
           
            console.log(res.data)
            if(!res.data.some(item=>item.title === title)){
                console.log("smth happened");
                await axios.post(`http://localhost:5555/users/${id}/add-webtoons`, {
                    webtoonTitle: title
                }, {
                    headers:{
                    Authorization: `Bearer ${token}`
                }})
            } 

        });

        
        const ogRating = await axios.get(`http://localhost:5555/users/${id}/get-rating?webtoonTitle=${title}`, {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            //.then ((res) => {(console.log(res.data))});
          
        if(ogRating.data==="")
        {
            await axios.post(`http://localhost:5555/users/${id}/my-webtoons-ratings`, {
            webtoonTitle: title, 
            userRating: value}, 
            {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
        } else 
        {
        await axios.post(`http://localhost:5555/users/${id}/update-my-webtoons-ratings`, {
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
        <div>
            <h1>{title}</h1> 
            <p>By: {author}</p>
            <button onClick={handleClick}>Add to library</button>
            <div style= {{paddingTop:"5vh"}}>
                <Rating 
                    value= {userRating} 
                    onChange={(e, newUserRating)=> {
                        setUserRating(newUserRating );
                        changeRating(newUserRating)}}
                    precision={.5}
                />   
            </div>
            <button onClick={() => {navigate(`/users/${id}/my-webtoons`)}}>Go to Library</button>
        </div>
    )
}