import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from "react";
import axios from "axios";

function App() {
  const [webtoons, setWebtoons] = useState(null);
  useEffect(()=>{

  },[])
  const fetchWebtoons = async () =>{
    // Fetch the webtoons 
    const res = axios.get("http://localhost:5555/webtoons");
    // Set webtoons 
    console.log(res);
  }
  const signUp = async()=>{
    const res = axios.post("http://")
  }
  return (
    <div>
        <h1 style={{textAlign:'center'}}>ToonReads</h1>
        <button style={{
          backgroundColor: 'pink',
          color: 'black',
          font:'sans-serif',
          padding: '10px 20px'
          }}>Signup</button>
        <button style={{
          backgroundColor: 'pink', 
          color: 'black',
          font: 'sans-serif',
          padding: '10px 20px'
        }}>Login</button>

    </div>
  );
}

export default App;
