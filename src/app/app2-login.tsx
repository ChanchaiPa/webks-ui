import React, { useEffect, useState } from 'react'
import "../css/global.css"
import "../css/login.css"
import { _User, initUser } from './schema';
import { RootState, useAppDispatch } from '../store/store';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LoginAction, _authenReset } from '../store/slices/authen-slice';


export default function App2Login() {
  const [login, setLogin] = useState( {username: '', password: ''} );
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const authenState = useSelector((state: RootState) => state.AuthenSlicer);
  const loadingState= useSelector((state: RootState) => state.LoadingSlicer);  

  useEffect(() => {
    console.log("CLEAR LOAFGIN");
    setLogin( {username: '', password: ''} );
  }, [])
  

  const handleKeypress = (e: any) => { 
    if (e.key === 'Enter')
        Submit();
  };  
  const closeAlert = () => {
    setLogin({...login, password: ''});
    dispatch( _authenReset({} as any) );
  }

  const Submit = () => {
    dispatch( LoginAction(login, navigate) );
  }



  return (
    <span className='login'>
      {loadingState.isLoading ? <div className='loading'>
          <div className="spinner-grow text-success" role="status" />
          <span>กรุณารอสักครู่</span>
      </div> : null}

      <div className="main">
        <div className="main-logo">
            <div style={{textAlign: 'center', marginTop: -3}}><img src={require("../assets/logo_thaisri.svg").default} height="30" title="Logo"/></div>
            <div className="content">
                <div className="content-header">Knowledge Service</div>
                <div className="content-form">
                    <input type="text" placeholder="Email address" required value={login.username} 
                        onChange={(e) => setLogin({...login, username: e.target.value.trim()})}/>
                    <input type="password" placeholder="Password" required value={login.password} 
                        onChange={(e) => setLogin({...login, password: e.target.value.trim()})}
                        onKeyUp={(e) => handleKeypress(e)}/>
                    <a href="#" style={{textDecoration: 'none', fontSize: '12px', color: 'blue'}}>Forgot password?</a>
                    <input type="submit" value="Login" onClick={() => Submit()}/>
                </div>
            </div> 
        </div>

        <div className="content-err alert alert-danger alert_custom" role="alert" 
            style={{display: (authenState.message===null || authenState.message==="" ? 'none' : '')}}>
            <span className="alert_custom_close" onClick={() => closeAlert()}>&times;</span>{authenState.message}
        </div> 

      </div>
    </span>
  )
}
