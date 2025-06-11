import React, {useState} from "react";
import {FaSearch} from "react-icons/fa";
import {Autocomplete} from "@mui/material";
import {TextField} from "@mui/material";
import axios from "axios";
import "./SearchBar.css";


export default function SearchBar({setResults}) {
    const [input, setInput] = useState("");

    const fetchData = async (value) => {
        await axios.get(`http://localhost:5555/search-webtoons?webtoonTitle=${value}`)
                    .then((res)=>{
                        setResults(res.data);
         })
    }

    const handleChange = (value) => {
        setInput(value);
        fetchData(value);
    }

    return (
        <div className="input-wrapper">
            <FaSearch id="search-icon" />
            <input style={{font: "custom-font"}}placeholder="Search webtoons..." value={input} onChange={(e) =>
                handleChange(e.target.value)}
            />
            
        </div>
    )
}

