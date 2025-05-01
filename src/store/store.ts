import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { Deploy, env } from "../Environment";
import AuthenSlicer from "./slices/authen-slice";
import LoadingSlicer from "./slices/loading-slice";
import AgentSlicer from "./slices/agent-slice";
import OnhandSlicer from "./slices/onhand-slice";
import TicketSlicer from "./slices/ticket-slice";
import InOutSlicer from "./slices/in-out-slice";


import logger from 'redux-logger'

const reducer = {
    AuthenSlicer,
    LoadingSlicer,
    AgentSlicer,
    OnhandSlicer,
    TicketSlicer,
    InOutSlicer
};

export const store1 = configureStore({
    reducer,
    devTools: env.status === Deploy.DEV,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}).concat(logger as any),
});

export type RootState = ReturnType<typeof store1.getState>;
type AppDispatch = typeof store1.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();