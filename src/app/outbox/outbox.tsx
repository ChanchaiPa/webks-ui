import React, { useEffect } from 'react'
import { RootState, useAppDispatch } from '../../store/store';
import { useSelector } from 'react-redux';
import { InboxAction, OutboxAction } from '../../store/slices/in-out-slice';
import { _InOut, PAGE_SIZE_XL } from '../schema';
import { showDate, ticketColor2 } from '../lookup';
import { Pagination } from 'antd';


export default function Outbox() {
    const dispatch = useAppDispatch();
    const loading  = useSelector((state: RootState) => state.InOutSlicer).loading;  
    const outbox   = useSelector((state: RootState) => state.InOutSlicer).outbox;  
    const page     = useSelector((state: RootState) => state.InOutSlicer).page; 
    const total    = useSelector((state: RootState) => state.InOutSlicer).total;        
    const errmsg   = useSelector((state: RootState) => state.InOutSlicer).errmsg;   

    useEffect(() => {
        if (errmsg === "?") {
            dispatch (InboxAction())
                .then(result => { dispatch (OutboxAction(1, PAGE_SIZE_XL, 0)) });
        }
    }, [])    

    const refreshData = () => {
        dispatch ( OutboxAction(1, PAGE_SIZE_XL, 0) );
    }    

    const topageData = (select: number) => {
        dispatch ( OutboxAction(select, PAGE_SIZE_XL, total) );
    }    

    const openTicket = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, ticket_id: number, trans_id: number) => {
        e.preventDefault();
        //navigate(env.app_root+"/ticket?ticketId="+ticketId);//Query String
    }



    return (<div className='p-2'>
    {loading ? <div className='loading'>
        <div className="spinner-grow text-success" role="status" />
        <span>กรุณารอสักครู่</span>
    </div> : null}

    <div className='card border-success card_custom'>
        <div className='card-header'><b>Outbox</b>
            <button className="btn btn-sm btn-success" style={{position: 'absolute', right: 13, top: 5}} onClick={refreshData}><i className="bi bi-arrow-clockwise"></i></button>        
        </div>
        <div className="card-body">
            <table className="table table-sm table-hover">
                <thead className='table-primary'>
                    <tr style={{borderBottom: 1, borderBottomColor: '#808080'}}>
                        <th>Ticket ID</th>
                        <th>Transfer Date</th>
                        <th>To User</th>
                        <th>To Group</th>
                        <th>Reminder Date</th>
                        <th>System ID</th>
                    </tr>
                </thead>  
                <tbody>
                {
                    outbox.map((item: _InOut, index) => {
                        return (<tr key={index}>
                            <td style={{color: ticketColor2(4, item.agePercent)}}>&nbsp;{item.ticket_id}</td>
                            <td style={{color: ticketColor2(4, item.agePercent)}}>&nbsp;{showDate(item.trans_date)}</td>
                            <td style={{color: ticketColor2(4, item.agePercent)}}>&nbsp;{item.to_user_name}</td>
                            <td style={{color: ticketColor2(4, item.agePercent)}}>&nbsp;{item.to_group_name}</td>
                            <td style={{color: ticketColor2(4, item.agePercent)}}>&nbsp;{showDate(item.reminder_date)}</td>
                            <td style={{color: ticketColor2(4, item.agePercent)}}>&nbsp;{item.system_id_desc}</td>
                        </tr>)
                    })                     
                }   
                {
                    Array( PAGE_SIZE_XL-outbox.length ).fill(0).map((item: any, index) => {
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
                    <div className='col'><Pagination current={page} total={total} pageSize={PAGE_SIZE_XL} size={'small'} hideOnSinglePage onChange={topageData}/></div>
                    <div className='col' style={{textAlign: 'end', alignContent: 'center', fontSize: 14, fontWeight: 600, color: 'blue'}}>{total} Records</div>
                </div>
            </div>               
        </div>        
    </div>
    </div>)
}