import axios from 'axios'
import urls from '../../utils/base_url';


const getLatestVersionService = async(data)=>{
    try {
        const response = await axios?.get(`${urls?.url}getLatestVersion/${data?.project_id}/${data?.object_id}/${data?.segment_id}/`);
        return response;
    } catch (error) {
        console.log(error)
    }
}
 
const getExecuteQueriesService = async(data)=>{
    try {
        const response = await axios.post(`${urls?.url}api/files/${data?.file_id}/prompt_tables/`,data?.message)
        return response;
    } catch (error) {
        console.log(error)
    }
}

const getTableDataService = async(data)=>{
    try {
        const response = await axios?.get(`${urls?.url}getTable/${data?.segment_id}/`);
        return response;
    } catch (error) {
        console.log(error)
    }
}



const loadValidationDataService = async(data)=>{
    try {
        const response =await  axios.post(`${urls.url}create_Validation_Table/`,data)
        return response;
    } catch (error) {
        console.log(error)
    }
}


const validateMandatoryFieldsService = async(data)=>{
    try {
        const response = await axios.post(`${urls?.url}validate_mandatory_fields/`,data);
        return response;
    } catch (error) {
        return error;
    }
}

const validateLookupFieldsService = async(data)=>{
    try {
        const response = await axios.post(`${urls?.url}validate_Lookup_fields/`,data);
        return response;
    } catch (error) {
        return error;
    }
}

const getPreloadTableService = async(data)=>{
    try {
        const response = await axios.get(`${urls?.url}get_preLoad_table/${data?.project_id}/${data?.object_id}/${data?.segment_id}/`);
        return response;
    } catch (error) {
        return error;
    }
}

const loadPreloadTablesService = async(data)=>{
    try {
        const response = await axios.post(`${urls?.url}create_PreLoad_Tables/`,data);
        return response;
    } catch (error) {
        return error;
    }
}

const getErrorTableService = async(data)=>{
    try {
        const response = await axios.get(`${urls?.url}get_error_table/${data?.project_id}/${data?.object_id}/${data?.segment_id}/`);
        return response;
    } catch (error) {
        return error;
    }
}

const getValidationTableService = async(data)=>{
    try {
        const response = await axios.get(`${urls?.url}get_validation_table/${data?.project_id}/${data?.object_id}/${data?.segment_id}/`);
        return response;
    } catch (error) {
        return error;
    }
}

const getFileNamesService = async(data)=>{
    try {
        const response = await axios.get(`${urls?.url}api/projects/${data?.project_id}/files/`);
        return response;
    } catch (error) {
        console.log(error);
    }
}

const getWorkSpaceTableService = async(data)=>{
    try {
        const response = await axios.get(`${urls?.url}api/files/${data?.file_id}/tables/`);
        return response;
    } catch (error) {
        console.log(error);
    }
}

const getErrorColumnsTableService = async(data)=>{
    try {
        const response = await axios.post(`${urls?.url}api/files/${data?.file_id}/create_error_records/`,data)
        return response;
    } catch (error) {
        console.log(error)
    }
}

const getFileErrorTableService = async(data)=>{
    try {
        const response = await axios.get(`${urls?.url}api/files/${data?.file_id}/get_error_table/`)
        return response;
    } catch (error) {
        console.log(error);
    }
}

const getPostLoadReportService = async(data)=>{
    try {
        const response = await axios.get(`${urls?.url}api/Get_Post_Load_Report/${data?.preload_id}/${data?.postload_id}/`);
        return response;
    } catch (error) {
        console.log(error);
    }
}

// api/Get_Post_Load_Pivot/<int:pre_id>/<int:post_id>/'
const getPostLoadPivotService = async(data)=>{
    try {
        const response = await axios.get(`${urls?.url}api/Get_Post_Load_Pivot/${data?.preload_id}/${data?.postload_id}/`);
        return response;
    } catch (error) {
        console.log(error);
    }
}
// api/projects/<int:project_id>/files/
const getAllFilesByProjectIdService = async(data)=>{
    try {
        const response = await axios.get(`${urls?.url}api/list_files_by_project/${data?.project_id}/`);
        return response;
    } catch (error) {
        console.log(error)
    }
}

const getAllScenarioByFileIdService = async (data)=>{
    try {
        const response = await axios.get(`${urls?.url}api/list_senerios_by_file/${data?.file_id}/`)
        return response;
    } catch (error) {
        console.log(error);
    }
}

const getScenarioTableService = async (data)=>{
    try {
        const response = await axios.get(`${urls?.url}api/get_table_by_senerio/${data?.senario_id}/`)
        return response;
    } catch (error) {
        console.log(error);
    }
}

const workSpaceServices = {
    getLatestVersionService,
    getExecuteQueriesService,
    getTableDataService,
    getValidationTableService,
    loadValidationDataService,
    validateMandatoryFieldsService,
    validateLookupFieldsService,
    getErrorTableService,
    getPreloadTableService,
    loadPreloadTablesService,
    getFileNamesService,
    getWorkSpaceTableService,
    getErrorColumnsTableService,
    getFileErrorTableService,
    getPostLoadReportService,
    getPostLoadPivotService,
    getAllFilesByProjectIdService,
    getAllScenarioByFileIdService,
    getScenarioTableService
}

export default workSpaceServices;