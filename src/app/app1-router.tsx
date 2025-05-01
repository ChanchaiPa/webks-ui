import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { env } from "../Environment";
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import App2Login from "./app2-login";
import App3Content from "./app3-content";
import { App5Logout } from "./app5-logout";


const app_root = env.app_root;
export const App1Router = (props: any) => {
    return(<BrowserRouter basename={env.basename}>
        <Routes >
            <Route path={"/login"} element={ <App2Login/> } />
            <Route path={"/"} element={<Navigate to="/login"></Navigate>} />
            
            <Route path="/" element={ <ProtectedRoutes/> }>
                <Route path={app_root + "/welcome"} element={ <App3Content/> } />
                
                <Route path={app_root + "/home"}  element={ <App3Content/> } />
                <Route path={app_root + "/search"} element={ <App3Content/> } /> 
                <Route path={app_root + "/inbox"} element={ <App3Content/> } /> 
                <Route path={app_root + "/outbox"} element={ <App3Content/> } /> 
                <Route path={app_root + "/setting"} element={ <App3Content/> } />
                <Route path={app_root + "/ticket"}  element={ <App3Content/> } />
            </Route>

            <Route path="*" element={ <App5Logout/> } />
            {/* <Route path="*" element={<p>There's nothing here: 404!</p>} /> */}
        </Routes>
    </BrowserRouter>);
}

//*****************************************************************/
  const ProtectedRoutes = (props: any) => {
    const authenState = useSelector((state: RootState) => state.AuthenSlicer);
    return authenState.userid ? <Outlet /> : <Navigate to="/login" />;
  };  