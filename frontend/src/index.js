import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import SignUp from './pages/SignUp';
import AuthUser from './pages/AuthUser';
import Login from './pages/Login';
import UserNotFound from './pages/UserNotFound';
import MyWebtoons from './pages/MyWebtoons';
import SearchWebtoons from './pages/SearchWebtoons';
import WebtoonInfo from './pages/WebtoonInfo';
import HomePage from './pages/HomePage';
import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider} from "react-router-dom";

/*
  user should be able to login and access their webtoons, add webtoons
  should be a search/browse page 

*/
const router = createBrowserRouter([
   {path:"/", element: <App />},
    {path: "/signup", element: <SignUp />},
    {path:"/users/:id", element:<AuthUser />},
    {path:"/login", element:<Login />},
    {path:"/usernotfound", element:<UserNotFound />},
    {path:"/users/:id/home-page", element: <HomePage />},
    {path:"/users/:id/my-webtoons", element:<MyWebtoons />},
    {path:"/users/:id/search-webtoons", element:<SearchWebtoons />},
    {path:"/users/:id/webtoon-info/:webtoonID", element:<WebtoonInfo />}

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
