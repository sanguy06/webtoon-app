import axios from "axios";
import {useState, useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import {IconButton, Rating} from "@mui/material";
import NavBar from "../components/NavBar";
import "../components/SearchBar.css";
import "../App.css";
import Popup from "reactjs-popup"; 
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

export default function MyWebtoons () {
    const token = localStorage.getItem("accessToken");
    const [webtoons, setWebtoons] = useState([]);
    const [userRating, setUserRating] = useState([]);
    const[webtoonID, setWebtoonID] = useState([]);
    const[review, setReview] = useState([]);
    const [openDialog, setOpenDialog] = useState(null);
  
    const {id} = useParams();
    
     useEffect(()=>{
            getWebtoons();
            getRating();
            getReview();
    }, []);
    
    const navigate = useNavigate();
    const navigateToSearch = () => {
        navigate(`/users/${id}/search-webtoons`);
    }

    const getWebtoons = async(e) => {
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
            await axios.get(`https://webtoon-app-production.up.railway.app/users/${id}/get-my-ratings`, { 
                headers:{
                Authorization: `Bearer ${token}`
            }})
            .then (res => {
                setUserRating(res.data);
                
            })  
        } catch (err) {
            console.log(err);
        }
    }  
    
    const getReview = async(e) => {
        try{
            await axios.get(`https://webtoon-app-production.up.railway.app/users/${id}/get-my-reviews`, { 
                headers:{
                Authorization: `Bearer ${token}`
            }})
            .then(res => {
                setReview(res.data);
                console.log(res.data);
              
            })
        } catch(err) {
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
        } 
        else 
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
    const changeReview = async(userReview, title) => {
        
        const ogReview = await axios.get(`https://webtoon-app-production.up.railway.app/users/${id}/get-review?webtoonTitle=${title}`, {
            headers: {
                Authorization:  `Bearer ${token}`
            }
        })
        if(ogReview.data==="")
        {
            console.log("thinks review is empty");
            
            await axios.post(`https://webtoon-app-production.up.railway.app/users/${id}/add-review`, {
            webtoonTitle: title, 
            review: userReview}, 
            {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
        } 
        else 
        {
            console.log("thinks review is not empty. updating");
            await axios.post(`https://webtoon-app-production.up.railway.app/users/${id}/update-review`, {
                webtoonTitle: title, 
                review: userReview } ,
                {
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                })
            
        }
    }
    
    const handleRatingChange = (index, newRating) => {
        console.log(index);
        setWebtoons(prev => 
            prev.map((webtoon, i) => 
            i === index ? {...webtoon, rating: newRating} : webtoon
        )
        );
    }

    const handleReviewChange = (index, newReview) => {
        console.log(index);
        setWebtoons(prev => 
            prev.map((webtoon, i) => 
            i === index ? {...webtoon, review: newReview} : webtoon
        )
        );
    }

    return (
        <div style={{
            backgroundColor:'pink',
            backgroundSize: 'cover', 
            height: '100vh'
        }}>
            <div className="custom-font">
                <NavBar />
                <p style={{paddingTop:'5vh'}}>Here's your current catalog</p>
                
            </div>
            <div style={{display:'flex', gap:'10px', paddingTop: "5vh"}}>
                
                {Array.isArray(webtoons) && webtoons.length > 0 && webtoons.map((item,index)=> (
                   
                <div key={index} className={"webtoon-wrapper custom-font"}>
                    <a href={`/users/${id}/webtoon-info/${item.webtoonID}`}>
                    <b>{item.title}</b> </a>
                     <div style={{alignItems:"center"}}> 
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
                    <button 
                      className= "custom-font"
                                style={{ color: "black", width: "100px", height: "25px", backgroundColor: "pink"}}
                    onClick={() => {setOpenDialog(item.title)}}>Your Review</button>
                   
                        <Dialog
                            open={openDialog===item.title}
                            onClose={() => setOpenDialog(null)} >
                            <div style={{
                                backgroundColor: "pink", 
                                width: "500px", 
                                height: "475px", 
                                borderRadius: "10px", 
                                justifyContent: "center",
                                display: "flex", 
                                flexDirection:"column",
                                alignContent: "center"}}>
                                <div style={{padding: "25px 25px 25px 25px"}}>
                                    <textarea style={{
                                        backgroundColor: "white", 
                                        width: "450px", 
                                        height: "350px",
                                        display: "flex", 
                                        borderRadius: "10px", 
                                        padding: "10px 10px 10px 10px"}} 

                                        value={item.review} 

                                        onChange={(e) => {
                                            const newReview = e.target.value; 
                                            handleReviewChange(index, newReview)}}></textarea>
                                </div>
                                <div
                                style={{display:"flex", justifyContent: "center"}}>
                                <button 
                                className= "custom-font"
                                style={{ color: "black", width: "100px", height: "50px", borderRadius: "10px",backgroundColor: "pink"}}
                                onClick={() => {changeReview(item.review,item.title)}}>Edit Review</button>
                                </div>
                            </div>
                        </Dialog> 
                    
                   
                </div>
              
                ))}
            </div>

        </div>
    )
}