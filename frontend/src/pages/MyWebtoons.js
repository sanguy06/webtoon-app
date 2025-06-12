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
    const [openDialog, setOpenDialog] = useState();
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
            await axios.get(`http://localhost:5555/users/${id}/get-my-ratings`, { 
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
            await axios.get(`http://localhost:5555/users/${id}/get-my-reviews`, { 
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
        } 
        else 
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
    const changeReview = async(userReview, title) => {
        /*
        const ogReview = await axios.get(`http://localhost:5555/users/${id}/get-review?webtoonTitle=${title}`, {
            headers: {
                Authorization:  `Bearer ${token}`
            }
        })
        if(ogReview.data==="")
        {
            await axios.post(`http://localhost:5555/users/${id}/add-review`, {
            webtoonTitle: title, 
            review: userReview}, 
            {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
        } 
        else {*/
            await axios.post(`http://localhost:5555/users/${id}/update-review`, {
                webtoonTitle: title, 
                review: userReview } ,
                {
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                })
            
        }
    
    const handleRatingChange = (index, newRating) => {
        setWebtoons(prev => 
            prev.map((webtoon, i) => 
            i === index ? {...webtoon, rating: newRating} : webtoon
        )
        );
    }

    const handleReviewChange = (index, newReview) => {
        setWebtoons(prev => 
            prev.map((webtoon, i) => 
            i === index ? {...webtoon, review: newReview} : webtoon
        )
        );
    }

    const handleOpenDialog = () => {
        setOpenDialog(true); 
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
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
                    <button onClick={handleOpenDialog}>Click</button>
                    <div>

                        <Dialog
                            open={openDialog}
                            onClose={handleCloseDialog}
                        >
                            <div style={{
                                backgroundColor: "pink", 
                                width: "500px", 
                                height: "300px", 
                                borderRadius: "10px", 
                                justifyContent: "center",
                                display: "flex", 
                                flexDirection:"column"}}>
                                <div style={{padding: "25px"}}>
                                <textarea style={{
                                    backgroundColor: "white", 
                                    width: "450px", 
                                    height: "250px",
                                    display: "flex", 
                                    borderRadius: "10px" }} 

                                    value={item.review} 

                                    onChange={(e)=>{setReview(e.target.value)}}></textarea>
                                </div>
                                <button onClick={changeReview}>Submit</button>
                            </div>
                        </Dialog> 
                    </div>
                   
                   </div>
              
                ))}
            </div>

        </div>
    )
}