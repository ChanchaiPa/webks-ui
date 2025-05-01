import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../store/store";
import { GetdataAction, GetAttachmentAction, _clear_state as ClearTicket } from "../../store/slices/ticket-slice";
import ProblemMain from "./problem-main";
import ProblemFiles from "./problem-files";
import ProblemTransfer from "./problem-transfer";
import { ContextRoot, ContextType } from "../app3-content";



export default function Ticket() {
    const { mode } = useContext<ContextType>(ContextRoot); //*** CONTEXT ***/
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [curtab,  setCurtab] = useState<String>("Problems"); 
    const loading = useSelector((state: RootState) => state.TicketSlicer).loading;  
    

    useEffect(() => {
        let ticketId = searchParams.get("ticketId"); //Query String
        if (ticketId === null || ticketId == "0") {
            dispatch( GetdataAction(0, navigate) );           
        }
        else {
            dispatch( GetdataAction(parseInt(ticketId), navigate) )
            .then(result => {  dispatch(GetAttachmentAction(parseInt(ticketId)))  });
        }
        //clean component
        return () => { 
            console.log("Clean TICKET... " + ticketId);
            dispatch( ClearTicket() );
        };
    }, []);

    const _setCurtab = (tab: string) => {
        if (mode === "V")
            setCurtab(tab);
    }

    const goBack = () => {
        if (mode === "V")
            navigate(-1);
    }


    return (<React.Fragment>
    {loading ? <div className='loading'>
        <div className="spinner-grow text-success" role="status" />
        <span>กรุณารอสักครู่</span>
    </div> : null}

      <ul className="nav nav-tabs">
        <li className="nav-item"><button className="btn btn-sm btn-secondary mt-2 me-2" type="button" onClick={goBack}><i className="bi bi-backspace"></i>&nbsp;<b>Back</b></button></li>        
        <li className="nav-item">
            <a className={curtab==="Problems"  ? "nav-link active" : "nav-link"} onClick={(e) => _setCurtab("Problems")}>Problems-{mode}</a></li>
        <li className="nav-item">
            <a className={curtab==="Attachment"? "nav-link active" : "nav-link"} onClick={(e) => _setCurtab("Attachment")}>Attachment</a></li>
        <li className="nav-item">
            <a className={curtab==="Transfer"  ? "nav-link active" : "nav-link"} onClick={(e) => _setCurtab("Transfer")}>Transfer</a></li>
      </ul>

      {curtab==="Problems" && <ProblemMain/>}
      {curtab==="Attachment"  && <ProblemFiles/>}   
      {curtab==="Transfer" && <ProblemTransfer/>}  
    </React.Fragment>)
}