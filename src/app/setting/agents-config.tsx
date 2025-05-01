import React, { useEffect, useState } from 'react'
//import ResponsivePagination from 'react-responsive-pagination';
//import 'react-responsive-pagination/themes/minimal.css';
import { Pagination } from "antd";
import { useNavigate } from 'react-router-dom';
import { RootState, useAppDispatch } from '../../store/store';
import { useSelector } from 'react-redux';
import { SearchAction } from '../../store/slices/agent-slice';
import { PAGE_SIZE_SM, _User, initUser } from '../schema';
import { getGroupName, getLevelName } from '../lookup';


export default function AgentConfig() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const loading  = useSelector((state: RootState) => state.AgentSlicer).loading;  
  const page  = useSelector((state: RootState) => state.AgentSlicer).page; 
  const total = useSelector((state: RootState) => state.AgentSlicer).total; 
  const list  = useSelector((state: RootState) => state.AgentSlicer).list; 
  const errmsg= useSelector((state: RootState) => state.AgentSlicer).errmsg; 

  const [curitem, setCurItem] = useState<_User>(initUser());
  useEffect(() => {
    if (errmsg === "?") {
        dispatch( SearchAction(page, PAGE_SIZE_SM, total, navigate) ); 
    }
  }, [])
  
  const refreshData = () => {
      setCurItem(initUser());
      dispatch( SearchAction(1, PAGE_SIZE_SM, 0, navigate) );
  }

  const selectData = (item: _User) => {
      setCurItem(item);
  }

  const toPage = (select: number) => {
      setCurItem(initUser());
      dispatch( SearchAction(select, PAGE_SIZE_SM, total, navigate) );
  }


  return (<div className='container-fluid py-3 set_tab_fit'>
    {loading ? <div className='loading'>
        <div className="spinner-grow text-success" role="status" />
        <span>กรุณารอสักครู่</span>
    </div> : null}

    <div className='card border-success card_custom'>
        <div className='card-header'><b>Setting Agent</b> 
            <button className="btn btn-sm btn-success" style={{position: 'absolute', right: 13, top: 5}} onClick={refreshData}><i className="bi bi-arrow-clockwise"></i></button> 
        </div>
        <div className="card-body">
            <table className="table table-sm table-hover">
              <thead className='table-primary'>
                  <tr style={{borderBottom: 1, borderBottomColor: '#808080'}}>
                    <th>UserName</th>
                    <th>FullName</th>
                    <th>Group</th>
                    <th>Level</th>
                    <th>Active</th>
                  </tr>
              </thead>
              <tbody>
              {
                  list.map((user: _User, index) => {
                    return (<tr key={index} onClick={()=> selectData(user)}>
                      <td>&nbsp;{user.login}</td>
                      <td>&nbsp;{user.first_name + "" + user.last_name}</td>
                      <td>&nbsp;{getGroupName(user.group_id)}</td>
                      <td>&nbsp;{getLevelName(user.level_id)}</td>
                      <td>&nbsp;{user.is_active}</td>
                    </tr>)
                  })
              } 
              {
                  Array(PAGE_SIZE_SM-list.length).fill(0).map((item: any, index) => {
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
            {/*<div className='container-fluid' style={{marginTop: -5, paddingBottom: 5}}>
                <div className='row'>
                    <div className='col'><ResponsivePagination current={page} total={Math.ceil(total/PAGESIZE)} onPageChange={toPage} extraClassName='justify-content-start'/></div>
                    <div className='col' style={{textAlign: 'end', alignContent: 'center', marginTop: 10, fontWeight: 600, color: 'blue'}}>{total} Records</div>
                </div>
            </div>*/}  
            <div className='container-fluid mb-2'>
                <div className='row'>
                    <div className='col' style={{marginLeft: -10}}><Pagination current={page} total={total} pageSize={PAGE_SIZE_SM} size={'small'} hideOnSinglePage onChange={toPage}/></div>
                    <div className='col' style={{textAlign: 'end', alignContent: 'center', fontSize: 14, fontWeight: 600, color: 'blue'}}>{total} Records</div>
                </div>
            </div>
        </div>
    </div>

    <br/>          
    <fieldset disabled>
      <div className='container-fluid'>
        <div className='row mb-2'>
          <div className='col-3'>
              <label className="form-label">Agent ID</label><input type="text" className="form-control form-control-sm" value={curitem.agent_id} readOnly/>
          </div>
          <div className='col-3'>
              <label className="form-label">UserName</label><input type="text" className="form-control form-control-sm" value={curitem.login} readOnly/>
          </div>
          <div className='col-4'>
              <label className="form-label">FullName</label><input type="text" className="form-control form-control-sm" value={curitem.first_name + " " +curitem.last_name} readOnly/>
          </div>
          <div className='col-2'>
              <label className="form-label">Active</label><input type="text" className="form-control form-control-sm" value={curitem.is_active} readOnly/>
          </div>
        </div>
        <div className='row mb-2'>
          <div className='col-3'>
              <label className="form-label">Level</label><input type="text" className="form-control form-control-sm" value={getLevelName(curitem.level_id)} readOnly/>
          </div>
          <div className='col-3'>
              <label className="form-label">Group</label><input type="text" className="form-control form-control-sm" value={getGroupName(curitem.group_id)} readOnly/>
          </div>
          <div className='col-3 d-flex align-items-end' >
              <a href="#" style={{textDecoration: 'none', color: 'red'}}>RESET PASSWORD</a>
          </div>
        </div>      
      </div>
    </fieldset>  
  </div>)
}