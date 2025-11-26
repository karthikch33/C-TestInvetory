import axios from 'axios'
import urls from '../../utils/base_url'

const createProjectService = async(data)=>{
    try {
        
        const response = await axios.post(`${urls?.url}api/projects/create/`,data);
        return response;
    } catch (error) {
        return error
    }
}

const getProjectsService = async()=>{
    try {
        const response = await axios.get(`${urls?.url}api/projects/`);
        return response;
    } catch (error) {
        return error
    }
}

const updateProjectService = async (data)=>{
    try {
        const response = await axios.put(`${urls?.url}/api/projects/${data?.project_id}/update/`,data);
        return response;
    } catch (error) {
        return error
    }
}

const deleteProjectService = async (data)=>{
    try {
        const response = await axios.delete(`${urls?.url}api/projects/${data.project_id}/delete/`)
        return response;
    } catch (error) {
        return error
    }
}

export const projectServices = {
    createProjectService,
    getProjectsService,
    updateProjectService,
    deleteProjectService
}