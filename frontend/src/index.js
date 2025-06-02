import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import SignUp from './pages/SignUp';
import AuthUser from './pages/AuthUser';
import Login from './pages/Login';
import UserNotFound from './pages/UserNotFound';
import MyWebtoons from './pages/MyWebtoons';
import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider} from "react-router-dom";

const router = createBrowserRouter([
   {path:"/", element: <App />},
    {path: "/signup", element: <SignUp />},
    {path:"/auth", element:<AuthUser />},
    {path:"/login", element:<Login />},
    {path:"/usernotfound", element:<UserNotFound />},
    {path:"/my-webtoons", element:<MyWebtoons />},

]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router = {router}/>
  </StrictMode>
)
/*
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);*/

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
