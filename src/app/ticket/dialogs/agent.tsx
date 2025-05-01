import { useEffect, useState } from "react";



export default function DialogAgent(props: {selectAgent: number[]}) {
    const [agents, setAgents] = useState<[]>([]);

    useEffect(() => {
      setAgents(JSON.parse( localStorage.getItem("agent_list")! ));
    }, [])

    const selectItem = (e: any) => {
        if (e.target.checked)
            props.selectAgent.push(e.target.value);
        else
            props.selectAgent.splice(props.selectAgent.indexOf(e.target.value), 1);
    }
    
    return(<div className='card shadow mt-1'><div className="card-body">
        <table className="table table-sm table-hover">
            <tbody>
            {
                agents.map((item: any) => {
                if (localStorage.getItem('userid') != item.agent_id)
                    return(<tr>
                        <td><input className="form-check-input" type="checkbox" value={item.agent_id} onChange={selectItem}/></td>
                        <td>{item.login}</td>
                        <td>{item.first_name}</td>
                    </tr>)
               }) 
            }
            </tbody>
        </table>
    </div></div>)
}