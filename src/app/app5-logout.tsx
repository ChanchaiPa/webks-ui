import { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store/store';
import { LogoutAction } from "../store/slices/authen-slice";


export const App5Logout =(props: any) => {
    const authenState = useSelector((state: RootState) => state.AuthenSlicer);
    const dispatch = useAppDispatch();
    console.log("App5Logout................");
    useEffect(() => {
        const intervalId = setTimeout(() => {
            dispatch( LogoutAction(authenState.username!) ); 
        }, 3000);  
        return () => clearTimeout(intervalId);  
    }, [])
    
    return (
        <div>There's nothing here: 404!</div>
    )
}