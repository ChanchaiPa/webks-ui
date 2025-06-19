import { createSlice } from '@reduxjs/toolkit'
import { env } from '../../Environment';
import axios from 'axios';
import { _authenReset } from './authen-slice';
import { _User, initUser } from '../../app/schema';



type AgentState = {
    loading: boolean,
    list: _User[],
    data: _User,
    page: number,
    total: number
    errmsg: string,
}

const initialState: AgentState = {
    loading: false,
    list: [],
    data: initUser(),
    page:  1,
    total: 0,
    errmsg: '?',
}


const AgentSlice = createSlice({
  name: 'agent',
  initialState,
  reducers: {
    _loading: (state: AgentState) => {
        state.loading = true;
    },

    _set_list: (state: AgentState, action: any) => {
        state.loading= false;
        state.page   = action.payload.page;
        state.total  = action.payload.total;
        state.list   = action.payload.list;   
        state.errmsg = action.payload.errmsg;      
    },

    _set_data: (state: AgentState, action: any) => {
        state.loading= false;
        state.data   = action.payload.data;   
        state.errmsg = action.payload.errmsg;         
    },

    _clear_state: (state: AgentState) => initialState,

    //*******************************/
    /*_param1_change: (state: GroupState, action: any) => {
        state.param1 = action.payload.param1;
    },*/
  }  
});

export const { _loading, _set_list, _set_data, _clear_state } = AgentSlice.actions
export default AgentSlice.reducer



export const SearchAction = (pageNo: number, pageSize: number, totalRec: number, navigate: any) =>{
    let _param = "";
    _param += "?pageNo="   + pageNo;
    _param += "&pageSize=" + pageSize;
    _param += "&totalRec=" + totalRec;

    const _serviceurl = env.url+'v1/lookup/agent' + _param;
    return async (dispatch: any) =>{
        dispatch( _loading() );
        try {
            const config   = { withCredentials: true, headers: {'Content-Type': 'application/json;charset=UTF-8'} };
            const response = await axios.get(_serviceurl, config);  
            const resData  = response.data;
            if (resData.list.length === 0) {
                alert("Not found data...");
                dispatch( _set_list({page: 0, total: 0, list: [], errmsg: 'Not found data...'} as any) );
            }
            else {
                dispatch( _set_list({page: pageNo, total: resData.totalRec, list: resData.list, errmsg: ''} as any) );
            }
        }
        catch(e: any) {
            if (e.response.status === 401) {
                dispatch( _clear_state() );
                dispatch( _authenReset() );
            }
            else {
                dispatch( _set_list({page: 0, total: 0, list: [], errmsg: e.message} as any) );
            }
        }
    }
}


/*export const SaveAction = (data: Group, navigate: any) =>{
    const _serviceurl = env.url+'/service/group/save';
    return async (dispatch: any) =>{
        dispatch( _loading() );
        try {
            const config   = { withCredentials: true, headers: {'Content-Type': 'application/json;charset=UTF-8'} };
            const response = await axios.post(_serviceurl, data, config);   
            const resData  = response.data;
            dispatch( _set_data({data: resData, errmsg: ''}) );           
        }
        catch(e: any) {
            if (e.response.status === 401) {
                dispatch( _clear_state() );
                dispatch( _authenReset() );
            }
            else {
                dispatch( _set_data({data: data, errmsg: e.message}) );
            }
        }
    }
}*/


/*export const GetdataAction = (grp_id: string, navigate: any) =>{
    const _serviceurl = env.url+'/service/group/' + grp_id;
    return async (dispatch: any) =>{
        dispatch( _loading() );
        try {
            const config   = { withCredentials: true, headers: {'Content-Type': 'application/json;charset=UTF-8'} };
            const response = await axios.get(_serviceurl, config);   
            const resData  = response.data;
            dispatch( _set_data({data: resData, errmsg: ''}) );           
        }
        catch(e: any) {
            if (e.response.status === 401) {
                dispatch( _clear_state() );
                dispatch( _authenReset() );
            }
            else {
                dispatch( _set_data({data: null, errmsg: e.message}) );
            }
        }
    }    
}*/