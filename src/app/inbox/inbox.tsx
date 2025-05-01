import React, { useEffect, useState } from 'react'
import { RootState, useAppDispatch } from '../../store/store';
import { useSelector } from 'react-redux';
import { InboxAction, OutboxAction } from '../../store/slices/in-out-slice';
import { _InOut, PAGE_SIZE_XL } from '../schema';
import { showDate, ticketColor2 } from '../lookup';
import { useNavigate } from 'react-router-dom';
import { env } from '../../Environment';


export default function Inbox() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const loading  = useSelector((state: RootState) => state.InOutSlicer).loading;  
    const inbox    = useSelector((state: RootState) => state.InOutSlicer).inbox;     
    const errmsg   = useSelector((state: RootState) => state.InOutSlicer).errmsg;   

    const [screenH, setScreenH] = useState<number>(window.innerHeight);
    useEffect(() => {
        if (errmsg === "?") {
            dispatch (InboxAction())
                .then(result => { dispatch (OutboxAction(1, PAGE_SIZE_XL, 0)) });
        }

        function handleResize() { setScreenH(window.innerHeight); }
        window.addEventListener('resize', handleResize);
        return () => { window.removeEventListener('resize', handleResize); }   
    }, [])

    const refreshData = () => {
        dispatch ( InboxAction() );
    } 

    const openTicket = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, ticket_id: number, trans_id: number) => {
        e.preventDefault();
        navigate(env.app_root+"/ticket?ticketId="+ticket_id + "&trans_id="+trans_id);//Query String
    }



    return (<div className='p-2'>
    {loading ? <div className='loading'>
        <div className="spinner-grow text-success" role="status" />
        <span>กรุณารอสักครู่</span>
    </div> : null}

    <div className='card border-success card_custom'>
        <div className='card-header'><b>Inbox</b>
            <button className="btn btn-sm btn-success" style={{position: 'absolute', right: 13, top: 5}} onClick={refreshData}><i className="bi bi-arrow-clockwise"></i></button>
        </div>
        <div className="card-body" style={{overflowY: 'auto', height: screenH-80}}>
            <table className="table table-sm table-hover">
                <thead className='table-primary'>
                    <tr style={{borderBottom: 1, borderBottomColor: '#808080'}}>
                        <th>Ticket ID</th>
                        <th>Transfer Date</th>
                        <th>Transfer By</th>
                        <th>Reminder Date</th>
                        <th>System ID</th>
                        <th>Problem Detail</th>
                    </tr>
                </thead>
                <tbody>
                {    
                    /*Array(30).fill(0).map((item: any, index) => {
                        return (<tr key={index}>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        </tr>)
                        })*/
                    inbox.map((item: _InOut, index) => {
                        return (<tr key={index}>
                            <td>&nbsp;<a href="#" onClick={(e) => openTicket(e, item.ticket_id, item.trans_id)} style={{color: ticketColor2(4, item.agePercent)}} >{item.ticket_id}</a></td>
                            <td style={{color: ticketColor2(4, item.agePercent)}}>&nbsp;{showDate(item.trans_date)}</td>
                            <td style={{color: ticketColor2(4, item.agePercent)}}>&nbsp;{item.transfered_by_name}</td>
                            <td style={{color: ticketColor2(4, item.agePercent)}}>&nbsp;{showDate(item.reminder_date)}</td>
                            <td style={{color: ticketColor2(4, item.agePercent)}}>&nbsp;{item.system_id_desc}</td>
                            <td style={{color: ticketColor2(4, item.agePercent)}}>&nbsp;{item.problem_detail}</td>
                        </tr>)
                    })                    
                }
                {
                    Array( PAGE_SIZE_XL-inbox.length>0 ? PAGE_SIZE_XL-inbox.length : 0 ).fill(0).map((item: any, index) => {
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
        </div>
    </div>
    </div>)
}