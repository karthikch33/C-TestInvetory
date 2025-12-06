import { useEffect, useState } from 'react';  
import { Input, Table, Button, message, Modal, Space, Spin } from 'antd';  
import { useSelector, useDispatch } from 'react-redux';  
import { useFormik } from "formik";   
import * as yup from "yup"; 
import { createProjectSlice, deleteProjectsSlice, updateProjectsSlice } from '../../features/Project/projectSlice';  
import { ToastContainer } from 'react-toastify';
import CustomInput from '../CustomInput';
import { FaFolderOpen } from "react-icons/fa";
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
    const [spinning, setSpinning] = useState(false);
    const [tip,setTip] = useState('');
    const [partialProjectData,setPartialProjectData] = useState();
    
    const dispatch = useDispatch();  
    
    const { projects } = useSelector(state => state?.project);

    useEffect(() => { 
        setPartialProjectData(projects)  
        setProjectData(projects)
    }, [projects]); 

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

    const rowSelection = {
        type: "radio",
        selectedRowKeys: selectedKey ? [selectedKey] : [],
        onChange: (keys, rows) => {
          setSelectedKey(keys[0]);
          setSelectedRecord(rows[0]);
        },
      };

    const columns = [ 
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

    const handleCreate = async (values) => {
        setSpinning(true);
        setTip(`Creating project: ${values?.project_name_create}...`);
    
        const payload = {
            project_name: values?.project_name_create,
            project_description: values?.project_description_create,
        };
    
        try {
            const response = await dispatch(createProjectSlice(payload)).unwrap();
            const createdName = response?.data?.project_name;
    
            message.success(`Project ${createdName} created successfully`);
            hideCreateModal();
    
        } catch (error) {
            if (error?.status === 409) {
                message.info("Project already exists");
            } else {
                message.error(error?.message || "Project creation failed");
            }
        } finally {
            setTimeout(() => {
                setSpinning(false);
                setTip('');
            }, 3000);
        }
    };
    
    const handleEdit = async (values) => {
        if (!selectedRecord) {
            messageApi.info("Please select a project");
            return;
        }
    
        setSpinning(true);
        setTip(`Updating ${selectedRecord?.project_name} details...`);
    
        const payload = {
            ...values,
            project_id: selectedRecord.project_id,
        };
    
        try {
            const response = await dispatch(updateProjectsSlice(payload)).unwrap();
            const updatedName = response?.data?.updated_project?.project_name;
    
            setOpenEditModal(false);
            setSelectedRecord(null);
            setSelectedKey(null);
    
            message.success(`Project ${updatedName} updated successfully`);
    
        } catch (error) {
            if (error?.status === 302 || error?.status === 409) {
                message.info("Project name already exists");
            } else {
                message.error(error?.message || "Project update failed");
            }
        } finally {
            setTimeout(() => {
                setTip('');
                setSpinning(false);
            }, 3000);
        }
    };
    
    const handleDelete = async () => {
        if (!selectedRecord) return;
    
        setSpinning(true);
        setTip(`Deleting project: ${selectedRecord?.project_name}...`);
    
        const payload = {
            project_id: selectedRecord.project_id,
        };
    
        try {
            const response = await dispatch(deleteProjectsSlice(payload)).unwrap();
            const deletedName = response?.data?.deleted_project;
    
            message.success(`${deletedName} deleted successfully`);
    
        } catch (error) {
            message.error(error?.message || "Deletion failed");
        } finally {
            setTimeout(() => {
                setSpinning(false);
                setTip('');
            }, 3000);
    
            hideDeleteModal();
            setSelectedRecord(null);
        }
    };
    
      
    return (
        <Spin spinning={spinning} tip={tip}>
        <div className='w-100 p-4'>  
        <Meta title="Projects"/>

        <ToastContainer
        position='top-center' autoClose={2500} hideProgressBar={false} closeOnClick newestOnTop={true} rtl={false} pauseOnFocusLoss
        draggable  pauseOnHover theme='light'/> 
        {contextHolder}    


        <div className="container-fluid">
        <div
        style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            width: "100%",
            color: "var(--text)",
        }}
        >
        {/* LEFT SIDE — PAGE TITLE */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
            style={{
            width: 42,
            height: 42,
            background: "var(--card-bg)",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid var(--border)"
            }}
        >
            <FaFolderOpen size={20} color="#0ea5e9" />
        </div>

        <div>
            <h2 style={{ margin: 0, fontWeight: 600, fontSize: 22, color: "var(--text)" }}>
            Projects
            </h2>
            <p style={{ margin: 0, color: "#666", fontSize: 13,color: "var(--text-soft)" }}>
            Manage all your test inventory projects
            </p>
        </div>
        </div>


        {/* RIGHT SIDE — ACTION BUTTONS + SEARCH */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Button type="primary" onClick={showCreateModal}>Create</Button>
            <Button onClick={showEditModal}>Edit</Button>
            <Button danger onClick={showDeleteModal}>Delete</Button>

            <Search
            placeholder="Search projects"
            onSearch={handleSearch}
            onChange={handleSearchChange}
            allowClear
            style={{ width: 260,background: "var(--card-bg)",
    color: "var(--text)", }}
            />
        </div>
        </div>

            <Table
            className="Manage_Project"
            columns={columns}
            rowKey="project_id"
            rowSelection={rowSelection}
            dataSource={projectData}
            pagination={{ pageSize: 16 }}
            style={{
                overflowX: "auto",
                // background: "var(--card-bg)",
                color: "var(--text)",
            }}
        />

         
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
                            style={{
                            background: "var(--card-bg)",
                            color: "var(--text)",
                            borderColor: "var(--border)",
                        }}
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
                            style={{
                            background: "var(--card-bg)",
                            color: "var(--text)",
                            borderColor: "var(--border)",
                        }}
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
        </Spin>
    );  
};  

export default ManageProjects;