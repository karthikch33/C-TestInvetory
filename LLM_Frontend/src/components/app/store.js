import { configureStore} from "@reduxjs/toolkit";
import projectReducer from "../features/Project/projectSlice";
import bussinesrulesReducer from '../features/BussinessRules/BussinessRulesSlice'
import fileReducer from '../features/Connections/fileSlice'
import workspaceReducer from '../features/WorkSpace/workSpaceSlice'

export const store = configureStore({
    reducer:{
        project : projectReducer,
        bussinessrules : bussinesrulesReducer,
        file : fileReducer,
        workspace : workspaceReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false,}),
})