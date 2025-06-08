import axios from "axios";
import {useState, useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import {IconButton, Rating} from "@mui/material";

export default function MyWebtoons () {
    const token = localStorage.getItem("accessToken");
    const [webtoons, setWebtoons] = useState([]);
    const [userRating, setUserRating] = useState([]);
    const[webtoonID, setWebtoonID] = useState([]);
    const {id} = useParams();
    
     useEffect(()=>{
            getWebtoons();
            getRating();
    }, []);
    
    const navigate = useNavigate();
    const navigateToSearch = () => {
        navigate(`/users/${id}/search-webtoons`);
    }

    const getWebtoons = async(e) => {
        try{
            await axios.get(`http://localhost:5555/users/${id}/my-webtoons`, {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            .then (res => {
                setWebtoons(res.data);
               
            })
        } catch (err){
            console.log(err);
        }
    }
    
    const getWebtoonID = async(e) => {
         try{
            await axios.get(`http://localhost:5555/users/${id}/my-webtoons`, {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            .then (res => {
                setWebtoons(res.data);
               
            })
        } catch (err){
            console.log(err);
        }
    }
    const getRating = async (e) => {
        try {
            await axios.get(`http://localhost:5555/users/${id}/get-my-ratings`)
            .then (res => {
                setUserRating(res.data);
                console.log(userRating);
            })  
        } catch (err) {
            console.log(err);
        }
    }
        
    const handleDelete = async (title) => {
        await axios.delete(`http://localhost:5555/users/${id}/my-webtoons?webtoonTitle=${title}`, {
            headers:{
                Authorization: `Bearer ${token}`
            }
        })

        getWebtoons();

    }
    
    
    
    const changeRating = async (rating, title) => {
    
        
        const ogRating = await axios.get(`http://localhost:5555/users/${id}/get-rating?webtoonTitle=${title}`, {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
          
        if(ogRating.data==="")
        {
            await axios.post(`http://localhost:5555/users/${id}/my-webtoons-ratings`, {
            webtoonTitle: title, 
            userRating: rating}, 
            {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
        } else 
        {
        await axios.post(`http://localhost:5555/users/${id}/update-my-webtoons-ratings`, {
            webtoonTitle: title, 
            userRating: rating } ,
            {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
        }
       
    }

    const handleRatingChange = (index, newRating) => {
        //<a href={`/users/${id}/webtoon-info/${webtoonID}`}>
        setWebtoons(prev => 
            prev.map((webtoon, i) => 
            i === index ? {...webtoon, rating: newRating} : webtoon
        )
        );
    }
    return (
        
        <div>
            <h1>My Webtoons</h1>
            
           <div style={{display:'flex', gap:'10px'}}>
                {Array.isArray(webtoons) && webtoons.length > 0 && webtoons.map((item,index)=> (
                   <a href={`/users/${id}/webtoon-info/${item.webtoonID}`}>
                   <div key={index} style={{
                    width:'150px', 
                    height: '150px', 
                    backgroundColor: 'pink',
                    border: '1px solid black',
                    
                   }}>
                     <b>{item.title}</b> <div style={{marginLeft:"auto"}}> 
                        <IconButton onClick={() => handleDelete(item.title)}><DeleteIcon/></IconButton>
                     </div>
                    <br />
                    By: {item.author}
                    <br />
                    <div style= {{paddingTop:"1vh"}}>
                        <Rating 
                            value= {item.rating} 
                            onChange={(e, newUserRating)=> {   
                                handleRatingChange(index, newUserRating)
                                changeRating(newUserRating, item.title)
                            }}
                            precision={.5}
                        />   
                    </div>
                   
                   </div>
                </a>
                ))}
            </div>
            <button onClick={navigateToSearch}>Search Library</button>
        </div>
    );
}