import { useState } from "react";
import DialogGroup from "./group";
import DialogAgent from "./agent";



type DialogProps = {
    setOpenDiaog: (openDialog: boolean)  => void,
    setDataDiaog: (dataDialog: number[]) => void,
    setTypeDiaog: (typeDialog: string)   => void
}

export default function DialogMain(props: DialogProps) {
    const {setOpenDiaog, setDataDiaog, setTypeDiaog} = props;

    const [curtab,  setCurtab] = useState<String>("Group");
    const [selectGroup,  setSelectGroup] = useState<number[]>([]);
    const [selectAgent,  setSelectAgent] = useState<number[]>([]);

    const setCurtabGroup = () => {
      setCurtab("Group");
      setSelectAgent([]);
    }
    const setCurtabAgent = () => {
      setCurtab("Agent");
      setSelectGroup([]);
    }    
    

    const Close = () => {
      setTypeDiaog("");
      setDataDiaog([]);
      setOpenDiaog(false)
    }
    const Transfer = () => {
      if (curtab==="Group") {
          if (selectGroup.length===0) {
              alert("Please select Group..");
              return;
          }
          setTypeDiaog("Group");
          setDataDiaog(selectGroup);
      }
      else {
        if (selectAgent.length===0) {
            alert("Please select Agent..");
            return;
        }        
        setTypeDiaog("Agent");
        setDataDiaog(selectAgent);
      }
      setOpenDiaog(false)
    }


    return(<div>
      <ul className="nav nav-tabs">
        {/*<li className="nav-item"><button className="btn btn-sm btn-secondary mt-2 me-2" type="button" onClick={(e)=> setOpenDiaog(false)}><i className="bi bi-backspace"></i>&nbsp;<b>Back</b></button></li>*/}
        <li className="nav-item">
            <a className={curtab==="Group" ? "nav-link active" : "nav-link"} onClick={(e) => setCurtabGroup()}>Group</a></li>
        <li className="nav-item">
            <a className={curtab==="Agent" ? "nav-link active" : "nav-link"} onClick={(e) => setCurtabAgent()}>Agent</a></li>
      </ul>   

      <div style={{position: 'absolute', right: 5, top: 15}}>
        <button className="btn btn-sm btn-primary mt-2 me-2" type="button" onClick={Transfer}><i className="bi bi-check-lg"></i>&nbsp;Select</button>
        <button className="btn btn-sm btn-secondary mt-2 me-2" type="button"  onClick={Close}><i className="bi bi-x-lg"></i>&nbsp;Close</button>
      </div>
      
      {curtab==="Group" && <DialogGroup selectGroup={selectGroup}/>}
      {curtab==="Agent" && <DialogAgent selectAgent={selectAgent}/>}    
    </div>)
}