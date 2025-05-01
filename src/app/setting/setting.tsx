import React, { useState } from 'react'
import AgentConfig from './agents-config';
import SsimConfig from './ssim-config';


export default function Setting() {
    const [curtab,  setCurtab] = useState<String>("Agents"); 

    return (<React.Fragment>
      <ul className="nav nav-tabs">
        <li className="nav-item">
            <a className={curtab==="Agents" ? "nav-link active" : "nav-link"} href="#" onClick={(e) => setCurtab("Agents")}>Agents</a></li>     
        <li className="nav-item">
            <a className={curtab==="SSIM" ? "nav-link active" : "nav-link"} href="#" onClick={(e) => setCurtab("SSIM")}>SSIM</a></li>     
      </ul>

      {curtab==="Agents"  && <AgentConfig/>}
      {curtab==="SSIM"    && <SsimConfig />}   
    </React.Fragment>)
}