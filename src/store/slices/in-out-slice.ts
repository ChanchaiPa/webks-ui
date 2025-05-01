import { createSlice } from "@reduxjs/toolkit";
import { _InOut } from "../../app/schema"
import { env } from "../../Environment";
import axios from "axios";
import { _authenReset } from "./authen-slice";


type InOutState = {
    loading: boolean,
    inbox: _InOut[],
    outbox: _InOut[],
    page: number,
    total: number
    errmsg: string,
}

const initialState: InOutState = {
    loading: false,
    inbox: [],
    outbox: [],
    page: 1,
    total: 0,
    errmsg: "?"    
}

const InOutSlice = createSlice({
    name: 'inout',
    initialState,
    reducers: {
      _loading: (state: InOutState) => {
          state.loading = true;
      },
  
      _set_inbox: (state: InOutState, action: any) => {
          state.loading= false;
          state.inbox  = action.payload.list;   
          state.errmsg = action.payload.errmsg;      
      },

      _set_outbox: (state: InOutState, action: any) => {
        state.loading= false;
        state.outbox = action.payload.list; 
        state.page   = action.payload.page;
        state.total  = action.payload.total;
          
        state.errmsg = action.payload.errmsg;      
      },      
  
      _clear_state: (state: InOutState) => initialState,
    }  
});  
export const { _loading, _set_inbox, _set_outbox, _clear_state } = InOutSlice.actions
export default InOutSlice.reducer



export const InboxAction =() => {
    const _serviceurl = env.url+'/v1/ticket/inbox';
    return async(dispatch: any) => {
        dispatch( _loading() );
        try {
            const config   = { withCredentials: true, headers: {'Content-Type': 'application/json;charset=UTF-8'} };
            const response = await axios.get(_serviceurl, config);  
            const resData  = response.data;
            const resList  = resData as any[];
            dispatch( _set_inbox({list: resList, errmsg: ''} as any) );
        }
        catch(e: any) {
            if (e.response.status === 401) {
              dispatch( _clear_state() );
              dispatch( _authenReset() );
            }
            else {
              dispatch( _set_inbox({list: [], errmsg: e.message}  as any) );
            }            
        }
    }
}

export const OutboxAction =(pageNo: number, pageSize: number, totalRec: number) => {
    let _param = "";
    _param += "?pageNo="   + pageNo;
    _param += "&pageSize=" + pageSize;
    _param += "&totalRec=" + totalRec;
    const _serviceurl = env.url+'/v1/ticket/outbox' + _param;
    return async(dispatch: any) => {
        dispatch( _loading() );
        try {
            const config   = { withCredentials: true, headers: {'Content-Type': 'application/json;charset=UTF-8'} };
            const response = await axios.get(_serviceurl, config);  
            const resData  = response.data;
            const resList  = resData.list as any[];
            dispatch( _set_outbox({page: pageNo, total: resData.totalRec, list: resList, errmsg: ''} as any) );
        }
        catch(e: any) {
            if (e.response.status === 401) {
              dispatch( _clear_state() );
              dispatch( _authenReset() );
            }
            else {
                dispatch( _set_outbox({page: 0, total: 0, list: [], errmsg: e.message} as any) );
            }            
        }
    }
} 