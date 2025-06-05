
import SearchBar from "../components/SearchBar";
import {useState} from "react";
import SearchResultsList from "../components/SearchResultsList";
export default function SearchWebtoons() {
    
    const [results, setResults] = useState([]);

    return (
        <div>
            <h1>Search Webtoons</h1>
            <div className="search-bar-container">
                <SearchBar setResults={setResults}/>
                <SearchResultsList results={results}/>
            </div>
        </div>
    )
}