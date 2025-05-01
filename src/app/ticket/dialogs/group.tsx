import { useEffect, useState } from "react"



export default function DialogGroup(props: {selectGroup: number[]}) {
    const [groups,  setGroups] = useState<[]>([]);

    useEffect(() => {
      setGroups(JSON.parse( localStorage.getItem("group_list")! ));
    }, [])

    const selectItem = (e: any) => {
        if (e.target.checked)
            props.selectGroup.push(e.target.value);
        else
            props.selectGroup.splice(props.selectGroup.indexOf(e.target.value), 1);
    }
    
    return(<div className='card shadow mt-1'><div className="card-body">
        <table className="table table-sm table-hover">
            <tbody>
            {
               groups.map((item: any) => {
                return(<tr>
                    <td><input className="form-check-input" type="checkbox" value={item.group_id} onChange={selectItem}/></td>
                    <td>{item.name}</td>
                </tr>)
               }) 
            }
            </tbody>
        </table>
    </div></div>)
}