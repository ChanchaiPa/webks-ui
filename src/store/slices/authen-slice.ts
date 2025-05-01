import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { env } from '../../Environment';
import { _loadingStart, _loadingFinish } from './loading-slice';
import { _clear_state as _clear_agent } from './agent-slice';
import { _clear_state as _clear_onhand } from './onhand-slice';
import { _clear_state as _clear_ticket } from './ticket-slice';
import { _clear_state as _clear_in_out } from './in-out-slice';



type AuthenState = {
  userid:   string | null,
  username: string | null,
  fullname: string | null,
  level_id: string | null,  
  group_id: string | null,  
  group_name: string | null,  //local calculate
  message:  string | null, 
}

const initialState: AuthenState = {
  userid:   localStorage.getItem('userid'),
  username: localStorage.getItem('username'),
  fullname: localStorage.getItem('fullname'),
  level_id: localStorage.getItem('level_id'),  
  group_id: localStorage.getItem('group_id'), 
  group_name: localStorage.getItem('group_name'),   
  message:  localStorage.getItem('message'),
}

const AuthenSlicer = createSlice({
  name: "authen",
  initialState,
  reducers: {
    _authenSuccess: (state: AuthenState, action: any) => {
      localStorage.setItem('userid',   action.payload.agent_id);
      localStorage.setItem('username', action.payload.login);
      localStorage.setItem('fullname', action.payload.first_name + " " + action.payload.last_name);
      localStorage.setItem('level_id', action.payload.level_id);
      localStorage.setItem('group_id', action.payload.group_id);
      localStorage.setItem('group_name', action.payload.group_name);
      localStorage.setItem('message',  action.payload.message);
      state.userid   = localStorage.getItem('userid');
      state.username = localStorage.getItem('username');
      state.fullname = localStorage.getItem('fullname');
      state.level_id = localStorage.getItem('level_id');
      state.group_id = localStorage.getItem('group_id');
      state.group_name = localStorage.getItem('group_name');
      state.message =  localStorage.getItem('message');  
    },
    _authenFailed: (state: AuthenState, action: any) => { 
      localStorage.clear();
      state.userid   = '';
      state.username = '';
      state.fullname = '';
      state.level_id = '';
      state.group_id = '';
      state.group_name = '';
      state.message  = action.payload.message;
    },
    _authenReset: (state: AuthenState) => {
      localStorage.clear();
      state.userid   = '';
      state.username = '';
      state.fullname = '';
      state.level_id = '';
      state.group_id = '';
      state.group_name = '';
      state.message  = '';  
    },      
  },
});

export const {  _authenSuccess, _authenFailed, _authenReset } = AuthenSlicer.actions
export default AuthenSlicer.reducer







export const LoginAction = (login: any, navigate: any) =>{
  return async (dispatch: any) =>{
      dispatch( _loadingStart() );
      try {
          const config = { withCredentials: true, headers: {'Content-Type': 'application/json;charset=UTF-8'} };
          const response = await axios.post(env.url+"/v1/authen/login", login, config);
          //const resStatus= response.status;
          const resData  = response.data;
          if (resData.userid !== "") {
              const agents = await axios.get(env.url+'/v1/lookup/agent?pageNo=-1&pageSize=-1&totalRec=-1', config);  
              localStorage.setItem("agent_list", JSON.stringify(agents.data)); 
              const groups = await axios.get(env.url+'/v1/lookup/group', config);  
              localStorage.setItem("group_list", JSON.stringify(groups.data));  

              const _groups = groups.data as Array<any>;
              for (let i=0; i<_groups.length; i++) {
                  if (resData.group_id === _groups[i].group_id) {
                      resData.group_name= _groups[i].name;
                      break;
                  }
              }
              dispatch( _loadingFinish() );
              dispatch( _authenSuccess(resData) );
              navigate(env.app_root +"/welcome");     
          }
          else {
              dispatch( _authenFailed(resData) );
          }
      }
      catch(e: any) { 
        dispatch( _loadingFinish() );
        console.log(e);
        
        const payload = {message: 'Login Fail..'};
        dispatch( _authenFailed(payload as any) );
      }
  }
}

export const LogoutAction = (login: any) =>{  //**** get username from local storag */
  return async (dispatch: any) =>{
      dispatch( _loadingStart() );
      try {
          const config = { withCredentials: true, headers: {'Content-Type': 'application/json;charset=UTF-8'} };
          await axios.post(env.url+"/v1/authen/logout", login, config);
          localStorage.clear();
          dispatch( _loadingFinish() );
          dispatch( _authenReset() );
          dispatch( _clear_agent() );
          dispatch( _clear_onhand() );
          dispatch( _clear_ticket() );
          dispatch( _clear_in_out() );
      }
      catch(e: any) { 
        dispatch( _loadingFinish() );
        dispatch( _authenReset() );
        dispatch( _clear_agent() );
        dispatch( _clear_onhand() );
        dispatch( _clear_ticket() );
        dispatch( _clear_in_out() );
      }
  }
}


