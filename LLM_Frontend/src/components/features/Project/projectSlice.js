import { createSlice, createAsyncThunk,createAction } from "@reduxjs/toolkit";
import { projectServices } from "./projectService";

const initialState ={
    isError:false,
    isSucess:false,
    isPending:false,
    errorCode : 500,
    errorMessage : "Unknow Error",
    projects: []
}

export const resetState = createAction("Reset_all")

export const createProjectSlice = createAsyncThunk('project/createproject',async (data,thunkAPI)=>{
    try {
        const response = await projectServices.createProjectService(data);
        if(response?.status !== 200){
            return thunkAPI?.rejectWithValue({
                status : response?.status || 500,
                message : response?.data?.error || "Something Went Wrong"
            })
        }

        return response;
    } catch (error) {
        return thunkAPI?.rejectWithValue({
            status : error?.response?.status || 500,
            message : error?.response?.data?.error || "Server Error"
        })
    }
})

export const getProjectsSlice = createAsyncThunk('project/getproject',async (data,thunkAPI)=>{
    try {
        const response = await projectServices.getProjectsService();

        if(response?.status !== 200){
            return thunkAPI?.rejectWithValue({
                status : response?.status || 500,
                message : response?.data?.error || "Something Went Wrong"
            })
        }

        return response;
    } catch (error) {
        return thunkAPI?.rejectWithValue({
            status : error?.response?.status || 500,
            message : error?.response?.data?.error || "Server Error"
        })
    }
})

export const updateProjectsSlice = createAsyncThunk('project/updateproject',async (data,thunkAPI)=>{
    try {
        const response = await projectServices.updateProjectService(data);

        if(response?.status === 409){
            return thunkAPI?.rejectWithValue({
                status : response?.status || 500,
                message : response?.response?.data?.message
            })
        }
        else if(response?.status !== 200){
            return thunkAPI?.rejectWithValue({
                status : response?.status || 500,
                message : response?.data?.message || 'Something Went Wrong'
            })
        }

        return response;

    } catch (error) {
        return thunkAPI?.rejectWithValue({
            status : error?.response?.status || 500,
            message : error?.response?.data?.message || 'Server Error'
        })
    }
})

export const deleteProjectsSlice = createAsyncThunk('project/deleteproject',async (data,thunkAPI)=>{
    try {
        const response = await projectServices.deleteProjectService(data);

        if(response?.status !== 200){
            return thunkAPI?.rejectWithValue({
                status : response?.status || 500,
                message : response?.data?.message || 'Something Went Wrong'
            })
        }

        return response;
    } catch (error) {
        return thunkAPI?.rejectWithValue({
            status : error?.response?.status || 500,
            message : error?.response?.data?.message || 'Server Error'
        })
    }
})

const formatDateString = (isoDate)=>{  
    const date = new Date(isoDate);  
    const day = String(date.getDate()).padStart(2, '0');  
    const month = String(date.getMonth() + 1).padStart(2, '0');  
    const year = date.getFullYear();  
    const hours = String(date.getHours()).padStart(2, '0');  
    const minutes = String(date.getMinutes()).padStart(2, '0');  
    const seconds = String(date.getSeconds()).padStart(2, '0');  

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;  
} 

const projectDataFormat = (data)=>{
    const {project_name, project_id, project_description, created_time} = data;
   return {
    project_id : project_id,
    project_name : project_name,
    description : project_description,
    created_at : formatDateString(created_time),
    created_by : 'aditya'
  }
}

const getProjectsDataFormat = (data)=>{
    const formatData = []

    Array.isArray(data) && data?.forEach((field,index)=>{
        formatData.push({
            project_id : field?.project_id,
            project_name : field?.project_name,
            description : field?.project_description,
            created_at : formatDateString(field?.created_time),
            created_by : 'aditya'
        })
    })

    return formatData
}

const projectSlice = createSlice({
    name:"project",
    initialState:initialState,
    reducers:{
        // resetDeletedProject : (state)=>{
        //     state.deletedProject = null;
        // }
    },
    extraReducers: (builder)=>{
        builder.addCase(getProjectsSlice.pending,(state)=>{
            state.isError = false;
            state.isPending = true;
            state.isSucess = false;
        }).addCase(getProjectsSlice.fulfilled,(state,action)=>{
            state.isError = false;
            state.isPending = false;
            state.isSucess = true;
           
            const formatedData = getProjectsDataFormat(action?.payload?.data?.data);
            state.projects = formatedData
        }).addCase(getProjectsSlice.rejected,(state,action)=>{
            state.isError = true;
            state.isPending = false;
            state.isSucess = false;

            state.errorMessage = action.payload?.message;
            state.errorCode = action.payload?.status;
        })

        builder.addCase(updateProjectsSlice.pending,(state)=>{
            state.isError = false;
            state.isPending = true;
            state.isSucess = false;
        }).addCase(updateProjectsSlice.fulfilled,(state,action)=>{
            state.isError = false;
            state.isPending = false;
            state.isSucess = true;

            let updated_project_data = action?.payload?.data?.updated_project;

            const updated_data = state.projects?.map((project)=>{
                if(project?.project_id !== updated_project_data?.project_id){
                    return project;
                }
                else{
                   return{ ...project,
                    project_name : updated_project_data?.project_name,
                    description : updated_project_data?.project_description
                   }
                }
            })

            state.projects = updated_data

        }).addCase(updateProjectsSlice.rejected,(state)=>{
            state.isError = true;
            state.isPending = false;
            state.isSucess = false;
        })

        builder.addCase(deleteProjectsSlice.pending,(state)=>{
            state.isError = false;
            state.isPending = true;
            state.isSucess = false;
            state.errorMessage = null
        }).addCase(deleteProjectsSlice.fulfilled,(state,action)=>{
            state.isError = false;
            state.isPending = false;
            state.isSucess = true;

            const deleted_project_id = action?.meta?.arg?.project_id

            state.projects = state.projects?.filter(
                (project) => project?.project_id !== deleted_project_id
            )

        }).addCase(deleteProjectsSlice.rejected,(state)=>{
            state.isError = true;
            state.isPending = false;
            state.isSucess = false;
        })

        builder.addCase(createProjectSlice.pending,(state)=>{
            state.isError = false;
            state.isPending = true;
            state.isSucess = false;
        }).addCase(createProjectSlice.fulfilled,(state,action)=>{
            state.isError = false;
            state.isPending = false;
            state.isSucess = true;                
            
            const formatedData = projectDataFormat(action?.payload?.data);
            state.projects.push(formatedData);                
        }).addCase(createProjectSlice.rejected,(state,action)=>{
            state.isError = true;
            state.isPending = false;
            state.isSucess = false;

            state.errorMessage = action.payload?.message || "Unknown Error";
            state.errorCode = action.payload?.status || null;
        })
    }
})

// export const { resetDeletedProject } = projectSlice.actions;

export default projectSlice.reducer