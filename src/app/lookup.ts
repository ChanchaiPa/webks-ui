import { _InOut, _Ticket } from "./schema";

export const getAgentName = (agent_id: number):string =>  { 
    let result = "";
    const _agents = JSON.parse( localStorage.getItem("agent_list")! );   
    for (let i=0; i<_agents.length; i++) { 
        if (agent_id === _agents[i].agent_id) { 
            result = (_agents[i].first_name + "" + _agents[i].last_name).trim();
            break;
        }
    }
    return result;
}

export const getUserLogin = (agent_id: number):string =>  { 
    let result = "";
    const _agents = JSON.parse( localStorage.getItem("agent_list")! );   
    for (let i=0; i<_agents.length; i++) { 
        if (agent_id === _agents[i].agent_id) { 
            result = _agents[i].login;
            break;
        }
    }
    return result;
}

export const getGroupName = (group_id: number):string =>  {
    let result = "";
    const _groups = JSON.parse( localStorage.getItem("group_list")! ); 
    for (let i=0; i<_groups.length; i++) {
        if (group_id === _groups[i].group_id) {
            result = _groups[i].name;
            break;
        }
    }
    return result;
}

export const getLevelName = (level_id: number):string =>  {
    if (level_id === 3)  return "Manager";
    if (level_id === 2)  return "Supervisor";
    if (level_id === 1)  return "Agent";
    return "";
}  

export const getStatusName = (status_id: number):string =>  {
    let result = "";
    const _status = JSON.parse( localStorage.getItem("problem_status_list")! ); 
    for (let i=0; i<_status.length; i++) {
        if (status_id === _status[i].problem_status_id) {
            result = _status[i].description;
            break;
        }
    }
    return result;
}  

export const showDate = (datestr: string): string =>  {
    if (datestr===null || datestr.trim() === "")
        return "";
    let idx = datestr.lastIndexOf(":");
    if (idx !== -1)
        return datestr.substring(0, idx);
    else
        return datestr;
}

export const ticketColor =(ticket: _Ticket) => {
    if (ticket.problem_status_id==5 || ticket.problem_status_id==6) {
        return "#C0C0C0";
    }
    else {
        if (ticket.problem_status_id == 2) {
            return "black";
        }
        else {
            if (ticket.agePercent > 100)
                return "red";
            else
                return "black";
        }    
    }    
}

export const ticketColor2 =(problem_status_id: number, agePercent: number) => {
    if (problem_status_id==5 || problem_status_id==6) {
        return "#C0C0C0";
    }
    else {
        if (problem_status_id == 2) {
            return "black";
        }
        else {
            if (agePercent > 100)
                return "red";
            else
                return "black";
        }    
    }    
}