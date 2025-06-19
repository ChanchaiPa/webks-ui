import { useContext, useState } from "react";
import { ContextRoot, ContextType } from "../app3-content";
import { UploadAttachmentAction } from "../../store/slices/ticket-slice";
import { RootState, useAppDispatch } from "../../store/store";
import { useSelector } from "react-redux";
import { _Attachment } from "../schema";
import { getAgentName } from "../lookup";
import fileDownload from 'js-file-download';
import axios from "axios";
import { env } from "../../Environment";
import { _loadingStart, _loadingFinish } from './../../store/slices/loading-slice';


const FILE_ACCEPT = [
    {type: "jpg" , size: 4*1000000}, {type: "jpeg", size: 4*1000000},
    {type: "xls" , size: 9*1000000}, {type: "xlsx", size: 9*1000000},
    {type: "doc",  size: 9*1000000}, {type: "docx", size: 9*1000000},
    {type: "pdf" , size: 9*1000000}, {type: "txt",  size: 4*1000000},
];
const getFileSize = (size: number) => {
    if (size < 1000000) {
      return Math.round(size / 1024 * 100) / 100 + ' KB';
    } else {
      return Math.round(size / 1000000 * 100) / 100 + ' MB';
    }
} 


export default function ProblemFiles() {
    const { mode, setContextMode } = useContext<ContextType>(ContextRoot); //*** CONTEXT ***/
    const ticket = useSelector((state: RootState) => state.TicketSlicer).ticket;
    const attach = useSelector((state: RootState) => state.TicketSlicer).attach;
    const dispatch = useAppDispatch();
    const [fileUploadForm, setFileUploadForm] = useState<FormData>(new FormData());

    const addFile =(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        setContextMode("E");
    }

    const saveFile =(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        let _filesCount = 0;
        fileUploadForm.forEach((f: any) => {_filesCount++});    console.log("Insert Item " + _filesCount);
        if (_filesCount==0) {
            alert("กรุณาเลือกไฟล์ ที่ต้องการเพิ่ม");
            return;
        }
        if(!window.confirm("ยืนยันการบันทึกข้อมูล ?")) {
            return;
        } 
        dispatch( UploadAttachmentAction(ticket.ticket_id, fileUploadForm) ).then(result => {
            setFileUploadForm(new FormData());//clearSelectFiles
        });
        setContextMode("V");
    }   
    
    const cancelFile =(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        setFileUploadForm(new FormData());//clearSelectFiles
        setContextMode("V");
    }  
    
    //*****************************************/
    /*const clearSelectFiles =() =>{
        let fileUploadTemp: string[] = []; 
        fileUploadForm.forEach((file: any)    => { fileUploadTemp.push(file.name); })     
        fileUploadTemp.forEach((name: string) => { fileUploadForm.delete(name); });
        setFileUploadForm(fileUploadForm);  
    }*/ 

    const selectFiles = (selectedFile: any) => {
        let _filesCount = 0;
        let _filesSelect: FormData = new FormData(); //clone object
        fileUploadForm.forEach((value,key) => { 
            _filesCount++;
            _filesSelect.append(key, value);
        });  

        const length = selectedFile.length || 0;
        for (let i = 0; i < length; i++) {
            if (_filesCount >= 10)  //*****/
                break;
            let filename: string = selectedFile[i].name;
            let filetype: string = filename.substring(filename.lastIndexOf(".")+1).toLocaleLowerCase();
            let filesize: number = selectedFile[i].size;
            let fileObj : any    = selectedFile[i]; 
            
            let fileAccept = FILE_ACCEPT.find(f => f.type == filetype);
            if (fileAccept!= null) {
                if (filesize < fileAccept.size) { 
                    _filesCount++;
                    _filesSelect.append("files", fileObj);  //console.log("ADD " + filename + " [" + filetype + "] " + filesize);
                }
            }
        }
        setFileUploadForm(_filesSelect);
    }

    const renderSelectFiles = () => {
        let count = 0;
        let ret: any[] = [];
        fileUploadForm.forEach((file: any, key: string) => {  //key fix 'files' 
            count = count+1;
            ret.push(<tr key={count}>
                <td>{count})&nbsp;{file.name}&nbsp;({getFileSize(file.size)})</td> 
                <td align="right"><a href="#" title="Remove File" onClick={(e) => removeSelectFile(e, file.name)} style={{fontSize: 15, color: 'red'}}><i className="bi bi-trash"></i></a></td>
            </tr>)
        });
        return ret;
    }    
    
    const removeSelectFile =(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, fileName: string) =>{
        e.preventDefault(); 
        let _formAttach: FormData = new FormData();     //clone object
        fileUploadForm.forEach((file: any, key) => {    //key fix 'files' 
            if (file.name !== fileName)
                _formAttach.append(key, file);
        });
        setFileUploadForm(_formAttach);      
    }  
    
    const downloadFile = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, seq_id: number, file_name: string) => {
        e.preventDefault();
        dispatch( _loadingStart() );
        axios.get(env.url + "v1/ticket/download/"+ticket.ticket_id+"/"+seq_id, {withCredentials: true, responseType: 'blob'}).then(res => { 
            fileDownload(res.data, file_name);
            dispatch( _loadingFinish() );
        });          
    }

    const ShowButton = () => {
        const logon_userid: number = parseInt(useSelector((state: RootState) => state.AuthenSlicer).userid!);
        if (logon_userid === ticket.owner_id) { // OWNER
            if (mode === "V") { // Mode V
                return <><a href="#" title="Add File" onClick={(e) => addFile(e)}><i className="bi bi-plus-square-fill h4 text-success"></i></a></>
            }
            else { // Mode E
                return <><a href="#" title="Save" onClick={(e) => saveFile(e)}><i className="bi bi-floppy-fill h4 text-info"></i></a>&nbsp;<a href="#" title="Cancel" onClick={(e) => cancelFile(e)}><i className="bi bi-x-square-fill h4 text-danger"></i></a></>
            }
        }
        else { // NOT OWNER
            return <></>
        }        
    }



    return(<div className='container-fluid py-3' style={{backgroundColor: "white"}}>
        <div className='card shadow border-success card_custom'>
            <div className='card-header'>
                <div className="d-inline-block fw-bold">Attachment</div>
                <div className="d-inline-block float-end">
                    {/* mode==="V" 
                    ? <a href="#" title="Add File" onClick={(e) => addFile(e)}><i className="bi bi-plus-square-fill h4 text-success"></i></a>
                    : <><a href="#" title="Save" onClick={(e) => saveFile(e)}><i className="bi bi-floppy-fill h4 text-info"></i></a>&nbsp;<a href="#" title="Cancel" onClick={(e) => cancelFile(e)}><i className="bi bi-x-square-fill h4 text-danger"></i></a></>  
                    */ ShowButton()}
                    
                </div>
            </div>
            <div className='card-body'>
            { mode==="V" 
            ? 
                <table className="table table-sm table-hover">
                    <thead className='table-primary'>
                        <tr style={{borderBottom: 1, borderBottomColor: '#808080'}}>
                            <th>No.</th>
                            <th>File Name</th>
                            <th>File size</th>
                            <th>Create Date</th>
                            <th>Create User</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                    attach.map((item: _Attachment, index) => {
                        return (<tr key={index}>
                        <td>&nbsp;{index+1}</td>
                        <td>&nbsp;<a href="#" onClick={(e) => downloadFile(e, item.seq_id, item.file_name)}>{item.file_name}</a></td>
                        <td>&nbsp;{item.file_size}</td>
                        <td>&nbsp;{item.create_date}</td>
                        <td>&nbsp;{getAgentName(item.create_user_id)}</td>
                        </tr>)
                        })
                    } 
                    {
                    Array(10-attach.length>0 ? 10-attach.length : 0).fill(0).map((item: any, index) => {
                        return (<tr key={index}>
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
            : 
                <div className="container-fluid">
                <div className="row py-3">
                    <div className="col-3">
                        <button className='custom-file-upload'>
                            <span style={{color: '#888888', marginTop: 100}}>ลากไฟล์เพื่ออัปโหลด</span>
                            <span style={{color: '#888888'}}>Drag files to upload.</span>
                            <input className="file-upload-input"  type='file' multiple onChange={(e) => selectFiles(e.target.files)} />
                        </button>
                    </div>
                    <div className="col-3" style={{marginLeft: -15}}>
                        <ul style={{marginTop: 10, fontSize: 13, fontStyle: 'italic', color: '#808040'}}>
                            <li>upload ต่อครั้ง ไม่เกิน 10 file</li>
                            <li>support file .txt(&lt;4Mb)</li>
                            <li>support file .jpg, .jpeg(&lt;4Mb)</li>
                            <li>support file .xls, .xlsx(&lt;9Mb)</li>
                            <li>support file .doc, .docx(&lt;9Mb)</li>
                            <li>support file .pdf(&lt;9Mb)</li>
                        </ul>
                    </div>
                    <div className="col-6 ps-5">
                        <table className="table table-sm table-hover">
                            <tbody>{ renderSelectFiles() }</tbody>
                        </table>
                    </div>
                </div>
                </div>
            }    

            </div>
        </div>
    </div>)
}