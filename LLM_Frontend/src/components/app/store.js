import { configureStore} from "@reduxjs/toolkit";
import projectReducer from "../features/Project/projectSlice";
import bussinesrulesReducer from '../features/BussinessRules/BussinessRulesSlice'
import fileReducer from '../features/Connections/fileSlice'
import workspaceReducer from '../features/WorkSpace/workSpaceSlice'
import themeReducer from "../features/theme/themeSlice";

export const store = configureStore({
    reducer:{
        project : projectReducer,
        bussinessrules : bussinesrulesReducer,
        file : fileReducer,
        workspace : workspaceReducer,
        theme : themeReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false,}),
})