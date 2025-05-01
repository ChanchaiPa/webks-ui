import moment from 'moment';
export const PAGE_SIZE_SM = 5;
export const PAGE_SIZE_MD =10;
export const PAGE_SIZE_XL =15;

export type _SearchCond = {
    param1?: string,
    param2?: string,
    param3?: string,
    param4?: string,
    param5?: string,
    param6?: string,
    param7?: string,
    param8?: string,
    param9?: string,
    pageNo : number,
    pageSize: number,
    totalRec: number    
}
export const initSearchCond =() => {
    let initSearchCond: _SearchCond = {
        pageNo : 1,
        pageSize: PAGE_SIZE_SM,
        totalRec: 0    
    }
    return initSearchCond;
}


//***********************/
export type _User = {
    agent_id: number,
    login: string,
    first_name: string,
    last_name: string,
    level_id: number,
    group_id: number,
    is_active: number,
}
export const initUser =(): _User => {
    let initUser: _User = {
        agent_id: 0,
        login: "",
        first_name: "",
        last_name: "",
        level_id: 0,
        group_id: 0,
        is_active: 0          
    }
    return initUser
}


//***********************/
export type _Ticket = {
    ticket_id: number,
    open_date: string,
    add_user_id: number,
    owner_id: number,
    group_id: number,
    customer_id: string,
    customer_name: string,
    caller_name: string,
    caller_phoneno: string,
    system_id: number,
    subsystem_id: number,
    item_id: number,
    module_id: number,
    call_code: string,
    severity_level: number,
    priority_level: number,
    reminder_date: string,
    need_day: number,
    need_hr: number,
    problem_detail: string,
    resolved_detail: string,
    modified_date: string,
    close_date: string,
    problem_status_id: number,
    countInbox: number,
    agePercent: number
}
export const initTicket =(): _Ticket => {
    let initTicket: _Ticket = {
        ticket_id: 0,
        open_date: "",
        add_user_id: 0,
        owner_id: 0,
        group_id: 0,
        customer_id: "",
        customer_name: "",
        caller_name: "",
        caller_phoneno: "",
        system_id: 0,
        subsystem_id: 0,
        item_id: 0,
        module_id: 0,
        call_code: "",
        severity_level: 0,
        priority_level: 0,
        reminder_date: "",
        need_day: 0,
        need_hr: 0,
        problem_detail: "",
        resolved_detail: "",
        modified_date: "",
        close_date: "",
        problem_status_id: 0,
        countInbox: 0,
        agePercent: 0
    }
    return initTicket;
}


//***********************/
export type _Attachment = {
    seq_id: number, 
    file_name: string, 
    file_type: string, 
    file_size: string, 
    create_date: string, 
    create_user_id: number
}
export const initAttachment =(): _Attachment => {
    let initAttachment: _Attachment = {
        seq_id: 0, 
        file_name: "", 
        file_type: "", 
        file_size: "", 
        create_date: "", 
        create_user_id: 0
    }
    return initAttachment;
}


//***********************/
export type _InOut = {
    trans_id: number, 
    trans_date: string, 
    transfered_by: number, 
    to_user_id: number, 
    to_group_id: number, 
    transfered_by_name: string, 
    to_user_name: string, 
    to_group_name: string, 
    ticket_id: number, 
    open_date: string, 
    reminder_date: string, 
    need_day: number, 
    need_hr: number, 
    problem_detail: string, 
    system_id: number, 
    system_id_desc: string,
    agePercent: number
}
export const initInOut =(): _InOut => {
    let initInOut: _InOut = {
        trans_id: 0, 
        trans_date: "", 
        transfered_by: 0, 
        to_user_id: 0, 
        to_group_id: 0, 
        transfered_by_name: "", 
        to_user_name: "", 
        to_group_name: "", 
        ticket_id: 0, 
        open_date: "", 
        reminder_date: "", 
        need_day: 0, 
        need_hr: 0, 
        problem_detail: "", 
        system_id: 0, 
        system_id_desc: "",
        agePercent: 0
    }
    return initInOut;
}



//***********************/
export type _TrackingParam = {
    pageNo : number,
    pageSize: number,
    totalRec: number,

    fr_open_date: Date, to_open_date: Date, 
    ticket_id: string,  
    problem_status_id: number, 
    customer_id: string,
    system_id: number,
    subsystem_id: number,
    item_id: number,
}

export const initTrackingParam =(): _TrackingParam => {
    let initTrackingParam: _TrackingParam = {
        pageNo: 1, 
        pageSize: PAGE_SIZE_MD,
        totalRec: 0,
        fr_open_date: moment().subtract(1, 'month').toDate(),   to_open_date: new Date(),
        ticket_id: "", 
        problem_status_id: 0,
        customer_id: "", 
    
        system_id: 0,
        subsystem_id: 0,
        item_id: 0,
    }
    return initTrackingParam;
}