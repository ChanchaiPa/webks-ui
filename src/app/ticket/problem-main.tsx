import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../store/store";
import { _Ticket, initTicket } from "../schema";
import { useContext, useEffect, useState } from "react";
import { getAgentName, getStatusName, getUserLogin, showDate } from "../lookup";
import { ContextRoot, ContextType } from "../app3-content";
import axios from "axios";
import { env } from "../../Environment";
import { useNavigate } from "react-router-dom";
import { UpdatedataAction, GetSubsystemAction, GetItemAction, GetModuleAction, SetCategoryAction, ChangeStatusAction } from "../../store/slices/ticket-slice";
import { Modal } from 'react-bootstrap';
import DialogMain from "./dialogs/main";
import { _loadingStart, _loadingFinish } from './../../store/slices/loading-slice';



export default function ProblemMain() {
    const { mode, setContextMode } = useContext<ContextType>(ContextRoot); //*** CONTEXT ***/
    const configapi = { withCredentials: true, headers: {'Content-Type': 'application/json;charset=UTF-8'} };
    const ticket = useSelector((state: RootState) => state.TicketSlicer).ticket; 
    const ssimL2 = useSelector((state: RootState) => state.TicketSlicer).ssimL2; 
    const ssimL3 = useSelector((state: RootState) => state.TicketSlicer).ssimL3; 
    const ssimL4 = useSelector((state: RootState) => state.TicketSlicer).ssimL4; 
    const [ssimLoading, setSsimLoading] = useState<boolean>(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [tmpTicket,  setTmpTicket]  = useState<_Ticket>(initTicket);
    const [subsysList, setSubsysList] = useState<[]>([]);
    const [itemList,   setItemList]   = useState<[]>([]);
    const [moduleList, setModuleList] = useState<[]>([]);
    useEffect(() => {  setTmpTicket(ticket);   }, [ticket]);
    useEffect(() => {  setSubsysList(ssimL2);  }, [ssimL2]);
    useEffect(() => {  setItemList(ssimL3);    }, [ssimL3]);
    useEffect(() => {  setModuleList(ssimL4);  }, [ssimL4]);  


    //***************************/
    const handleChangeData =(event: any) => {
        const dataName = event.target.name;
        const dataValue= event.target.value;
        setTmpTicket({...tmpTicket, [dataName]: dataValue});
    } 

    const handleChangeSystem =(event: any) => {
        const system_id = event.target.value;  console.log("system_id=="  + system_id);
        dispatch( GetSubsystemAction(system_id) );
        setSsimLoading(true);
        axios.post(env.url+'v1/ticket/reminder', toSSIM(system_id, 0, 0, 0, tmpTicket.open_date), configapi).then(result => {
            setTmpTicket({...tmpTicket, system_id: system_id, subsystem_id: 0, item_id: 0, module_id: 0, 
                need_day: result.data.need_day, need_hr: result.data.need_hr, reminder_date: result.data.reminder_date});
            setSsimLoading(false);
        }).catch(error => { 
            setSsimLoading(false); 
        }); 
    }

    const handleChangeSubsystem =(event: any) => {
        const subsystem_id = event.target.value;
        dispatch( GetItemAction(tmpTicket.system_id, subsystem_id) );
        setSsimLoading(true);
        axios.post(env.url+'v1/ticket/reminder', toSSIM(tmpTicket.system_id, subsystem_id, 0, 0, tmpTicket.open_date), configapi).then(result => {
            setTmpTicket({...tmpTicket, subsystem_id: subsystem_id, item_id: 0, module_id: 0, 
                need_day: result.data.need_day, need_hr: result.data.need_hr, reminder_date: result.data.reminder_date});
            setSsimLoading(false);
        }).catch(error => {
            setSsimLoading(false);
        });
    }    

    const handleChangeItem =(event: any) => {
        const item_id = event.target.value;
        dispatch( GetModuleAction(tmpTicket.system_id, tmpTicket.subsystem_id, item_id) );
        setSsimLoading(true);
        axios.post(env.url+'v1/ticket/reminder', toSSIM(tmpTicket.system_id, tmpTicket.subsystem_id, item_id, 0, tmpTicket.open_date), configapi).then(result => {
            setTmpTicket({...tmpTicket, item_id: item_id, module_id: 0, 
                need_day: result.data.need_day, need_hr: result.data.need_hr, reminder_date: result.data.reminder_date});
            setSsimLoading(false);
        }).catch(error => {
            setSsimLoading(false);
        });
    }

    const handleChangeModule =(event: any) => {
        setSsimLoading(true);
        const module_id = event.target.value;
        setSsimLoading(true);
        axios.post(env.url+'v1/ticket/reminder', toSSIM(tmpTicket.system_id, tmpTicket.subsystem_id, tmpTicket.item_id, module_id, tmpTicket.open_date), configapi).then(result => {
            setTmpTicket({...tmpTicket, module_id: module_id, 
                need_day: result.data.need_day, need_hr: result.data.need_hr, reminder_date: result.data.reminder_date});
            setSsimLoading(false);    
        }).catch(error => {
            setSsimLoading(false);
        });
    } 

    const toSSIM =(system_id: number, subsystem_id: number, item_id: number, module_id: number, open_date: string) => {
        const ssim = {
            system_id: system_id, 
            subsystem_id: subsystem_id, 
            item_id: item_id, 
            module_id: module_id, 
            description: open_date, 
            need_day: 0, 
            need_hr: 0
        }
        return ssim; //equals schema.Ssim in python
    }


    //***************************/
    const callcodeDropdown =() => {
        const _lists = JSON.parse( localStorage.getItem("call_code_list")! ); 
        return _lists.map((item: any) => {
            if (item.call_code === tmpTicket.call_code)
                return <option key={item.call_code} value={item.call_code} selected>{item.description}</option>;
            else
                return <option key={item.call_code} value={item.call_code}>{item.description}</option>;
        })
    }
    const severityDropdown =() => {
        const _lists = JSON.parse( localStorage.getItem("severity_list")! ); 
        return _lists.map((item: any) => {
            if (item.severity_level === tmpTicket.severity_level)
                return <option key={item.severity_level} value={item.severity_level} selected>{item.description}</option>;
            else
                return <option key={item.severity_level} value={item.severity_level}>{item.description}</option>;
        })
    }  
    const priorityDropdown =() => {
        const _lists = JSON.parse( localStorage.getItem("priority_list")! ); 
        return _lists.map((item: any) => {
            if (item.priority_level === tmpTicket.priority_level)
                return <option key={item.priority_level} value={item.priority_level} selected>{item.description}</option>;
            else
                return <option key={item.priority_level} value={item.priority_level}>{item.description}</option>;
        })
    }    
    

    //***************************/
    const systemDropdown =() => {
        const system_list = JSON.parse( localStorage.getItem("system_list")! ); 
        return system_list.map((system: any) => {
            if (system.system_id === tmpTicket.system_id)
                return <option key={system.system_id} value={system.system_id} selected>{system.description}</option>;
            else
                return <option key={system.system_id} value={system.system_id}>{system.description}</option>;
        })
    }  
    const subsystemDropdown =() => { 
        return subsysList.map((subsystem: any) => {
            if (subsystem.subsystem_id === tmpTicket.subsystem_id)
                return <option key={subsystem.subsystem_id} value={subsystem.subsystem_id} selected>{subsystem.description}</option>;
            else
                return <option key={subsystem.subsystem_id} value={subsystem.subsystem_id}>{subsystem.description}</option>;
        })
    }   
    const itemDropdown =() => {
        return itemList.map((item: any) => {
            if (item.item_id === tmpTicket.item_id)
                return <option key={item.item_id} value={item.item_id} selected>{item.description}</option>;
            else
                return <option key={item.item_id} value={item.item_id}>{item.description}</option>;
        })
    }     
    const moduleDropdown =() => { 
        return moduleList.map((module: any) => {
            if (module.module_id === tmpTicket.module_id)
                return <option key={module.module_id} value={module.module_id} selected>{module.description}</option>;
            else
                return <option key={module.module_id} value={module.module_id}>{module.description}</option>;
        })
    }


    //***************************/
    const ShowButton = () => {
        const logon_userid: number = parseInt(useSelector((state: RootState) => state.AuthenSlicer).userid!);
        if (logon_userid === ticket.owner_id) { // OWNER
            if (mode === "V") { // Mode V
                return <>
                    <button className="btn btn-sm btn-primary" onClick={Edit}><i className="bi bi-pencil-square"></i>&nbsp;<b>Edit</b></button>&nbsp;
                    <button className="btn btn-sm btn-primary" onClick={Transfer}><i className="bi bi-send"></i>&nbsp;<b>Transfer</b></button>&nbsp;
                    <button className="btn btn-sm btn-success" onClick={Complete}><i className="bi bi-bookmark-check"></i>&nbsp;<b>Complete</b></button>&nbsp;
                    <button className="btn btn-sm btn-danger"  onClick={Void}><i className="bi bi-cart-x"></i>&nbsp;<b>Void</b></button>&nbsp;                
                </>
            }
            else { // Mode E
                return <>
                    <button className="btn btn-sm btn-success" onClick={Save}><i className="bi bi-floppy"></i>&nbsp;<b>Save</b></button>&nbsp;
                    <button className="btn btn-sm btn-secondary" onClick={Cancel}><i className="bi bi-x-square"></i>&nbsp;<b>Cancel</b></button>&nbsp;                 
                </>
            }
        }
        else { // NOT OWNER
            if (tmpTicket.countInbox > 0) { // INBOX
                return <><button className="btn btn-sm btn-primary" onClick={TakeOwner}><i className="bi bi-arrow-down-square"></i>&nbsp;<b>Take Owner</b></button></>
            }
            else {
                return <></>
            }
        }
    }

    const Edit =() => {
        setContextMode("E");
    }

    const Save =() => {
        setContextMode("V");
        dispatch( UpdatedataAction(tmpTicket, navigate) );
    }

    const Cancel =() => {
        if (tmpTicket.system_id===ticket.system_id && 
            tmpTicket.subsystem_id===ticket.subsystem_id &&
            tmpTicket.item_id===ticket.item_id &&
            tmpTicket.module_id===ticket.module_id ) {  }
        else {
            dispatch( SetCategoryAction(ticket.system_id, ticket.subsystem_id, ticket.item_id) );
        }
        setTmpTicket(ticket);
        setContextMode("V");
    }   
    
    const Complete =() => {
        if(!window.confirm("ยืนยันการ Close Ticket?")) 
            return;
        dispatch( ChangeStatusAction(ticket.ticket_id, "close") );         
    }

    const Void =() => {
        if(!window.confirm("ยืนยันการ Void Ticket?")) 
            return;
        dispatch( ChangeStatusAction(ticket.ticket_id, "void") );         
    }

    const TakeOwner =() => {
        if(!window.confirm("ยืนยันการ Take Owner?")) 
            return;
        dispatch( ChangeStatusAction(ticket.ticket_id, "takeowner") );       
    }    


    //***************************/
    const [openDiaog, setOpenDiaog] = useState<boolean>(false);
    const [dataDiaog, setDataDiaog] = useState<number[]>([]);
    const [typeDiaog, setTypeDiaog] = useState<string>("");
    const Transfer =() => { setOpenDiaog(true); }  
    const Transfxx =() => {
        if (typeDiaog === "")
            return;
        dispatch( _loadingStart() );
        console.log("["+typeDiaog+"] " + dataDiaog);
        const param = {"ticket_id": ticket.ticket_id, "type": typeDiaog, "list": dataDiaog}
        axios.post(env.url+'v1/ticket/transfer', param, configapi).then(result => {
            setTmpTicket({...tmpTicket, problem_status_id: 4});
            dispatch( _loadingFinish() );
        }).catch(error => {
            dispatch( _loadingFinish() );
        });
    }  


    
    return(<div className='container-fluid py-3 set_tab_full' style={{overflowY: 'auto'}}>
        <div className='card border-success card_custom'>
            <div className='card-header'>
                <div className="container-fluid">
                <div className="row mb-2">
                    <div className="col-3">
                        <label className="form-label" htmlFor="ticket_id">Ticket ID</label>
                        <input type="text" className="form-control form-control-sm" disabled id="ticket_id" value={tmpTicket.ticket_id}/>                        
                    </div>
                    <div className="col-3">
                        <label className="form-label" htmlFor="open_date">Open Date</label>
                        <input type="text" className="form-control form-control-sm" disabled id="open_date" value={showDate(tmpTicket.open_date)}/>                          
                    </div>
                    <div className="col-3">
                        <label className="form-label" htmlFor="add_user_id">Create User</label>
                        <input type="text" className="form-control form-control-sm" disabled id="add_user_id" value={getUserLogin(tmpTicket.add_user_id)}/> 
                    </div>
                    <div className="col-3">
                        <label className="form-label" htmlFor="owner_id">Owner User</label>
                        <input type="text" className="form-control form-control-sm" disabled id="owner_id" value={getUserLogin(tmpTicket.owner_id)}/>                         
                    </div>
                </div>
                <div className="row mb-2">
                    <div className="col-3">
                        <label className="form-label" htmlFor="problem_status_id">Status</label>
                        <input type="text" className="form-control form-control-sm" disabled id="problem_status_id" value={getStatusName(tmpTicket.problem_status_id)}/>
                    </div>
                    <div className="col-3">
                        <label className="form-label" htmlFor="close_date">Close Date</label>
                        <input type="text" className="form-control form-control-sm" disabled id="close_date" value={showDate(tmpTicket.close_date)}/>
                    </div>
                    <div className="col-6">
                        <div style={{height: '61px', display: 'flex', justifyContent: 'end', alignItems: 'end'}}>
                        {/* mode==="V" ? <>
                            <button className="btn btn-sm btn-primary" onClick={Edit}><i className="bi bi-pencil-square"></i>&nbsp;<b>Edit</b></button>&nbsp;
                            <button className="btn btn-sm btn-primary" onClick={Transfer}><i className="bi bi-send"></i>&nbsp;<b>Transfer</b></button>&nbsp;
                            <button className="btn btn-sm btn-success" onClick={Complete}><i className="bi bi-bookmark-check"></i>&nbsp;<b>Complete</b></button>&nbsp;
                            <button className="btn btn-sm btn-danger"  onClick={Void}><i className="bi bi-cart-x"></i>&nbsp;<b>Void</b></button>&nbsp;
                        </> : null*/}
                        {/* mode==="E" ? <>
                            <button className="btn btn-sm btn-success" onClick={Save}><i className="bi bi-floppy"></i>&nbsp;<b>Save</b></button>&nbsp;
                            <button className="btn btn-sm btn-secondary" onClick={Cancel}><i className="bi bi-x-square"></i>&nbsp;<b>Cancel</b></button>&nbsp;                        
                        </> : null*/}
                            {ShowButton()}
                        </div>
                    </div>
                </div>
                </div>
            </div>
            <div className="card-body">
            <fieldset disabled={mode !== 'E'}>  
                <div className="container-fluid">
                <div className="row mb-2 mt-2">
                    <div className="col-3">
                        <label className="form-label" htmlFor="customer_id">Customer Id</label>
                        <input type="text" className="form-control form-control-sm" id="customer_id" name="customer_id" value={tmpTicket.customer_id} onChange={handleChangeData}/>
                    </div>
                    <div className="col-3">
                        <label className="form-label" htmlFor="customer_name">Customrt Name</label>
                        <input type="text" className="form-control form-control-sm" id="customer_name" name="customer_name" value={tmpTicket.customer_name} onChange={handleChangeData}/>
                    </div>
                    <div className="col-3">
                        <label className="form-label" htmlFor="caller_name">Caller Name</label>
                        <input type="text" className="form-control form-control-sm" id="caller_name" name="caller_name" value={tmpTicket.caller_name} onChange={handleChangeData}/> 
                    </div>
                    <div className="col-3">
                        <label className="form-label" htmlFor="caller_phoneno">Caller Phone</label>
                        <input type="text" className="form-control form-control-sm" id="caller_phoneno" name="caller_phoneno" value={tmpTicket.caller_phoneno} onChange={handleChangeData}/>
                    </div>
                </div>

                <div className="row mb-2 mt-2">
                    <div className="col-3">
                        <label className="form-label" htmlFor="call_code">Channel</label>
                        <select className="form-control form-control-sm" id="call_code" name="call_code" value={tmpTicket.call_code} onChange={handleChangeData}>
                            <option key="">&nbsp;</option>{callcodeDropdown()}
                        </select>
                    </div>
                    <div className="col-3">
                        <label className="form-label" htmlFor="severity_level">Severity</label>
                        <select className="form-control form-control-sm" id="severity_level" name="severity_level" value={tmpTicket.severity_level} onChange={handleChangeData}>
                            <option key="">&nbsp;</option>{severityDropdown()}
                        </select>
                    </div>
                    <div className="col-3">
                        <label className="form-label" htmlFor="priority_level">Priority</label>
                        <select className="form-control form-control-sm" id="priority_level" name="priority_level" value={tmpTicket.priority_level} onChange={handleChangeData}>
                            <option key="">&nbsp;</option>{priorityDropdown()}
                        </select>
                    </div>
                    <div className="col-3"></div>
                </div>

                <div className="row mb-2 mt-3">
                    <div className="col-3" style={{backgroundColor: '#CCFFFF', borderRadius: 5}}>
                        <div className="mb-2">
                            <label className="form-label" htmlFor="system_id">System</label>
                            <select className="form-control form-control-sm" id="system_id" name="system_id" value={tmpTicket.system_id} onChange={handleChangeSystem} disabled={ssimLoading}>
                                <option key="0" value="0">&nbsp;</option>{systemDropdown()}
                            </select>
                        </div>
                        <div className="mb-2">
                            <label className="form-label" htmlFor="subsystem_id">Subsystem</label>
                            <select className="form-control form-control-sm" id="subsystem_id" name="subsystem_id" value={tmpTicket.subsystem_id} onChange={handleChangeSubsystem} disabled={ssimLoading}>
                                <option key="0" value="0">&nbsp;</option>{subsystemDropdown()}
                            </select>
                        </div>    
                        <div className="mb-2">
                            <label className="form-label" htmlFor="item_id">Item</label>
                            <select className="form-control form-control-sm" id="item_id" name="item_id" value={tmpTicket.item_id} onChange={handleChangeItem} disabled={ssimLoading}>
                                <option key="0" value="0">&nbsp;</option>{itemDropdown()}
                            </select>
                        </div>
                        <div className="mb-2">
                            <label className="form-label" htmlFor="module_id">Module</label>
                            <select className="form-control form-control-sm" id="module_id" name="module_id" value={tmpTicket.module_id} onChange={handleChangeModule} disabled={ssimLoading}>
                                <option key="0" value="0">&nbsp;</option>{moduleDropdown()}
                            </select>
                        </div>
                        <div className="mb-2">
                            <label className="form-label" htmlFor="reminder_date">Due Date (Day : Hour)</label>
                            <div className="input-group input-group-sm">
                                <input type="text" className="form-control form-control-sm w-50" disabled id="reminder_date" value={showDate(tmpTicket.reminder_date)}/>&nbsp;
                                <input type="text" className="form-control form-control-sm" disabled id="reminder_date" value={tmpTicket.need_day + " : " + tmpTicket.need_hr}/>
                            </div>
                        </div>   
                    </div>

                    <div className="col-9" style={{paddingLeft: 30}}>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="problem_detail"><b>Problem Detail</b></label>
                            <textarea className="form-control form-control-sm" id="problem_detail" name="problem_detail" rows={4} style={{resize: 'none'}} value={tmpTicket.problem_detail} onChange={handleChangeData}></textarea>
                        </div>
                        <div>
                            <label className="form-label" htmlFor="resolved_detail"><b>Solution Detail</b></label>
                            <textarea className="form-control form-control-sm" id="resolved_detail" name="resolved_detail" rows={7} style={{resize: 'none'}} value={tmpTicket.resolved_detail} onChange={handleChangeData}></textarea>
                        </div>
                    </div>
                </div>
                </div>
            </fieldset>    
            </div>
        </div>


    <Modal dialogClassName='modal-width' show={openDiaog} onExit={Transfxx} backdrop="static">
        <Modal.Body>
            <DialogMain setOpenDiaog={setOpenDiaog} setDataDiaog={setDataDiaog} setTypeDiaog={setTypeDiaog}/>                                
        </Modal.Body>
    </Modal>
    </div>)
}