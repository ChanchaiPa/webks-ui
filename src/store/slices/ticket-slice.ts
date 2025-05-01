import { createSlice } from "@reduxjs/toolkit";
import { _Attachment, _Ticket, initTicket } from "../../app/schema";
import { env } from "../../Environment";
import axios from 'axios';
import { _authenReset } from './authen-slice';


type TicketState = {
    loading: boolean,
    ticket:  _Ticket,
    ssimL2: [],
    ssimL3: [],
    ssimL4: [],
    attach: _Attachment[]
    errmsg:  string,
}

const initialState: TicketState = {
    loading: false,
    ticket:  initTicket(),
    ssimL2: [],
    ssimL3: [],
    ssimL4: [],
    attach: [],
    errmsg:  '?',
}

const TicketSlice = createSlice({
    name: 'ticket',
    initialState,
    reducers: {
      _loading: (state: TicketState) => {
          state.loading = true;
      },

      _set_ticket: (state: TicketState, action: any) => {
          state.loading= false;
          state.ticket = action.payload.ticket;
          state.errmsg = action.payload.errmsg;
      },

      _set_category: (state: TicketState, action: any) => {
          state.loading= false;
          if (action.payload.ssimL2)    state.ssimL2 = action.payload.ssimL2;
          if (action.payload.ssimL3)    state.ssimL3 = action.payload.ssimL3;
          if (action.payload.ssimL4)    state.ssimL4 = action.payload.ssimL4;
          state.errmsg = action.payload.errmsg;
      },

      _set_attach: (state: TicketState, action: any) => {
        state.loading= false;
        state.attach = action.payload.attach;
        state.errmsg = action.payload.errmsg;
      },

      _clear_state: (state: TicketState) => initialState,
    }  
});

export const { _loading,_set_ticket, _set_category, _set_attach, _clear_state } = TicketSlice.actions
export default TicketSlice.reducer



export const GetdataAction = (ticket_id: number, navigate: any) =>{
    let _serviceurl = "";
    if (ticket_id===0)
        _serviceurl = env.url+'/v1/ticket/create';
    else
        _serviceurl = env.url+'/v1/ticket/content/' + ticket_id;
    //const _serviceurl = env.url+'/v1/ticket/' + ticket_id;
    return async (dispatch: any) => {
        dispatch( _loading() );
        try {
            const config   = { withCredentials: true, headers: {'Content-Type': 'application/json;charset=UTF-8'} };
            const response = await axios.get(_serviceurl, config);   
            const ticket   = response.data;
            
            let ssimL2 = [];
            if (ticket.system_id > 0) {
                const result = await axios.get(env.url+'/v1/lookup/subsystem/'+ticket.system_id, config); 
                ssimL2 = result.data; 
            }
            let ssimL3 = [];
            if (ticket.subsystem_id > 0) {
                const result = await axios.get(env.url+'/v1/lookup/item/'+ticket.system_id+"/"+ticket.subsystem_id, config);  
                ssimL3 = result.data; 
            }
            let ssimL4 = [];
            if (ticket.item_id > 0) {
                const result = await axios.get(env.url+'/v1/lookup/module/'+ticket.system_id+"/"+ticket.subsystem_id+"/"+ticket.item_id, config);  
                ssimL4 = result.data; 
            }

            dispatch( _set_ticket({ticket: ticket, errmsg: ''} as any) );
            dispatch( _set_category({ssimL2: ssimL2, ssimL3: ssimL3, ssimL4: ssimL4, errmsg: ''} as any) );  
        }
        catch(e: any) {
            if (e.response.status === 401)  {  dispatch( _clear_state() ); dispatch( _authenReset() );  }
            else                            {  dispatch( _set_ticket({ticket: null, errmsg: e.message} as any) );  }
        }
    }    
}

export const UpdatedataAction = (param: _Ticket, navigate: any) =>{
    const _serviceurl = env.url+'/v1/ticket/update';
    return async (dispatch: any) => {
        dispatch( _loading() );
        try {
            const config   = { withCredentials: true, headers: {'Content-Type': 'application/json;charset=UTF-8'} };
            const response = await axios.post(_serviceurl, param, config);   
            const ticket   = response.data;
            dispatch( _set_ticket({ticket: ticket, errmsg: ''} as any) );           
        }
        catch(e: any) {
            if (e.response.status === 401)  {  dispatch( _clear_state() ); dispatch( _authenReset() );  }
            else                            {  dispatch( _set_ticket({ticket: null, errmsg: e.message} as any) );  }
        }
    }
}

export const SetCategoryAction = (system_id: number, subsystem_id: number, item_id: number) =>{
    return async (dispatch: any) =>{ 
        dispatch( _loading() );
        try {
            const config = { withCredentials: true, headers: {'Content-Type': 'application/json;charset=UTF-8'} };
            let ssimL2 = [];
            if (system_id > 0) {
                const result = await axios.get(env.url+'/v1/lookup/subsystem/'+system_id, config); 
                ssimL2 = result.data; 
            }
            let ssimL3 = [];
            if (subsystem_id > 0) {
                const result = await axios.get(env.url+'/v1/lookup/item/'+system_id+"/"+subsystem_id, config);  
                ssimL3 = result.data; 
            }
            let ssimL4 = [];
            if (item_id > 0) {
                const result = await axios.get(env.url+'/v1/lookup/module/'+system_id+"/"+subsystem_id+"/"+item_id, config);  
                ssimL4 = result.data; 
            }
            dispatch( _set_category({ssimL2: ssimL2, ssimL3: ssimL3, ssimL4: ssimL4, errmsg: ''} as any) );     
        }
        catch(e: any) {
            if (e.response.status === 401)  {  dispatch( _clear_state() ); dispatch( _authenReset() );  }
            else                            {  dispatch( _set_category({ssimL2: [], ssimL3: [], ssimL4: [], errmsg: e.message} as any) );  }
        }
    }    
}

export const GetSubsystemAction = (system_id: number) =>{
    return async (dispatch: any) =>{
        dispatch( _loading() );
        try {
            const config = { withCredentials: true, headers: {'Content-Type': 'application/json;charset=UTF-8'} };
            const response = await axios.get(env.url+'/v1/lookup/subsystem/'+system_id, config); 
            const ssimL2 = response.data;
            dispatch( _set_category({ssimL2: ssimL2, ssimL3: [], ssimL4: [], errmsg: ''} as any) );           
        }
        catch(e: any) {
            if (e.response.status === 401) {
                dispatch( _clear_state() );
                dispatch( _authenReset() );
            }
            else {
                dispatch( _set_category({ssimL2: [], ssimL3: [], ssimL4: [], errmsg: e.message} as any) );
            }
        }
    }    
}

export const GetItemAction = (system_id: number, subsystem_id: number) =>{
    return async (dispatch: any) =>{
        dispatch( _loading() );
        try {
            const config = { withCredentials: true, headers: {'Content-Type': 'application/json;charset=UTF-8'} };
            const response = await axios.get(env.url+'/v1/lookup/item/'+system_id+"/"+subsystem_id, config);  
            const ssimL3 = response.data;
            dispatch( _set_category({ssimL3: ssimL3, ssimL4: [], errmsg: ''} as any) );           
        }
        catch(e: any) {
            if (e.response.status === 401) {
                dispatch( _clear_state() );
                dispatch( _authenReset() );
            }
            else {
                dispatch( _set_category({ssimL3: [], ssimL4: [], errmsg: e.message} as any) );
            }
        }
    }    
}

export const GetModuleAction = (system_id: number, subsystem_id: number, item_id: number) =>{
    return async (dispatch: any) =>{
        dispatch( _loading() );
        try {
            const config = { withCredentials: true, headers: {'Content-Type': 'application/json;charset=UTF-8'} };
            const response = await axios.get(env.url+'/v1/lookup/module/'+system_id+"/"+subsystem_id+"/"+item_id, config);   
            const ssimL4 = response.data;
            dispatch( _set_category({ssimL4: ssimL4, errmsg: ''} as any) );           
        }
        catch(e: any) {
            if (e.response.status === 401) {
                dispatch( _clear_state() );
                dispatch( _authenReset() );
            }
            else {
                dispatch( _set_category({ssimL4: [], errmsg: e.message} as any) );
            }
        }
    }    
}

export const GetAttachmentAction = (ticket_id: number) =>{
    return async (dispatch: any) =>{
        dispatch( _loading() );
        try {
            const config = { withCredentials: true, headers: {'Content-Type': 'application/json;charset=UTF-8'} };
            const response = await axios.get(env.url+'/v1/ticket/attachment/'+ticket_id, config);   
            const attach = response.data;
            dispatch( _set_attach({attach: attach, errmsg: ''} as any) );           
        }
        catch(e: any) {
            if (e.response.status === 401) {
                dispatch( _clear_state() );
                dispatch( _authenReset() );
            }
            else {
                dispatch( _set_category({attach: [], errmsg: e.message} as any) );
            }
        }
    }    
}

export const UploadAttachmentAction = (ticket_id: number, files: FormData) =>{
    return async (dispatch: any) =>{
        dispatch( _loading() );
        try {
            const response1 = await axios.post(env.url+'/v1/ticket/upload/'+ticket_id, files, { withCredentials: true });   
            const config = { withCredentials: true, headers: {'Content-Type': 'application/json;charset=UTF-8'} };
            const response2 = await axios.get(env.url+'/v1/ticket/attachment/'+ticket_id, config);   
            const attach = response2.data;
            dispatch( _set_attach({attach: attach, errmsg: ''} as any) );    
        }
        catch(e: any) {
            if (e.response.status === 401) {
                dispatch( _clear_state() );
                dispatch( _authenReset() );
            }
            else {
                dispatch( _set_category({attach: [], errmsg: e.message} as any) );
            }
        }
    }    
}


export const ChangeStatusAction = (ticket_id: number, flag: string) =>{
    let _serviceurl = "";
    if (flag === "takeowner")
        _serviceurl = env.url+'/v1/ticket/takeowner/' + ticket_id;
    if (flag === "close")
        _serviceurl = env.url+'/v1/ticket/close/' + ticket_id;
    if (flag === "void")
        _serviceurl = env.url+'/v1/ticket/void/' + ticket_id;    

    return async (dispatch: any) => {
        dispatch( _loading() );
        try {
            const config   = { withCredentials: true, headers: {'Content-Type': 'application/json;charset=UTF-8'} };
            const response = await axios.get(_serviceurl, config);   
            const ticket   = response.data;
            dispatch( _set_ticket({ticket: ticket, errmsg: ''} as any) );           
        }
        catch(e: any) {
            if (e.response.status === 304)  {  alert(e.message);  }
            else                            {  dispatch( _set_ticket({ticket: null, errmsg: e.message} as any) );  }
        }
    }
}