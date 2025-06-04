import React, {useState} from "react";
import {FaSearch} from "react-icons/fa";
import axios from "axios";
import "./SearchBar.css";


export default function SearchBar() {
const [input, setInput] = useState("");
let webtoons = [];
const fetchData = async (value) => {
    await axios.get("http://localhost:5555/webtoons")
                .then((res)=>{
                    
                    console.log(res.data);
                    
                    
                    const results = res.data.filter((webtoon)=>{
                        return webtoon.title;
                    });
                    console.log(results);
                    
                });
                
}

const handleChange = (value) => {
    setInput(value);
    fetchData(value);
}

    return(
        <div className="input-wrapper">
            <FaSearch id="search-icon" />
            <input placeholder="Type to search..." value={input} onChange={(e) =>
                handleChange(e.target.value)}
            />
        </div>
    )
}