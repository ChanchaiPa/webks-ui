import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { RootState, useAppDispatch } from '../../store/store';
import { useSelector } from 'react-redux';
import { InProcAction, OnhandAction } from '../../store/slices/onhand-slice';
import { _SearchCond, _Ticket, PAGE_SIZE_SM } from '../schema';
import { Pagination } from 'antd';
import { getStatusName, showDate, ticketColor } from '../lookup';
import { env } from '../../Environment';


export default function Home() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const loading  = useSelector((state: RootState) => state.OnhandSlicer).loading;  
    const page1    = useSelector((state: RootState) => state.OnhandSlicer).page1; 
    const total1   = useSelector((state: RootState) => state.OnhandSlicer).total1; 
    const onhand   = useSelector((state: RootState) => state.OnhandSlicer).onhand; 
    const page2    = useSelector((state: RootState) => state.OnhandSlicer).page2; 
    const total2   = useSelector((state: RootState) => state.OnhandSlicer).total2; 
    const inproc   = useSelector((state: RootState) => state.OnhandSlicer).inproc;     
    const errmsg   = useSelector((state: RootState) => state.OnhandSlicer).errmsg;     

    useEffect(() => {
        if (errmsg === "?") {
            dispatch( OnhandAction({pageNo: page1, pageSize: PAGE_SIZE_SM, totalRec: total1} as _SearchCond, navigate) ); 
            dispatch( InProcAction({pageNo: page2, pageSize: PAGE_SIZE_SM, totalRec: total2} as _SearchCond, navigate) ); 
        }
    }, [])

    const refreshData1 = () => {
        dispatch( OnhandAction({pageNo: page1, pageSize: PAGE_SIZE_SM, totalRec: total1} as _SearchCond, navigate) ); 
    }

    const refreshData2 = () => {
        dispatch( InProcAction({pageNo: page2, pageSize: PAGE_SIZE_SM, totalRec: total2} as _SearchCond, navigate) ); 
    }    

    const topageData1 = (select: number) => {
        dispatch( OnhandAction({pageNo: select, pageSize: PAGE_SIZE_SM, totalRec: total1} as _SearchCond, navigate) ); 
    }

    const topageData2 = (select: number) => {
        dispatch( InProcAction({pageNo: select, pageSize: PAGE_SIZE_SM, totalRec: total2} as _SearchCond, navigate) );
    }    

    const openTicket = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        let ticketId = e.currentTarget.text;
        navigate(env.app_root+"/ticket?ticketId="+ticketId);//Query String
    }

    const newTicket = () => {
        if (window.confirm("New Ticket ??"))
            navigate(env.app_root+"/ticket?ticketId=0");
    }


    return (<div className='p-2'>
    {loading ? <div className='loading'>
        <div className="spinner-grow text-success" role="status" />
        <span>กรุณารอสักครู่</span>
    </div> : null}

    <div className='card border-success card_custom'>
        <div className='card-header'><b>Ticket Onhand</b>
            <button className="btn btn-sm btn-danger"  style={{position: 'absolute', right: 50, top: 5}} onClick={newTicket}><i className="bi bi-plus-lg"></i>New</button>
            <button className="btn btn-sm btn-success" style={{position: 'absolute', right: 13, top: 5}} onClick={refreshData1}><i className="bi bi-arrow-clockwise"></i></button>
        </div>
        <div className="card-body"> 
            <table className="table table-sm table-hover">
                <thead className='table-primary'>
                    <tr style={{borderBottom: 1, borderBottomColor: '#808080'}}>
                        <th>Ticket ID</th>
                        <th>Open Date</th>
                        <th>Reminder Date</th>
                        <th>Due (D:H)</th>
                        <th>Problem Detail</th>
                        <th>Problem Status</th>
                    </tr>
                </thead>
                <tbody>
                {
                    onhand.map((ticket: _Ticket, index) => {
                        return (<tr key={index}>
                          <td>&nbsp;<a href="#" onClick={(e) => openTicket(e)} style={{color: ticketColor(ticket)}}>{ticket.ticket_id}</a></td>
                          <td style={{color: ticketColor(ticket)}}>&nbsp;{showDate(ticket.open_date)}</td>
                          <td style={{color: ticketColor(ticket)}}>&nbsp;{showDate(ticket.reminder_date)}</td>
                          <td style={{color: ticketColor(ticket)}}>&nbsp;{ticket.need_day + ":" + ticket.need_hr}</td>
                          <td style={{color: ticketColor(ticket)}}>&nbsp;{ticket.problem_detail}</td>
                          <td style={{color: ticketColor(ticket)}}>&nbsp;{getStatusName(ticket.problem_status_id)}</td>
                        </tr>)
                    })
                }                     
                {
                    Array(PAGE_SIZE_SM-onhand.length).fill(0).map((item: any, index) => {
                    return (<tr key={index}>
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
                    <div className='col'><Pagination current={page1} total={total1} pageSize={PAGE_SIZE_SM} size={'small'} hideOnSinglePage onChange={topageData1}/></div>
                    <div className='col' style={{textAlign: 'end', alignContent: 'center', fontSize: 14, fontWeight: 600, color: 'blue'}}>{total1} Records</div>
                </div>
            </div>    
        </div>
    </div>

    <div className='card border-success card_custom mt-2'>
        <div className='card-header'><b>Ticket In Processing</b>
            <button className="btn btn-sm btn-success" style={{position: 'absolute', right: 13, top: 5}} onClick={refreshData2}><i className="bi bi-arrow-clockwise"></i></button>
        </div>
        <div className="card-body">
            <table className="table table-sm table-hover">
                <thead className='table-primary'>
                    <tr style={{borderBottom: 1, borderBottomColor: '#808080'}}>
                        <th>Ticket ID</th>
                        <th>Open Date</th>
                        <th>Reminder Date</th>
                        <th>Due (D:H)</th>
                        <th>Problem Detail</th>
                        <th>Problem Status</th>
                    </tr>
                </thead>
                <tbody>
                {
                    inproc.map((ticket: _Ticket, index) => {
                        return (<tr key={index}>
                          <td>&nbsp;<a href="#" onClick={(e) => openTicket(e)} style={{color: ticketColor(ticket)}}>{ticket.ticket_id}</a></td>
                          <td style={{color: ticketColor(ticket)}}>&nbsp;{ticket.open_date}</td>
                          <td style={{color: ticketColor(ticket)}}>&nbsp;{ticket.reminder_date}</td>
                          <td style={{color: ticketColor(ticket)}}>&nbsp;{ticket.need_day + ":" + ticket.need_hr}</td>
                          <td style={{color: ticketColor(ticket)}}>&nbsp;{ticket.problem_detail}</td>
                          <td style={{color: ticketColor(ticket)}}>&nbsp;{getStatusName(ticket.problem_status_id)}</td>
                        </tr>)
                    })
                }                     
                {
                    Array(PAGE_SIZE_SM-inproc.length).fill(0).map((item: any, index) => {
                    return (<tr key={index}>
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
                    <div className='col'><Pagination current={page2} total={total2} pageSize={PAGE_SIZE_SM} size={'small'} hideOnSinglePage onChange={topageData2}/></div>
                    <div className='col' style={{textAlign: 'end', alignContent: 'center', fontSize: 14, fontWeight: 600, color: 'blue'}}>{total2} Records</div>
                </div>
            </div>   
        </div>
    </div>    
    </div>)
}