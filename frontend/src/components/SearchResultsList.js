import React from "react";
import {Link, useNavigate} from "react-router-dom";
import {useParams} from "react-router";

export default function SearchResultsList ({results}) {
    const navigate = useNavigate();
    const {id} = useParams();
    function handleClick(result) {
        console.log(id);
        navigate(`/users/${id}/webtoon-info/${result.webtoon_id}`, {replace:true});
   }

    return (
        <div className="results-list">{
            results.map((result,idx)=>{
                return (
                    <div key={idx}>
                        <button onClick = {()=>handleClick(result)} className="result-buttons" maxheight="65px" display="flex">
                            <div style={{textAlign:'left'}}><b>{result.title}</b></div> <br/>
                            <div style={{marginLeft: "5px", textAlign: 'left', alignItems:"flex-end"}} >By: {result.author}</div>
                        </button>
                    </div>
                    )
                })}
        </div>
    )
}