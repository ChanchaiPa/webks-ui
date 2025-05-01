import axios from "axios";
import { env } from "../Environment";
import { useEffect, useState } from "react";

export const App4Welcome =(props: any) =>{
    const loadLookupData = async() => {
        /*axios.defaults.withCredentials = true;
        const config = { xsrfCookieName: 'token', withCredentials: true, headers: {'Content-Type': 'application/json;charset=UTF-8'} };
        const agents = await axios.get(env.url+'/v1/lookup/agent', config);  
        localStorage.setItem("agent_list", JSON.stringify(agents.data)); 
        const groups = await axios.get(env.url+'/v1/lookup/group', config);  
        localStorage.setItem("group_list", JSON.stringify(groups.data));*/  
    }    

    const [count, setCount] = useState<number>();
    useEffect(() => {
      console.log("Default Effect");  
      return () => {}
    }, []);
    useEffect(() => {
      console.log("Count Effect " + count);  
      return () => {}
    }, [count]);    
    


    return(<div>
        &nbsp;&nbsp;Welcome ...  <br></br> 
       
            <ul className="pagination justify-content-center">
                <li className="page-item disabled">
                <a className="page-link" href="#" tabIndex={1}>Previous</a>
                </li>
                <li className="page-item"><a className="page-link" href="#">1</a></li>
                <li className="page-item"><a className="page-link" href="#">2</a></li>
                <li className="page-item"><a className="page-link" href="#">3</a></li>
                <li className="page-item">
                <a className="page-link" href="#" onClick={() => setCount(1)}>Next</a>
                </li>
            </ul>

    </div>);    
}