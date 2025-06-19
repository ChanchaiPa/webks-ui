import React, { useState } from 'react'
import CustomDatePicker from "./custom-date-picker";
import { _TrackingParam, _Ticket, initTrackingParam, PAGE_SIZE_MD } from '../schema';
import { _loadingStart, _loadingFinish } from './../../store/slices/loading-slice';
import { RootState, useAppDispatch } from '../../store/store';
import axios from 'axios';
import { env } from '../../Environment';
import { _authenReset, LogoutAction } from "../../store/slices/authen-slice"
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getStatusName, getUserLogin, showDate, ticketColor } from '../lookup';
import { Pagination } from 'antd';



export default function Search() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const username = useSelector((state: RootState) => state.AuthenSlicer).username; 

    const [state, setState] = useState<_TrackingParam>(initTrackingParam);
    const [resultList, setResultList] = useState<_Ticket[]>([]);
    const [subsysList, setSubsysList] = useState<[]>([]);
    const [itemList,   setItemList]   = useState<[]>([]);

    const handleChangeData =(event: any) => {
        const dataName = event.target.name;
        const dataValue= event.target.value;
        setState({...state, [dataName]: dataValue});
    } 

    const handleChangeDate =(dataName: string, dataValue: any) => {
        setState({...state, [dataName]: dataValue});
    }     

    const Search = (page: number) => {
        setState({...state, pageNo: page});
        const config = { withCredentials: true, headers: {'Content-Type': 'application/json;charset=UTF-8'} };
        dispatch( _loadingStart() );
        axios.post(env.url+'v1/ticket/tracking', state, config).then(response => {
            dispatch( _loadingFinish() );
            const resData  = response.data;
            const resList  = resData.list as _Ticket[];
            setResultList(resList);
            setState({...state, totalRec: resData.totalRec});
            if (resData.totalRec == 0)
                alert("Not found data..");
        }).catch(error => {
            dispatch( _loadingFinish() );  console.log(error.message);         
            setResultList([]);
            if (error.response.status === 401) {
                dispatch( LogoutAction( {username: username, password: ''} ) ); 
            }
        }); 
    }

    const systemDropdown =() => {
        const system_list = JSON.parse( localStorage.getItem("system_list")! ); 
        return system_list.map((system: any) => {
            return <option key={system.system_id} value={system.system_id}>{system.description}</option>;
        })
    } 
    const subsystemDropdown =() => { 
        return subsysList.map((subsystem: any) => {
            return <option key={subsystem.subsystem_id} value={subsystem.subsystem_id}>{subsystem.description}</option>;
        })
    }   
    const itemDropdown =() => {
        return itemList.map((item: any) => {
            return <option key={item.item_id} value={item.item_id}>{item.description}</option>;
        })
    }  
    
    const openTicket = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        let ticketId = e.currentTarget.text;
        navigate(env.app_root+"/ticket?ticketId="+ticketId);//Query String
    }

    const topageData1 = (select: number) => {
        Search(select);
    }



    return (<div className='p-2'>
    <div className='card border-success card_custom'>
        <div className='card-header'><b>Ticket Search</b>
            <button className="btn btn-sm btn-success" style={{position: 'absolute', right: 13, top: 5}} onClick={(e: any) => Search(1)}><i className="bi bi-arrow-clockwise"></i></button>            
        </div>

        <div className="card-body" style={{backgroundColor: '#eaeded'}}>
            <div className='row px-2'>
                <div className='col-3'>
                    <label className="form-label text-success">Open Date</label>
                    <div className="input-group input-group-sm" style={{marginTop: -5}}>
                        <CustomDatePicker value={state.fr_open_date} onDateChange={(value: any) => handleChangeDate("fr_open_date", value)} />&nbsp;-&nbsp;
                        <CustomDatePicker value={state.to_open_date} onDateChange={(value: any) => handleChangeDate("to_open_date", value)} /> 
                    </div>                   
                </div>
                <div className='col-3'>
                    <label className="form-label text-success" htmlFor='ticket_id'>Ticket ID</label>
                    <input type="text" className="form-control form-control-sm" id="ticket_id" name="ticket_id" value={state.ticket_id} onChange={handleChangeData}/>
                </div>
                <div className='col-3'>
                    <label className="form-label text-success" htmlFor='problem_status_id'>Status</label>
                    <select className="form-select form-select-sm" id="problem_status_id" name="problem_status_id" value={state.problem_status_id} onChange={handleChangeData} style={{marginTop: -4}}>
                        <option value="-1" selected>ALL</option>
                        <option value="3">Pending</option>
                        <option value="4">Transfer</option>
                        <option value="5">Cancel</option>
                        <option value="2">Close</option>
                    </select>
                </div>
                <div className='col-3'>
                    <label className="form-label text-success" htmlFor='customer_id'>Customer ID</label>
                    <input type="text" className="form-control form-control-sm" id="customer_id" name="customer_id" value={state.customer_id} onChange={handleChangeData}/>                    
                </div>
            </div>
            <div className='row px-2 py-2'>
                <div className='col-3'>
                    <label className="form-label text-success" htmlFor="system_id">System</label>
                    <select className="form-control form-control-sm" id="system_id" name="system_id" value={state.system_id} onChange={handleChangeData}>
                        <option key="-1" value="-1">&nbsp;ALL</option>{systemDropdown()}
                    </select>
                </div>
                <div className='col-3'>
                    <label className="form-label text-success" htmlFor="subsystem_id">Subsystem</label>
                    <select className="form-control form-control-sm" id="subsystem_id" name="subsystem_id" value={state.subsystem_id} onChange={handleChangeData}>
                        <option key="-1" value="-1">&nbsp;ALL</option>{subsystemDropdown()}
                    </select>                    
                </div>
                <div className='col-3'>
                    <label className="form-label text-success" htmlFor="item_id">Item</label>
                    <select className="form-control form-control-sm" id="item_id" name="item_id" value={state.item_id} onChange={handleChangeData}>
                        <option key="-1" value="-1">&nbsp;ALL</option>{itemDropdown()}
                    </select>                    
                </div>
                <div className='col-3'>-</div>
            </div>
        </div>

        <div className="card-footer">
            <table className="table table-sm table-hover">
                <thead className='table-primary'>
                    <tr style={{borderBottom: 1, borderBottomColor: '#808080'}}>
                        <th>Ticket ID</th>
                        <th>Open Date</th>
                        <th>Reminder Date</th>
                        <th>Due (D:H)</th>
                        <th>Problem Detail</th>
                        <th>Problem Status</th>
                        <th>Owner Name</th>
                    </tr>
                </thead>    
                <tbody>
                {
                    resultList.map((ticket: _Ticket, index) => {
                        return (<tr key={index}>
                          <td>&nbsp;<a href="#" onClick={(e) => openTicket(e)} style={{color: ticketColor(ticket)}}>{ticket.ticket_id}</a></td>
                          <td style={{color: ticketColor(ticket)}}>&nbsp;{showDate(ticket.open_date)}</td>
                          <td style={{color: ticketColor(ticket)}}>&nbsp;{showDate(ticket.reminder_date)}</td>
                          <td style={{color: ticketColor(ticket)}}>&nbsp;{ticket.need_day + ":" + ticket.need_hr}</td>
                          <td style={{color: ticketColor(ticket)}}>&nbsp;{ticket.problem_detail}</td>
                          <td style={{color: ticketColor(ticket)}}>&nbsp;{getStatusName(ticket.problem_status_id)}</td>
                          <td style={{color: ticketColor(ticket)}}>&nbsp;{getUserLogin(ticket.owner_id)}</td>
                        </tr>)
                    })                     
                } 
                {
                    Array(PAGE_SIZE_MD-resultList.length).fill(0).map((item: any, index) => {
                    return (<tr key={index}>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                    </tr>)
                    })
                }                 
                </tbody>              
            </table>
            <div className='container-fluid mb-2'>
                <div className='row'>
                    <div className='col'><Pagination current={state.pageNo} total={state.totalRec} pageSize={PAGE_SIZE_MD} size={'small'} hideOnSinglePage onChange={topageData1}/></div>
                    <div className='col' style={{textAlign: 'end', alignContent: 'center', fontSize: 14, fontWeight: 600, color: 'blue'}}>{state.totalRec} Records</div>
                </div>
            </div>               
        </div>
    </div>
    </div>)
}