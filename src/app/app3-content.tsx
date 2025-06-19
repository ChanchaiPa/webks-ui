import React, { createContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import { LogoutAction } from '../store/slices/authen-slice';
import { RootState, useAppDispatch } from '../store/store';
import { useSelector } from 'react-redux';
import axios from 'axios';
import "../css/content.css"
import { env } from '../Environment';
import { App4Welcome } from './app4-welcome';
import Home from './home/home';
import Search from './search/search';
import Inbox from './inbox/inbox';
import Outbox from './outbox/outbox';
import Setting from './setting/setting';
import Ticket from './ticket/ticket'; 


export type ContextType = {
    mode: string,
    setContextMode: (m: string) => void,
}
export const ContextRoot = createContext<ContextType>({
    mode: '',
    setContextMode: (m) => {},   
});


export default function App3Content() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const authenState = useSelector((state: RootState) => state.AuthenSlicer);
    const loadingState= useSelector((state: RootState) => state.LoadingSlicer);  

    const [mode, setMode] = useState<string>("V"); // V or E  
    const setContextMode  =(mode:  string) => setMode(mode);

    const [currtab, setCurrtab] = useState("home");
    useEffect(() => {
        console.log("AppContent path = " + location.pathname);
    }, [location.pathname]);   
    

    const config = { withCredentials: true, headers: {'Content-Type': 'application/json;charset=UTF-8'} };
    useEffect(() => {
        console.log("AppContent load Lookup");
        axios.get(env.url+'v1/lookup/system', config).then(result => {
            localStorage.setItem("system_list", JSON.stringify(result.data));
        }).catch(error => {
            console.log(error.message);
        });

        axios.get(env.url+'v1/lookup/problem_status', config).then(result => {
            localStorage.setItem("problem_status_list", JSON.stringify(result.data));
        }).catch(error => {
            console.log(error.message);
        });

        axios.get(env.url+'v1/lookup/call_code', config).then(result => {
            localStorage.setItem("call_code_list", JSON.stringify(result.data));
        }).catch(error => {
            console.log(error.message);
        }); 
        
        axios.get(env.url+'v1/lookup/priority_level', config).then(result => {
            localStorage.setItem("priority_list", JSON.stringify(result.data));
        }).catch(error => {
            console.log(error.message);
        });   
        
        axios.get(env.url+'v1/lookup/severity_level', config).then(result => {
            localStorage.setItem("severity_list", JSON.stringify(result.data));
        }).catch(error => {
            console.log(error.message);
        });          
    }, []);  

    const Logout = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        if (window.confirm("Do you want to Logout?")) {
            dispatch( LogoutAction( {username: authenState.username, password: ''} ) ); 
        }
    }

    const RouteToPath = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, currtab: string) => {
        e.preventDefault();
        setCurrtab(currtab);
        navigate(env.app_root +"/"+ currtab + "?c=1"); //flag for clear
    } 


    const logo_sm = require("../assets/logo_thaisri_sm.png")
    return(<ContextRoot.Provider value={{ mode, setContextMode }}>
    {loadingState.isLoading ? <div className='loading'>
        <div className="spinner-grow text-success" role="status" />
        <span>กรุณารอสักครู่</span>
    </div> : null}

    <div className="wrapper">
        <div className="sidebar">
            {/** profile image & text **/} 
            <div className="profile">
                <img src={require("../assets/orange.jpg")} title="Logo"/>
                <h4>{authenState.username}</h4>
                <p>{authenState.group_name}</p>
            </div>
            <div style={{position: 'absolute', left: '10px', top: '-5px', width: '45px', height: '40px', backgroundImage: `url(${logo_sm})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}}></div>

            {/** menu item **/} 
            <ul style={{padding: 0}}>
                <li>
                    <a href="#" onClick={(e) => RouteToPath(e, 'home')} className={currtab === "home" ? "active" : ""}>
                        <span className="icon"><i className="bi bi-house"></i></span>&nbsp;
                        <span className="item">Home</span>
                    </a>
                </li>
                <li>
                    <a href="#" onClick={(e) => RouteToPath(e, 'search')} className={currtab === "search" ? "active" : ""}>
                        <span className="icon"><i className="bi bi-search"></i></span>&nbsp;
                        <span className="item">Search</span>
                    </a>
                </li>
                <li>
                    <a href="#" onClick={(e) => RouteToPath(e, 'inbox')} className={currtab === "inbox" ? "active" : ""}>
                        <span className="icon"><i className="bi bi-inbox"></i></span>&nbsp;
                        <span className="item">Inbox</span>
                    </a>
                </li>
                <li>
                    <a href="#" onClick={(e) => RouteToPath(e, 'outbox')} className={currtab === "outbox" ? "active" : ""}>
                        <span className="icon"><i className="bi bi-cursor"></i></span>&nbsp;
                        <span className="item">Outbox</span>
                    </a>
                </li>
                <li>
                    <a href="#" onClick={(e) => RouteToPath(e, 'setting')} className={currtab === "setting" ? "active" : ""}>
                        <span className="icon"><i className="bi bi-gear"></i></span>&nbsp;
                        <span className="item">Settings</span>
                    </a>
                </li>
            </ul>

            {/** Logout **/} 
            <div className="logout" style={{position: 'fixed', bottom: 0, left: 20, width: 'inherit', height: '50px'}}>
                <a href="#" onClick={(e) => Logout(e)}>
                    <span className="icon" style={{color: 'red'}}><h5><i className="bi bi-box-arrow-left"></i></h5></span>&nbsp;
                    <span className="item" style={{color: 'red'}}><b>Logout</b></span>
                </a>       
            </div>        
        </div>  
    </div>  

    <div className="contents">
        {location.pathname === env.app_root +"/welcome" && <div><App4Welcome></App4Welcome></div> }
        {location.pathname === env.app_root +"/home" && <Home></Home> }
        {location.pathname === env.app_root +"/search" && <Search></Search> }
        {location.pathname === env.app_root +"/inbox" && <Inbox></Inbox> }
        {location.pathname === env.app_root +"/outbox" && <Outbox></Outbox> }
        {location.pathname === env.app_root +"/setting" && <Setting></Setting> }
        {location.pathname === env.app_root +"/ticket" && <Ticket></Ticket> }
    </div>
    </ContextRoot.Provider>)
}