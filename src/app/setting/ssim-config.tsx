import React, { useCallback, useEffect, useState } from 'react'
import { Tree } from 'antd';
import type { TreeDataNode } from 'antd';
import axios from 'axios';
import { env } from '../../Environment';
import { useAppDispatch } from '../../store/store';
import { _loadingStart, _loadingFinish } from './../../store/slices/loading-slice';


type CurrData = {
    ssim_id: string,
    description: string,
    need_day: string,
    need_hr: string,
    is_active: string
}
const defaultCurrData: CurrData = {
    ssim_id: "",
    description: "",
    need_day: "",
    need_hr: "",
    is_active: ""    
}


export default function SsimConfig() {
    const dispatch = useAppDispatch();
    const [treeData, setTreeData] = useState<TreeDataNode[]>([]);
    const [currData, setCurrData] = useState<CurrData>(defaultCurrData);
    const [screenH , setScreenH ] = useState<number>(window.innerHeight);

    const refreshData = useCallback(() => {
        const config = { withCredentials: true, headers: {'Content-Type': 'application/json;charset=UTF-8'} };
        dispatch( _loadingStart() );
        axios.get(env.url+'v1/lookup/ssimkey', config).then(result => {
            dispatch( _loadingFinish() );
            localStorage.setItem("ssim_tree", JSON.stringify(result.data));
            setTreeData(result.data);
        }).catch(error => {
            dispatch( _loadingFinish() );  console.log(error.message);
            const errrData: TreeDataNode[] = [{key: '0',  title: 'Loading Failed..'}];
            setTreeData(errrData);
        });   
    }, [dispatch]);

    useEffect(() => {
        const ssim_tree = localStorage.getItem("ssim_tree");
        if (ssim_tree == null) 
            refreshData();
        else 
            setTreeData(JSON.parse(ssim_tree));
        
        // monotor screen heigth
        function handleResize() { setScreenH(window.innerHeight); }
        window.addEventListener('resize', handleResize);
        return () => { window.removeEventListener('resize', handleResize); console.log("RemoveEventListener"); }  
    }, [refreshData])
    


    const onSelect = (selectedKeys: React.Key[], info: any) => {
        //console.log('selected', selectedKeys, info); //alert(info.node.moreinfo);  
        setCurrData({...currData, 
            ssim_id: info.node.key,
            description: info.node.title,
            need_day: info.node.moreinfo.split("-")[0],
            need_hr: info.node.moreinfo.split("-")[1],
            is_active: info.node.moreinfo.split("-")[2]
        });
    };
    
    return (<div className='container-fluid py-3 set_tab_full'>
        <div className='card border-success card_custom'>
            <div className='card-header'><b>Setting SSIM</b> 
                <button className="btn btn-sm btn-success" style={{position: 'absolute', right: 13, top: 5}} onClick={refreshData}><i className="bi bi-arrow-clockwise"></i></button> 
            </div>     
            <div className="card-body">
                    <div className='row'>
                        <div className='col mt-2'>
                            <Tree
                                onSelect={onSelect}
                                treeData={treeData}
                                height={screenH-160} 
                                style={{backgroundColor: '#CCFFFF'}}/>
                        </div>
                        <div className='col'>
                            <div className='row'>
                                <div className='col-4'>
                                    <label className="form-label" htmlFor='ssim_id'>ID</label>
                                    <input type="text" className="form-control form-control-sm" id="ssim_id" name="ssim_id" value={currData.ssim_id} disabled/>
                                </div>
                                <div className='col-8'>
                                    <label className="form-label" htmlFor='description'>Description</label>
                                    <input type="text" className="form-control form-control-sm" id="description" name="description" value={currData.description} disabled/>
                                </div>
                            </div>
                            <div className='row mt-3 mb-3'>
                                <div className='col-4'>
                                    <label className="form-label" htmlFor='need_day'>Need Day</label>
                                    <input type="text" className="form-control form-control-sm" id="need_day" name="need_day" value={currData.need_day} disabled/>
                                </div>
                                <div className='col-4'>
                                    <label className="form-label" htmlFor='need_mi'>Need Hour</label>
                                    <input type="text" className="form-control form-control-sm" id="need_hr" name="need_hr" value={currData.need_hr} disabled/>
                                </div>
                                <div className='col-4'>
                                    <label className="form-label" htmlFor='is_active'>Active</label>
                                    <input type="text" className="form-control form-control-sm" id="is_active" name="is_active" value={currData.is_active} disabled/>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>       
        </div>
    </div>)
}
