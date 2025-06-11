import React from "react"; 
import { IconButton } from "@mui/material";
import {FaSearch} from "react-icons/fa";
import {SiBookstack} from "react-icons/si";
import {useParams, useNavigate} from "react-router-dom"; 
import "../App.css";

export default function NavBar() {
    const navigate = useNavigate(); 
    const {id} = useParams(); 
    return (
        <div>
            <nav className="navbar">
                <div className="navdiv" >
                    <button className = "custom-font-white"style={{
                        backgroundColor:"transparent",
                        width: "250px", 
                        height: "50px", 
                        fontSize: "35px", 
                        display: "flex", 
                        border: "none"
                        }}onClick={()=>navigate(`/users/${id}/home-page`)}>ToonReads</button>
        
                    <ul >
                        <li><IconButton onClick={()=>navigate(`/users/${id}/search-webtoons`)}><FaSearch size={30} style={{color:"pink"}}/></IconButton></li>
                        <li><IconButton onClick={()=> navigate(`/users/${id}/my-webtoons`)}><SiBookstack size={40} style={{color:"pink"}}/></IconButton></li>
                    </ul>

                </div>
            </nav>
        </div>
    )
}