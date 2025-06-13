import React, {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom"; 
import axios from "axios"; 
import { IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import {Rating} from "@mui/material";
import SearchBar from "../components/SearchBar";
import SearchResultsList from "../components/SearchResultsList";
import {SiBookstack} from "react-icons/si";
import "../App.css";
import SearchWebtoons from "./SearchWebtoons";
import { FaSearch } from "react-icons/fa";
import NavBar from "../components/NavBar";

export default function HomePage() {
    const {id} = useParams(); 
    const user_name = useParams();

    const token = localStorage.getItem("accessToken");
    const [webtoons, setWebtoons] = useState([]);
    const [userRating, setUserRating] = useState([]);
    const[webtoonID, setWebtoonID] = useState([]);
    const [results, setResults] = useState([]);

    
    
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
                setWebtoons(res.data.splice(0,3));
                //setWebtoons(webtoons.splice(0,3));
               
            })
        } catch (err){
            console.log(err);
        }
    }
    
    const getWebtoonID = async(e) => {
         try{
            await axios.get(`https://webtoon-app-production.up.railway.app/users/${id}/my-webtoons`, {
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
            await axios.get(`https://webtoon-app-production.up.railway.app/users/${id}/get-my-ratings`,  {
            headers:{
                Authorization: `Bearer ${token}`
            } })
            .then (res => {
                setUserRating(res.data);
                console.log(userRating);
            })  
        } catch (err) {
            console.log(err);
        }
    }
        
    const handleDelete = async (title) => {
        await axios.delete(`https://webtoon-app-production.up.railway.app/users/${id}/my-webtoons?webtoonTitle=${title}`, {
            headers:{
                Authorization: `Bearer ${token}`
            }
        })

        getWebtoons();

    }
    
    
    
    const changeRating = async (rating, title) => {
    
        
        const ogRating = await axios.get(`https://webtoon-app-production.up.railway.app/users/${id}/get-rating?webtoonTitle=${title}`, {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
          
        if(ogRating.data==="")
        {
            await axios.post(`https://webtoon-app-production.up.railway.app/users/${id}/my-webtoons-ratings`, {
            webtoonTitle: title, 
            userRating: rating}, 
            {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
        } else 
        {
        await axios.post(`https://webtoon-app-production.up.railway.app/users/${id}/update-my-webtoons-ratings`, {
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
        /**  width:'150px', 
                    height: '150px', 
                    backgroundColor: 'pink',
                    border: '1px solid black', */
        setWebtoons(prev => 
            prev.map((webtoon, i) => 
            i === index ? {...webtoon, rating: newRating} : webtoon
        )
        );
    }
    return (
        <div style={{
            backgroundColor:'pink',
            backgroundSize: 'cover', 
            height: '100vh'
        }}>
            
           <NavBar />
           <div className= "custom-font" style={{
            paddingTop: "5vh",
                paddingLeft: "5vh",
                width:"200px",
                alignContent: "center"
           }}>
            <a href={`/users/${id}/my-webtoons`}>View more in your library...</a>
           </div>
            <div style={{display:'flex', gap:'10px', paddingTop: "5vh", marginLeft: '30px', flexDirection:'column'}}>
                
                {Array.isArray(webtoons) && webtoons.length > 0 && webtoons.map((item,index)=> (
                   
                   <div key={index} className={"webtoon-wrapper custom-font"}>
                    <a href={`/users/${id}/webtoon-info/${item.webtoonID}`}><b>{item.title}</b> </a>
                 
                     <div style={{alignContent: "center"}}> 
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
                
                ))}
            </div>
            <div className="search-bar-container-fixed">
                <SearchBar setResults={setResults}/>
                <SearchResultsList results={results}/>
            </div>
                
            

        </div>
    )
}