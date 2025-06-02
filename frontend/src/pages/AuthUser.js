
import {Link} from "react-router-dom";

export default function AuthUser(){
   
    
    return(
        <div>
            <h1>User Authenticated</h1>
            <Link to="/"><button>Go back to home</button></Link>
            <Link to="/my-webtoons"><button>Continue to app</button></Link>
        </div>
    );
}