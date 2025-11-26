import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import workSpaceServices from "./workSpaceService";
import { data } from "react-router-dom";

const initialState = {
    isError : false,
    isPending : false,
    isSuccess : false,
}

export const getLatestVersionSlice = createAsyncThunk("workSpace/getLatestVersion", async(data,thunkAPI)=>{
    try {
        return await workSpaceServices?.getLatestVersionService(data);
    } catch (error) {
        thunkAPI?.rejectWithValue(error);
    }
})

export const getExecuteQueriesSlice = createAsyncThunk("workSpace/getQueries", async(data,thunkAPI)=>{
    try {
        return await workSpaceServices?.getExecuteQueriesService(data);
    } catch (error) {
        thunkAPI?.rejectWithValue(error);
    }
})

export const getTableDataSlice = createAsyncThunk("workSpace/getTableData", async(data,thunkAPI)=>{
    try {
        return await workSpaceServices?.getTableDataService(data);
    } catch (error) {
        thunkAPI?.rejectWithValue(error);
    }
})


export const loadValidationDataSlice = createAsyncThunk("workSpace/loadValidationData", async(data,thunkAPI)=>{
    try {
        return await workSpaceServices.loadValidationDataService(data);
    } catch (error) {
        thunkAPI?.rejectWithValue(error)
    }
})

export const getValidationTableSlice = createAsyncThunk('workspace/getvalidationdata',async(data,thunkAPI)=>{
    try {
        return await workSpaceServices.getValidationTableService(data);
    } catch (error) {
        thunkAPI?.rejectWithValue(error)
    }
})


export const validateMandatoryFieldsSlice = createAsyncThunk('workspace/validatemandatoryfields',async(data,thunkAPI)=>{
    try {
        console.log("here for mand fix")
        const response = workSpaceServices.validateMandatoryFieldsService(data);
        console.log(response);
        return await response
    } catch (error) {
        console.log("here for mand error")
        return error;
    }
})

export const validateLookupFieldsSlice = createAsyncThunk('workspace/validatelookupfields',async(data,thunkAPI)=>{
    try {
        return await workSpaceServices.validateLookupFieldsService(data);
    } catch (error) {
        return error;
    }
})

export const getPreloadTableSlice = createAsyncThunk('workspace/getpreloadtableservice',async(data,thunkAPI)=>{
    try {
        return await workSpaceServices.getPreloadTableService(data);
    } catch (error) {
       thunkAPI?.rejectWithValue(error)
    }
})

export const getErrorTableSlice = createAsyncThunk('workspace/get_error_table',async(data,thunkAPI)=>{
    try {
        return await workSpaceServices.getErrorTableService(data);
    } catch (error) {
        thunkAPI?.rejectWithValue(error)
    }
})

export const loadPreloadTablesSlice = createAsyncThunk('workspace/loadpreloadtables',async(data,thunkAPI)=>{
    try {
        return await workSpaceServices.loadPreloadTablesService(data);
    } catch (error) {
        thunkAPI?.rejectWithValue(error);
    }
})

export const getFileNamesSlice = createAsyncThunk('workspace/getfilenames',async(data,thunkAPI)=>{
    try {
        return await workSpaceServices.getFileNamesService(data);
    } catch (error) {
        thunkAPI?.rejectWithValue(error);
    }
})

export const getWorkSpaceTableSlice = createAsyncThunk('workspace/getworkspacetable',async(data,thunkAPI)=>{
    try {
        return await workSpaceServices.getWorkSpaceTableService(data);
    } catch (error) {
        thunkAPI?.rejectWithValue(error);
    }
})

export const getErrorColumnsTableSlice = createAsyncThunk('workspace/geterrorcolumnstable',async(data,thunkAPI)=>{
    try {
        return await workSpaceServices.getErrorColumnsTableService(data);
    } catch (error) {
        thunkAPI?.rejectWithValue(error);
    }
})

export const getFileErrorTableSlice = createAsyncThunk('workspace/getfileerrortable',async(data,thunkAPI)=>{
    try {
        return await workSpaceServices.getFileErrorTableService(data);
    } catch (error) {
        thunkAPI?.rejectWithValue(error);
    }
})

export const getPostLoadReportSlice = createAsyncThunk('workspace/getpostloadreport',async(data,thunkAPI)=>{
    try {
        return await workSpaceServices.getPostLoadReportService(data);
    } catch (error) {
        thunkAPI?.rejectWithValue(error);
    }
})

export const getPostLoadPivotSlice = createAsyncThunk('workspace/getpostloadpivot',async(data,thunkAPI)=>{
    try {
        return await workSpaceServices.getPostLoadPivotService(data);
    } catch (error) {
        thunkAPI?.rejectWithValue(error);
    }
})

export const getAllFilesByProjectIdSlice = createAsyncThunk('workspace/getallfilesbyproject',async(data,thunkAPI)=>{
    try {
        return await workSpaceServices.getAllFilesByProjectIdService(data);
    } catch (error) {
        thunkAPI?.rejectWithValue(error);
    }
})

export const getAllScenarioByFileIdSlice = createAsyncThunk('workspace/getallscenariobyfile',async(data,thunkAPI)=>{
    try {
        return await workSpaceServices.getAllScenarioByFileIdService(data);
    } catch (error) {
        thunkAPI?.rejectWithValue(error);
    }
})

export const getScenarioTableSlice = createAsyncThunk('workspace/getscenariotable',async(data,thunkAPI)=>{
    try {
        return await workSpaceServices.getScenarioTableService(data);
    } catch (error) {
        thunkAPI?.rejectWithValue(error);
    }
})

const workSpaceSlice = createSlice({
    name : "workSpace",
    initialState : initialState,
    reducers : {},
    extraReducers : (builder)=>{
        builder.addCase(getLatestVersionSlice.pending,(state,action)=>{
            state.isError = false;
            state.isPending = true;
            state.isSuccess = false;
        })
        .addCase(getLatestVersionSlice.fulfilled,(state,action)=>{
            state.isError = false;
            state.isPending = false;
            state.isSuccess = true;
        })
        .addCase(getLatestVersionSlice?.rejected,(state,action)=>{
            state.isError = true;
            state.isPending = false;
            state.isSuccess = false;
        })
        
        builder.addCase(getExecuteQueriesSlice.pending,(state,action)=>{
            state.isError = false;
            state.isPending = true;
            state.isSuccess = false;
        })
        .addCase(getExecuteQueriesSlice.fulfilled,(state,action)=>{
            state.isError = false;
            state.isPending = false;
            state.isSuccess = true;
        })
        .addCase(getExecuteQueriesSlice?.rejected,(state,action)=>{
            state.isError = true;
            state.isPending = false;
            state.isSuccess = false;
        })

        builder.addCase(getTableDataSlice.pending,(state,action)=>{
            state.isError = false;
            state.isPending = true;
            state.isSuccess = false;
        })
        .addCase(getTableDataSlice.fulfilled,(state,action)=>{
            state.isError = false;
            state.isPending = false;
            state.isSuccess = true;
        })
        .addCase(getTableDataSlice?.rejected,(state,action)=>{
            state.isError = true;
            state.isPending = false;
            state.isSuccess = false;
        })

        builder.addCase(loadValidationDataSlice?.pending,(state,action)=>{
            state.isError = false;
            state.isPending = true;
            state.isSuccess = false
        })
        .addCase(loadValidationDataSlice?.fulfilled,(state,action)=>{
            state.isError = false;
            state.isSuccess = true;
            state.isPending = false;
        })
        .addCase(loadValidationDataSlice?.rejected,(state,action)=>{
            state.isError = true;
            state.isPending = false;
            state.isSuccess = false;
        })

        builder.addCase(getErrorTableSlice?.pending,(state,action)=>{
            state.isError = false;
            state.isPending = true;
            state.isSuccess = false
        })
        .addCase(getErrorTableSlice?.fulfilled,(state,action)=>{
            state.isError = false;
            state.isSuccess = true;
            state.isPending = false;
        })
        .addCase(getErrorTableSlice?.rejected,(state,action)=>{
            state.isError = true;
            state.isPending = false;
            state.isSuccess = false;
        })

        builder.addCase(getValidationTableSlice?.pending,(state,action)=>{
            state.isError = false;
            state.isPending = true;
            state.isSuccess = false;
        })
        .addCase(getValidationTableSlice?.fulfilled,(state,action)=>{
            state.isError = false;
            state.isSuccess = true;
            state.isPending = false;
        })
        .addCase(getValidationTableSlice?.rejected,(state,action)=>{
            state.isError = true;
            state.isPending = false;
            state.isSuccess = false;
        })

        builder.addCase(validateMandatoryFieldsSlice?.pending,(state,action)=>{
            state.isError = false;
            state.isPending = true;
            state.isSuccess = false;
            console.log(action)
        })
        .addCase(validateMandatoryFieldsSlice?.fulfilled,(state,action)=>{
            state.isError = false;
            state.isPending = false;
            state.isSuccess = true;
            console.log(action)
        })
        .addCase(validateMandatoryFieldsSlice?.rejected,(state,action)=>{
            state.isError = true;
            state.isPending = false;
            state.isSuccess = false;
            console.log(action)
        })

        builder.addCase(validateLookupFieldsSlice?.pending,(state,action)=>{
            state.isError = false;
            state.isPending = true;
            state.isSuccess = false;
            console.log(action);
        })
        .addCase(validateLookupFieldsSlice?.fulfilled,(state,action)=>{
            state.isError = false;
            state.isPending = false;
            state.isSuccess = true;
            console.log(action);
        })
        .addCase(validateLookupFieldsSlice?.rejected,(state,action)=>{
            state.isError = true;
            state.isPending = false;
            state.isSuccess = false;
            console.log(action);
        })

        builder.addCase(getPreloadTableSlice?.pending,(state,action)=>{
            state.isError = false;
            state.isPending = true;
            state.isSuccess = false;
        })
        .addCase(getPreloadTableSlice?.fulfilled,(state,action)=>{
            state.isError = false;
            state.isPending = false;
            state.isSuccess = true;
        })
        .addCase(getPreloadTableSlice?.rejected,(state,action)=>{
            state.isError = true;
            state.isPending = false;
            state.isSuccess = false;
        })
        
        builder.addCase(loadPreloadTablesSlice?.pending,(state,action)=>{
            state.isError = false;
            state.isPending = true;
            state.isSuccess = false;
        })
        .addCase(loadPreloadTablesSlice?.fulfilled,(state,action)=>{
            state.isError = false;
            state.isPending = false;
            state.isSuccess = true;
        })
        .addCase(loadPreloadTablesSlice?.rejected,(state,action)=>{
            state.isError = true;
            state.isPending = false;
            state.isSuccess = false;
        })

        builder.addCase(getFileNamesSlice?.pending,(state,action)=>{
            state.isError = false;
            state.isPending = true;
            state.isSuccess = false;
        })
        .addCase(getFileNamesSlice?.fulfilled,(state,action)=>{
            state.isError = false;
            state.isPending = false;
            state.isSuccess = true;
        })
        .addCase(getFileNamesSlice?.rejected,(state,action)=>{
            state.isError = true;
            state.isPending = false;
            state.isSuccess = false;
        })

        builder.addCase(getWorkSpaceTableSlice?.pending,(state,action)=>{
            state.isError = false;
            state.isPending = true;
            state.isSuccess = false;
        })
        .addCase(getWorkSpaceTableSlice?.fulfilled,(state,action)=>{
            state.isError = false;
            state.isPending = false;
            state.isSuccess = true;
        })
        .addCase(getWorkSpaceTableSlice?.rejected,(state,action)=>{
            state.isError = true;
            state.isPending = false;
            state.isSuccess = false;
        })
        
        builder.addCase(getErrorColumnsTableSlice?.pending,(state,action)=>{
            state.isError = false;
            state.isPending = true;
            state.isSuccess = false;
        })
        .addCase(getErrorColumnsTableSlice?.fulfilled,(state,action)=>{
            state.isError = false;
            state.isPending = false;
            state.isSuccess = true;
        })
        .addCase(getErrorColumnsTableSlice?.rejected,(state,action)=>{
            state.isError = true;
            state.isPending = false;
            state.isSuccess = false;
        })

        builder.addCase(getFileErrorTableSlice?.pending,(state,action)=>{
            state.isError = false;
            state.isPending = true;
            state.isSuccess = false;
        })
        .addCase(getFileErrorTableSlice?.fulfilled,(state,action)=>{
            state.isError = false;
            state.isPending = false;
            state.isSuccess = true;
        })
        .addCase(getFileErrorTableSlice?.rejected,(state,action)=>{
            state.isError = true;
            state.isPending = false;
            state.isSuccess = false;
        })
        
        builder.addCase(getPostLoadReportSlice?.pending,(state,action)=>{
            state.isError = false;
            state.isPending = true;
            state.isSuccess = false;
        })
        .addCase(getPostLoadReportSlice?.fulfilled,(state,action)=>{
            state.isError = false;
            state.isPending = false;
            state.isSuccess = true;
        })
        .addCase(getPostLoadReportSlice?.rejected,(state,action)=>{
            state.isError = true;
            state.isPending = false;
            state.isSuccess = false;
        })
        
        builder.addCase(getPostLoadPivotSlice?.pending,(state,action)=>{
            state.isError = false;
            state.isPending = true;
            state.isSuccess = false;
        })
        .addCase(getPostLoadPivotSlice?.fulfilled,(state,action)=>{
            state.isError = false;
            state.isPending = false;
            state.isSuccess = true;
        })
        .addCase(getPostLoadPivotSlice?.rejected,(state,action)=>{
            state.isError = true;
            state.isPending = false;
            state.isSuccess = false;
        })
        
        builder.addCase(getAllFilesByProjectIdSlice?.pending,(state,action)=>{
            state.isError = false;
            state.isPending = true;
            state.isSuccess = false;
        })
        .addCase(getAllFilesByProjectIdSlice?.fulfilled,(state,action)=>{
            state.isError = false;
            state.isPending = false;
            state.isSuccess = true;
        })
        .addCase(getAllFilesByProjectIdSlice?.rejected,(state,action)=>{
            state.isError = true;
            state.isPending = false;
            state.isSuccess = false;
        })
        
        builder.addCase(getAllScenarioByFileIdSlice?.pending,(state,action)=>{
            state.isError = false;
            state.isPending = true;
            state.isSuccess = false;
        })
        .addCase(getAllScenarioByFileIdSlice?.fulfilled,(state,action)=>{
            state.isError = false;
            state.isPending = false;
            state.isSuccess = true;
        })
        .addCase(getAllScenarioByFileIdSlice?.rejected,(state,action)=>{
            state.isError = true;
            state.isPending = false;
            state.isSuccess = false;
        })
        
        builder.addCase(getScenarioTableSlice?.pending,(state,action)=>{
            state.isError = false;
            state.isPending = true;
            state.isSuccess = false;
        })
        .addCase(getScenarioTableSlice?.fulfilled,(state,action)=>{
            state.isError = false;
            state.isPending = false;
            state.isSuccess = true;
        })
        .addCase(getScenarioTableSlice?.rejected,(state,action)=>{
            state.isError = true;
            state.isPending = false;
            state.isSuccess = false;
        })
        

    }
})

export default workSpaceSlice?.reducer