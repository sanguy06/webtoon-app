import axios from "axios";
import {useState} from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function MyWebtoons () {
    const token = localStorage.getItem("accessToken");
    const [webtoons, setWebtoons] = useState([]);
    const {id} = useParams();
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
    const webtoonsFormat = webtoons.map((webtoon)=>
        <ul>{webtoon}</ul>
    );
    return (
        <div>
            <h1>My Webtoons</h1>
            <button onClick={getWebtoons}></button>
            <div style={{display:'flex', gap:'10px'}}>
                {webtoons.map((item,index)=> (
                   <div key={index} style={{
                    width:'100px', 
                    height: '100px', 
                    backgroundColor: 'pink',
                    border: '1px solid black',
                   }}>
                    {item}
                    </div>

                ))}
            </div>
            <button onClick={navigateToSearch}>Search Library</button>
        </div>
    );
}