import logo from './logo.svg';
import './App.css';
import SignUp from './pages/SignUp';
import {useState, useEffect} from "react";
import axios from "axios";
import {createBrowserRouter, Link, useNavigate, RouterProvider} from "react-router-dom";

function App() {
  
  const navigate= useNavigate();
 
  
  return (
    <div>
        <h1 style={{textAlign:'center'}}>ToonReads</h1>
        <Link to="/signup">
          <button style={{
            backgroundColor: 'pink',
            color: 'black',
            font:'sans-serif',
            padding: '10px 20px'
            }}>Signup</button>
          </Link>
        <Link to="/login">
          <button style={{
            backgroundColor: 'pink', 
            color: 'black',
            font: 'sans-serif',
            padding: '10px 20px'
          }}>Login</button>
        </Link>

    </div>
  );
}

export default App;
