import { createSlice } from "@reduxjs/toolkit"
import { _SearchCond, _Ticket } from "../../app/schema"
import { env } from "../../Environment"
import { _authenReset } from "./authen-slice"
import axios from "axios"


type OnhadState = {
    loading: boolean,
    onhand: _Ticket[],
    page1: number,
    total1: number

    inproc: _Ticket[],
    page2: number,
    total2: number
    errmsg: string,
}

const initialState: OnhadState = {
    loading: false,
    onhand: [],
    page1: 1,
    total1: 0,

    inproc: [],
    page2: 1,
    total2: 0,
    errmsg: "?"    
}


const OnhadSlice = createSlice({
    name: 'onhand',
    initialState,
    reducers: {
      _loading: (state: OnhadState) => {
          state.loading = true;
      },
  
      _set_onhand: (state: OnhadState, action: any) => {
          state.loading= false;
          state.page1  = action.payload.page;
          state.total1 = action.payload.total;
          state.onhand = action.payload.list;   
          state.errmsg = action.payload.errmsg;      
      },

      _set_inproc: (state: OnhadState, action: any) => {
        state.loading= false;
        state.page2  = action.payload.page;
        state.total2 = action.payload.total;
        state.inproc = action.payload.list;   
        state.errmsg = action.payload.errmsg;      
      },      
  
      _clear_state: (state: OnhadState) => initialState,
    }  
});  
export const { _loading, _set_onhand, _set_inproc, _clear_state } = OnhadSlice.actions
export default OnhadSlice.reducer
  


export const OnhandAction =(cond: _SearchCond, navigate: any) => {
    const _serviceurl = env.url+'v1/ticket/onhand';
    return async(dispatch: any) => {
        dispatch( _loading() );
        try {
            const config   = { withCredentials: true, headers: {'Content-Type': 'application/json;charset=UTF-8'} };
            const response = await axios.post(_serviceurl, cond, config);  
            const resData  = response.data;
            const resList  = resData.list as any[];
            if (resList.length === 0) {
                console.log("Ticket-Onhand Not Found");
                dispatch( _set_onhand({page: 1, total: 0, list: [], errmsg: 'Not found data...'} as any) );
            }
            else {
                dispatch( _set_onhand({page: cond.pageNo, total: resData.totalRec, list: resList, errmsg: ''} as any) );
            }
        }
        catch(e: any) {
            if (e.response.status === 401) {
              dispatch( _clear_state() );
              dispatch( _authenReset() );
            }
            else {
              dispatch( _set_onhand({page: 1, total: 0, list: [], errmsg: e.message}  as any) );
            }            
        }
    }
} 


export const InProcAction =(cond: _SearchCond, navigate: any) => {
    const _serviceurl = env.url+'v1/ticket/inproc';
    return async(dispatch: any) => {
        dispatch( _loading() );
        try {
            const config   = { withCredentials: true, headers: {'Content-Type': 'application/json;charset=UTF-8'} };
            const response = await axios.post(_serviceurl, cond, config);  
            const resData  = response.data;
            const resList  = resData.list as any[];
            if (resList.length === 0) {
                console.log("Ticket-InProcessing Not Found");
                dispatch( _set_inproc({page: 1, total: 0, list: [], errmsg: 'Not found data...'} as any) );
            }
            else {
                dispatch( _set_inproc({page: cond.pageNo, total: resData.totalRec, list: resList, errmsg: ''} as any) );
            }
        }
        catch(e: any) {
            if (e.response.status === 401) {
              dispatch( _clear_state() );
              dispatch( _authenReset() );
            }
            else {
              dispatch( _set_inproc({page: 1, total: 0, list: [], errmsg: e.message}  as any) );
            }            
        }
    }
} 