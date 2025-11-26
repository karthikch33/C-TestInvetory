import React, { useEffect, useState } from 'react';  
import { Input, Table, Button, message, Radio, Modal, Space, Select } from 'antd';  
import { useSelector, useDispatch } from 'react-redux';  
import { useFormik } from "formik";   
import * as yup from "yup";  
import { createProjectSlice, deleteProjectsSlice, getProjectsSlice, updateProjectsSlice } from '../../features/Project/projectSlice';  
import { toast, ToastContainer } from 'react-toastify';
import CustomInput from '../CustomInput';
import Meta from '../../utils/Meta';

const ManageProjects = () => {  
    const {Search} = Input
    
    const [openCreateModal, setOpenCreateModal] = useState(false);  
    const [openEditModal, setOpenEditModal] = useState(false);  
    const [openDeleteModal, setOpenDeleteModal] = useState(false);  
    const [CreateEdit,setCreateEdit] = useState(null);
    const [selectedKey, setSelectedKey] = useState(null);  
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [alertActive,setAlertActive] = useState(true);  
    const [projectData,setProjectData] = useState();
    const [messageApi, contextHolder] = message.useMessage();
    const [partialProjectData,setPartialProjectData] = useState();
    
    const dispatch = useDispatch();  
    
    const projects = useSelector(state => state?.project?.projects);

    useEffect(() => { 
        getValidFields(projects)
    }, [projects]); 

    const getValidFields = (data)=>{
        const partialDetails = []  
        Array.isArray(data) && data?.forEach((field,index)=>{
            partialDetails.push({
              key : index,
              project_id : field?.project_id,
              project_name : field?.project_name,
              description : field?.project_description,
              created_at : formatDateString(field?.created_time),
             created_by : 'aditya'
            })
          })
        setPartialProjectData(partialDetails)  
        setProjectData(partialDetails)
    }

    const createSchema = yup.object().shape({
        project_name_create: yup
            .string()
            .required("Project Name is required")
            .matches(
                /^[a-zA-Z_][a-zA-Z0-9_]*$/,
                "Project name must start with a letter or underscore & can only contain letters, numbers, and underscores."
            )
            .trim()
            .notOneOf(['_', ''], "Project name cannot be just an underscore or empty.")
            .test(
                "no-start-end-underscore",
                "Underscore cannot be at the start or end of project name.",
                (value) => value && !(value.startsWith('_') || value.endsWith('_'))
            )
            .test(
                "no-spaces",
                "Spaces are not allowed in project name.",
                (value) => value && !/\s/.test(value)
            ),
        project_description_create: yup
            .string()
            .required("Description is required"),
    });
    
    const editSchema = yup.object().shape({
        project_name: yup
            .string()
            .required("Project Name is required")
            .matches(
                /^[a-zA-Z_][a-zA-Z0-9_]*$/,
                "Project name must start with a letter or underscore & can only contain letters, numbers, and underscores."
            )
            .trim()
            .notOneOf(['_', ''], "Project name cannot be just an underscore or empty.")
            .test(
                "no-start-end-underscore",
                "Underscore cannot be at the start or end of project name.",
                (value) => value && !(value.startsWith('_') || value.endsWith('_'))
            )
            .test(
                "no-spaces",
                "Spaces are not allowed in project name.",
                (value) => value && !/\s/.test(value)
            ),
        project_description: yup
            .string()
            .required("Description is required"),
    });

    const formik = useFormik({  
        initialValues: {  
            project_name: "",  
            project_description: "",  
            project_name_create: "",  
            project_description_create: ""
        },  
        validationSchema: CreateEdit === 'create' ? createSchema : editSchema,  
        onSubmit: (values) => {  
            if(CreateEdit === 'create') handleCreate(values);
            else if(CreateEdit === 'edit') handleEdit(values);  
            else return;
        },  
        enableReinitialize: true,
    }); 

    const columns = [  
        {  
            title: 'Select',  
            dataIndex: 'selecteditem',  
            render: (text, record) => (  
                <div style={{ display: 'flex', justifyContent: 'center' }}>  
                    <Radio  
                        checked={selectedKey === record.project_id}  
                        onChange={() => handleRadioChange(record)}  
                    />  
                </div>  
            )  
        },  
        {  
            title: 'Project Name',  
            dataIndex: 'project_name',  
            key: 'project_name',  
        },  
        {  
            title: 'Description',  
            dataIndex: 'description',  
            key: 'description',  
        },
        {
            title : 'Created At',
            dataIndex : 'created_at',
            key : 'created_at'
        },
        {
            title : 'Created By',
            dataIndex : 'created_by',
            key : 'created_by'
        }
    ];
    
    const handleSearch = (e)=>{
        const filteredData = partialProjectData?.filter(item =>(
            item.project_name?.toLowerCase().includes(e?.toLowerCase()) ||  
            item.description?.toLowerCase().includes(e?.toLowerCase()) ||
            item.created_by?.toLowerCase().includes(e?.toLowerCase())
            ));  
        setProjectData(filteredData);
    }

    const handleSearchChange = (e)=>{
        if(!e?.target?.value){
            setProjectData(partialProjectData);
        }
    }

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

    const handleRadioChange = (record) => {  
        setSelectedKey(record.project_id);  
        setSelectedRecord(record);  
    };  

    const showEditModal = () => { 
        if(selectedRecord === null)
            {
                if(alertActive){
                messageApi.info('Please Select a Project')
                setAlertActive(false);
                setTimeout(()=>setAlertActive(true),3000);
                }
            }
        else{
            formik.setValues({  
                project_name: selectedRecord.project_name,  
                project_description: selectedRecord.description,  
            });  
            setCreateEdit('edit');
            setOpenEditModal(true);  
        }
    };  

    const hideEditModal = () => {  
      setOpenEditModal(false); 
      setCreateEdit(null); 
    }; 

    const showDeleteModal = ()=>{
        if(selectedRecord === null)
            {
                if(alertActive){
                messageApi.info('Please Select a Project')
                setAlertActive(false);
                setTimeout(()=>setAlertActive(true),3000);
                }
            }
      else{
      setOpenDeleteModal(true);
      }
    }

    const hideDeleteModal = () => {  
      setOpenDeleteModal(false); 
    }; 
  
    const showCreateModal = ()=>{
    setCreateEdit('create');
    setOpenCreateModal(true);
    }

    const hideCreateModal = ()=>{
    setOpenCreateModal(false);
    setCreateEdit(null);
    formik.resetForm();
    }

    const handleCreate = (values) => {
        const requiredFields = {
            project_name : values?.project_name_create,
            project_description : values?.project_description_create,
        }
         dispatch(createProjectSlice(requiredFields))
            .then((response)=>{
                if(response?.payload?.status === 200){
                    toast.success(`Project ${response?.payload?.data?.project_name} Created Successfully`);
                    hideCreateModal();
                }
                else if(response?.payload?.status === 302){
                    toast.info(`Project Already Exists`)
                }
                else{
                    toast.error(`Project Creation Failed`);
                }
            }
        )
        .finally(()=>{
            try {
                dispatch(getProjectsSlice())
                .then((response)=>{
                    console.log(response)
                    if(response?.payload?.status === 200)
                    getValidFields(response?.payload?.data)
                })
            } catch (error) {
                toast.error('Project Fectch Failed');
            }
        })
    }

    const handleEdit = (values) => {  
    if (!selectedRecord) {  
        messageApi.info('Please Select a Project');  
        return;  
    }  
        const data = { ...values, project_id: selectedRecord.project_id };
        dispatch(updateProjectsSlice(data))
        .then((response)=>{
            console.log(response);
            if(response?.payload?.status === 200){
                toast.success(`Project ${response?.payload?.data?.project_name} Updated Successfully`);
                setSelectedRecord(null);
                setSelectedKey(null);
                setOpenEditModal(false); 
            }
            else if(response?.payload?.status === 302){
                toast.info(`Project Name already exists`);
            }
            else{
                toast.error('Internal Server Error')
            }
        })
        .finally(()=>{
            try {
                dispatch(getProjectsSlice())
                .then((response)=>{
                    if(response?.payload?.status === 200)
                    getValidFields(response?.payload?.data)
                })  
            } catch (error) {
                    toast.error('Project Fectch Failed');                
            }
        })
    }; 

    const handleDelete = () => {  
        if(selectedRecord) {  
            const data = {project_id : selectedRecord.project_id};
            dispatch(deleteProjectsSlice(data))
            .then((response)=>{
                console.log(response)
                if(response?.payload?.status === 200){
                    toast.success(`${response?.payload?.data?.project_name} is deleted`);
                }  
                else{
                    toast.error('Deletion Failed');
                }
            })
            .catch(()=>{
                toast.error('Server Error')
            })
            .finally(()=>{
                try {
                    dispatch(getProjectsSlice())
                    .then((response)=>{
                        if(response?.payload?.status === 200)
                        getValidFields(response?.payload?.data)
                    })
                } catch (error) {
                    toast.error('Project Fectch Failed');
                }
            hideDeleteModal();  
            setSelectedRecord(null);
            })
        }
    }; 


    return (  
        <div className='w-100 p-4'>  
        <Meta title="Projects"/>
        <ToastContainer
        position='top-center' autoClose={2500} hideProgressBar={false} closeOnClick newestOnTop={true} rtl={false} pauseOnFocusLoss
        draggable  pauseOnHover theme='light'/> 
        {contextHolder}    

        <div className="container-fluid">
        <div className='d-flex justify-content-between align-items-center mb-2' style={{overflowX:"auto"}}>
        <div>
        <label style={{ color: "skyblue", fontSize: "20px",marginRight:"20px",marginLeft:"20px" }}>Projects</label>  
        </div>
        <div className="d-flex mx-4 gap-3">  
        <Button className='primary' style={{fontSize:'14px'}} onClick={showCreateModal}> Create  </Button>  
        <Button onClick={showEditModal} className='primary' style={{fontSize: '14px'}}>  Edit  </Button>  
        <Button onClick={showDeleteModal} className='type-primary' style={{ fontSize: '14px' }}> Delete  </Button>  
        <Search  
        placeholder="Search by Project Name, Created By or Description" onSearch={(e) => handleSearch(e)} enterButton onChange={(e) => handleSearchChange(e)}
        style={{ minWidth: "300px", maxWidth: "300px", marginRight: "10px", marginBottom: "1px", maxHeight: "32px" }} 
        />    
        </div>  
        </div>
        <Table className='Manage_Project' columns={columns}  dataSource={projectData} pagination={{ pageSize: 13 }} style={{overflowX:"auto"}}/> 
         
        <Modal  
            title="Create Project"  
            onCancel={hideCreateModal}  
            open={openCreateModal}  
            footer={null}  
        >  
            <form onSubmit={formik?.handleSubmit} className="max-w-[300px] mx-auto">  

            <CustomInput label='Project Name' name='project_name_create' value={formik?.values?.project_name_create}
            handleChange={formik?.handleChange} disabled = {false}  type="text"
            touched={formik?.touched?.project_name_create} error={formik?.errors?.project_name_create} blur={formik?.handleBlur}/>

            <CustomInput label='Description' name='project_description_create' value={formik?.values?.project_description_create}
            handleChange={formik?.handleChange} disabled = {false}  type="text"
            touched={formik?.touched?.project_description_create} error={formik?.errors?.project_description_create} blur={formik?.handleBlur}/>

            <div className='row'>
                <label className='col-4'></label>
                <div className='col-8'>
                <div className="error" style={{overflowX:"auto"}}>
                    {formik?.touched?.project_type && formik?.errors?.project_type}
                </div>  
                </div>
            </div>              

                <Space className='mt-3'>  
                    <Button type="primary" htmlType="submit">  
                        Create  
                    </Button>  
                    <Button onClick={hideCreateModal} className='danger'>Cancel</Button>  
                </Space>                  

            </form>  
        </Modal>  
         {/* Edit */}
        <Modal  
            title="Edit Project"  
            onCancel={hideEditModal}  
            open={openEditModal}  
            footer={null}  
        >  
            <form onSubmit={formik?.handleSubmit} className="max-w-[300px] mx-auto">  

                <div className="row mt-3 d-flex align-items-center">  
                    <label htmlFor="project_name" className='col-4'>Project Name</label>   
                    <div className='col-8'>  
                        <Input  
                            type="text"   
                            name="project_name"  
                            value={formik?.values?.project_name}  
                            onChange={formik?.handleChange}  
                            onBlur={formik?.handleBlur}  
                        />  
                        <div className="error">  
                            {formik?.touched?.project_name && formik?.errors?.project_name}  
                        </div>  
                    </div>  
                </div>

                <div className="row mt-3 d-flex align-items-center">  
                    <label htmlFor="project_description" className='col-4'>Description</label>   
                    <div className='col-8'>  
                        <Input  
                            type="text"   
                            name="project_description"  
                            value={formik?.values?.project_description}   
                            onChange={formik?.handleChange}   
                            onBlur={formik?.handleBlur}  
                        />  
                        <div className="error">  
                            {formik?.touched.project_description && formik?.errors?.project_description}  
                        </div>  
                    </div>  
                </div>  

                <Space className='mt-3'>  
                    <Button type="primary" htmlType="submit">  
                        Submit  
                    </Button>  
                    <Button onClick={hideEditModal}>Cancel</Button>  
                </Space>  
            </form>   
        </Modal>  
         {/* Delete */}
        <Modal  
            title={<>Delete  { selectedRecord?.project_name !== undefined ?  <span style={{ color: "red",display:"inline" }}>"{` `} {selectedRecord?.project_name}{` `} "</span>:''} {` `}Project</>} 
            open={openDeleteModal}  
            onOk={handleDelete}  
            onCancel={hideDeleteModal}  
            okText="Yes, Delete"  
            cancelText="Cancel"  
        >  
        </Modal>  

        </div>  
        </div>  
    );  
};  

export default ManageProjects;