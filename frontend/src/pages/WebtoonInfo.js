import {useParams, useNavigate} from "react-router-dom";
import axios from "axios";
import {useState, useEffect} from "react";
import {FaRegStar} from "react-icons/fa";
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { IconButton } from "@mui/material";
import {Rating} from "@mui/material";



/**--------------------- STILL NEEDS TO BE IMPLEMENTED ---------------------------//
 * deleteRating function - when rating is 0, that row should be deleted from user-ratings
 * when user adds a rating, it should also add that relation to user-webtoons data table 
 * 
 * 
 */
export default function WebtoonInfo() {
   
    useEffect(()=>{
            fetchWebtoonInfo();
    }, []);
    
    const navigate = useNavigate();
    const {id} = useParams();
    const {webtoonID} = useParams();
    const[title,setTitle] = useState("");
    const[author, setAuthor] = useState("");
    const[userRating, setUserRating] = useState(0);

    let webtoon; 

    const token = localStorage.getItem("accessToken");
    const fetchWebtoonInfo = async() => {

        webtoon = await axios.post(`http://localhost:5555/webtoon-info/${webtoonID}`);
        console.log(webtoon.data);
        
        setTitle(webtoon.data.title);
        setAuthor(webtoon.data.author);
        
    }

    const handleClick = async () => {
        
        console.log("access token found in infoPage " + token);
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

    const handleRatingChange = (value) =>{
        setUserRating(value);
        changeRating();
    }
    
    const changeRating = async (value) => {
        console.log("userRating at infoPage is " + value);
        const ogRating = await axios.get(`http://localhost:5555/users/${id}/get-rating?webtoonTitle=${title}`, 
            {
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
                        setUserRating(newUserRating);
                        changeRating(newUserRating)}}
                    precision={.5}
                />   
            </div>
            <button onClick={() => {navigate("/users/:id/my-webtoons")}}>Go to Library</button>
        </div>
    )
}