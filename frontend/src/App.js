import logo from './logo.svg';
import './App.css';
import SignUp from './pages/SignUp';
import {useState, useEffect} from "react";
import axios from "axios";
import {createBrowserRouter, Link, useNavigate, RouterProvider} from "react-router-dom";
import backgroundImage from './assets/webtoonArt.jpg';

function App() {
  
  const navigate= useNavigate();
 
  
  return ( 
    <div
      style = {{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover', 
          width: '100vw', 
          height: '100vh', margin: 0
        }}
    >
        <div style={{
            height: '100vh',
            fontSize: '100px', 
            fontFamily: "TitleFont", 
            display: "flex", 
            justifyContent: "center", 
            alignItems: 'center', 
            flexDirection: 'column'
            }} className="custom-font">
            ToonReads
          
       
        <Link to="/signup">
          <button style={{
            backgroundColor: 'pink',
            color: 'black',    
            padding: '10px 20px', 
            display: 'flex'
            }}
            className="custom-font">Signup</button>
          </Link>
        <Link to="/login">
          <button style={{
            backgroundColor: 'pink', 
            color: 'black',     
            padding: '10px 20px', 
            display: 'flex'
          }} className="custom-font">Login</button>
        </Link>
        
       </div>
    </div>
  );
}

export default App;
