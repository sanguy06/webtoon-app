
import {useParams, Link} from "react-router-dom";

export default function AuthUser(){
   
    const {id} = useParams();
    
    return(
        <div>
            <h1>User Authenticated</h1>
            <Link to="/"><button>Go back to home</button></Link>
            <Link to={`/users/${id}/my-webtoons`}><button>Continue to app</button></Link>
        </div>
    );
}