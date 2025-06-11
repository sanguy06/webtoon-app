
import SearchBar from "../components/SearchBar";
import SearchResultsList from "../components/SearchResultsList";
import {useState} from "react";
import NavBar from "../components/NavBar";

export default function SearchWebtoons() {
    
    const [results, setResults] = useState([]);

    return (
        <div style={{
            backgroundColor: "pink", 
            backgroundSize: "cover", 
            height: "100vh"
        }}>
           
            <NavBar />
            <div>
                <p style={{
                    textAlign: "center",
                    paddingTop: "50px", 
                    fontSize: "30px"
                }}className="custom-font">Explore</p>
            <div className="search-bar-container">
                <SearchBar setResults={setResults}/>
                <SearchResultsList results={results}/>
            </div>
            </div>
        </div>
    )
}