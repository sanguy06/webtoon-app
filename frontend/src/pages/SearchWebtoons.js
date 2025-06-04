
import SearchBar from "../components/SearchBar";

export default function SearchWebtoons() {
    return (
        <div>
            <h1>Search Webtoons</h1>
            <div className="search-bar-container">
                <SearchBar />
                <div>SearchResults</div>
            </div>
        </div>
    )
}