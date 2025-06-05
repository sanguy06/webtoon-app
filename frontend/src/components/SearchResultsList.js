import React from "react";

export default function SearchResultsList ({results}) {
    return (
        <div className="results-list">
            {
                results.map((result,idx)=>{
                    return (
                    <div 
                        key={idx}>{result.title}
                    </div>
                    )
                })
            }
        </div>
    )
}