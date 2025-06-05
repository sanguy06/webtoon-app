import {useParams} from "react-router-dom";
import axios from "axios";
import {useState, useEffect} from "react";
import {FaRegStar} from "react-icons/fa";
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { IconButton } from "@mui/material";
export default function WebtoonInfo() {
   
    useEffect(()=>{
            fetchWebtoonInfo();
    }, []);
    
    const {id} = useParams();
    const {webtoonID} = useParams();
    const[title,setTitle] = useState("");
    const[author, setAuthor] = useState("");

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

    return(
        <div>
            <h1>{title}</h1> 
            <p>By: {author}</p>

            <button onClick={handleClick}>Add to library</button>
            <div style= {{paddingTop:"5vh"}}>
               
                <IconButton><StarBorderIcon /></IconButton>
            </div>
        </div>
    )
}