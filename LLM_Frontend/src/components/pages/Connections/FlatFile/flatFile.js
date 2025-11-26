import React, { useEffect, useState } from 'react';  
import { Input, Table, Button, Radio, message} from 'antd';  
import { Link } from 'react-router-dom'; 
import {useFormik} from 'formik'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux';
import { deleteFileSlice, getFileSlice, renameFileSlice } from '../../../features/Connections/fileSlice';
import { CustomSelectManageProjects } from '../../CustomSelect';
import  { CustomCreateFormFileModal, CustomDeleteModal, CustomRenameModal } from '../../CustomModal';
import Meta from '../../../utils/Meta';
const FlatFile = () => {  

    const {Search} = Input
 
    const [allProjects, setAllProjects] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [selectedKey, setSelectedKey] = useState(null);
    const [alertActive,setAlertActive] = useState(true);
    const [filesData,setFilesData] = useState([]);
    const [partialFilesData,setPartialFilesData] = useState([]);
    const [selectProjectId,setSelectedProjectId] = useState(0);
    const [selectedRecord,setSelectedRecord] = useState(null);  
    const [openDeleteModal, setOpenDeleteModal] = useState(false);  
    const [openRenameModal, setOpenRenameModal] = useState(false);  
    const [openCreateModal, setOpenCreateModal] = useState(false);   

    const {projects} = useSelector(state => state.project);

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getFileSlice())
        .then((response)=>{
            if(response?.payload?.status === 200)  loadFiles(response);
            else message?.error('Failed To Load Files')
        })
     }, []);

     useEffect(()=>{
        setAllProjects(projects);
    },[projects])         
 
    const schema = yup.object({
        file_name : yup  
                .string()  
                .required("File Name is required")  
                .matches(  
                    /^[a-zA-Z_.-]+$/,  
                    'File name can only contain letters, underscores, periods, and hyphens.'  
                )  
                .trim()  
                .notOneOf(['.', '', '_', '-'], 'File name cannot be just a dot, underscore, or hyphen.')  
                .test('no-start-end-dot', 'File name cannot start or end with a dot.', (value) => {  
                    return value && !(value.startsWith('.') || value.endsWith('.'));  
                })  
                .test('no-start-end-hyphen', 'File name cannot start or end with a hyphen.', (value) => {  
                    return value && !(value.startsWith('-') || value.endsWith('-'));  
                })  
                .test('no-start-end-underscore', 'File name cannot start or end with an underscore.', (value) => {  
                    return value && !(value.startsWith('_') || value.endsWith('_'));  
                })  
                .test('no-spaces', 'Spaces are not allowed in file name.', (value) => {  
                    return value && !/\s/.test(value);  
                }),
    })
   
    const formik = useFormik({
      initialValues:{
          file_name:""
      },
      validationSchema:schema,
      onSubmit : ()=>{
        handleRename();
        formik.resetForm();
      }
  })
 
    const columns = [  
        {  
            title: 'Select',  
            dataIndex: 'selecteditem',  
            render: (text, record) =>   {
                return (<div style={{display:'flex',justifyContent:'center'}}>
                <Radio  
                    checked={selectedKey === record?.file_id}  
                    onChange={() => handleRadioChange(record)}  
                />  
                </div>)
            }
        },  
        {  
            title: 'File Name',  
            dataIndex: 'file_name',  
            key: 'file_name',  
        }
    ];

    const loadFiles = (response)=>{
        const updatedColumnsData = []
        const loadedFiles = response?.payload?.data;
        console.log(loadedFiles);

        loadedFiles?.forEach((field,i)=>{
            updatedColumnsData?.push({
                file_id : field?.file_id, // ask id from backend
                file_type : field?.file_type,
                file_name : field?.file_name,
                sheet_name : field?.sheet_name,
                project_id : field?.project_id
            })
        })
        
        let filteredProjects
        if(selectProjectId)
        {
            const project_id = Number(selectProjectId);
            filteredProjects = updatedColumnsData?.filter(item => item?.project_id === project_id);
        }
        else filteredProjects = updatedColumnsData

        setPartialFilesData(updatedColumnsData);
        setFilesData(filteredProjects);
    }

    const handleSearch = (e)=>{
        let filteredData = []
        if(selectProjectId)
        {
            filteredData = partialFilesData?.filter(item => (
            item?.project_id === selectProjectId && (
                item?.file_name?.toLowerCase()?.includes(e?.toLowerCase()) || item?.file_type?.toLowerCase()?.includes(e?.toLowerCase()) ||
                item?.table_name?.toLowerCase()?.includes(e?.toLowerCase()) ||item?.sheet?.toLowerCase()?.includes(e?.toLowerCase()) )
            ))
        }
        else{
            filteredData = partialFilesData?.filter(item => (
                item?.file_name?.toLowerCase()?.includes(e?.toLowerCase()) || item?.file_type?.toLowerCase()?.includes(e?.toLowerCase()) ||
                item?.table_name?.toLowerCase()?.includes(e?.toLowerCase()) ||item?.sheet?.toLowerCase()?.includes(e?.toLowerCase()) )
            )
        }
        setFilesData(filteredData);
    }

    const handleSearchChange = (e)=>{
        if(!e?.target?.value){
            let filteredProjects = []
            const project_id = Number(selectProjectId);
            if(project_id) filteredProjects = partialFilesData?.filter(item => item?.project_id === project_id);
            else filteredProjects = partialFilesData
            setFilesData(filteredProjects);
        }
    }

    const handleRadioChange = (record) => {  
        setSelectedKey(record?.file_id);
        setSelectedRecord(record);
    }; 

    const handleProjectSelect = (e)=>{
        setSelectedProjectId(Number(e));
        if(e)
        {
            const project_id = Number(e);
            const filteredProjects = partialFilesData?.filter(item => item?.project_id === project_id);
            setFilesData(filteredProjects);
        }
        else setFilesData(partialFilesData);
        setSelectedKey(null)
        setSelectedRecord(null);
    }

    const handleFileCreate = () => {
        setOpenCreateModal(true);
    }

    const hideCreateModal = () => {
        setOpenCreateModal(false);
      }

    const handleFileDelete = ()=>{
        if(selectedRecord === null){
            if(alertActive){
                messageApi.info('Please Select a file')
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
   
    // const handleFileRename = () => {  
    //     if(selectedRecord === null){
    //         if(alertActive){
    //             messageApi.info('Please Select a File')
    //             setAlertActive(false);
    //             setTimeout(()=>setAlertActive(true),3000);
    //         }
    //     }
    //     else{
    //     formik?.setFieldValue('file_name',selectedRecord?.file_name);
    //     setOpenRenameModal(true);
    //     }
    // };  

    const hideRenameModal = () => {  
        setOpenRenameModal(false);  
        formik.resetForm();
    }; 
    
    
    const handleDelete = ()=>{
        dispatch(deleteFileSlice(selectedRecord))
        .then((response)=>{
            console.log(response);
            if(response?.payload?.status === 200){
                messageApi?.success(`${response?.payload?.data} has been deleted`)
            }
            else{
                messageApi?.error(`${response?.payload?.data} deletion failed`)
            }
        })
        .finally(()=>{
            setSelectedKey(null)
            setSelectedRecord(null);

            dispatch(getFileSlice())
            .then((response)=>{
                if(response?.payload?.status === 200) loadFiles(response);
                else message?.error('Fetching Files Failed')
            })
            hideDeleteModal();
         })

    }
 
    const handleRename = ()=>{
        const rename_data = {
            re_val : formik?.values?.file_name,
            ...selectedRecord
        }
        dispatch(renameFileSlice(rename_data))
        .then((response)=>{
            if(response?.payload?.status === 200){
                messageApi?.success(`${response?.payload?.data} is renamed`)
            }
            else{
                messageApi.error(`${formik?.values?.file_name} failed to rename`)
            }
        })
        .finally(()=>{
            setSelectedKey(null);
            setSelectedRecord(null);

            dispatch(getFileSlice())
            .then((response)=>{
            if(response?.payload?.status === 200)  loadFiles(response);
            else message?.error('Fetching Files Failed')
            })

            hideRenameModal();
        })
    }  
 
    return (  
      <>
      <Meta title="Manage Files"/>
        <div className="w-100 p-4">  
            {contextHolder}    
            <div className="d-flex justify-content-between align-items-center mb-2" style={{ overflowX: "auto"}}>
            <div className='d-flex'>  
            <label style={{color: "skyblue",fontSize: "20px",marginLeft:"20px",marginRight: "20px",whiteSpace: "nowrap"}}> Files </label>   
            <CustomSelectManageProjects value={selectProjectId} handleChange={handleProjectSelect} projects={allProjects}/>
            </div>  
            <div className='d-flex mx-4 gap-3'>
            <Button onClick={handleFileCreate} style={{ fontSize: '14px', marginRight:"10px" }}> Create </Button>   
            <Button onClick={handleFileDelete} style={{ fontSize: '14px', marginRight:"10px" }}>  Delete  </Button>  
            {/* <Button onClick={handleFileRename} style={{ fontSize: '14px', marginRight:"10px" }}>  Rename  </Button>   */}
            <Search  
            placeholder="Search by File Name, File Type, Table Name, or Sheet"  
            onSearch={(e) => handleSearch(e)}  
            enterButton  
            onChange={(e) => handleSearchChange(e)}  
            style={{ minWidth: "300px", maxWidth: "300px", marginRight: "10px", marginBottom: "1px", maxHeight: "32px" }} />
            </div>                    
            </div>
            <Table className='flatFile' columns={columns} dataSource={filesData} pagination={{ pageSize: 10}} style={{overflowX:"auto",marginTop:"10px"}}/>  
            <CustomCreateFormFileModal openCreateModal={openCreateModal} hideCreateModal={hideCreateModal} loadFiles={loadFiles}/>
 
            <CustomDeleteModal
            title={<>Delete { selectedRecord?.file_name !== undefined ?  <span style={{ color: "red",display:"inline" }}>"
            {` `} {selectedRecord?.file_name}{` `} "</span>:''} {` `}Connection</>} hideModal={hideDeleteModal} open={openDeleteModal}
            performAction = {handleDelete} onCancel={hideDeleteModal} okText="OK" cancelText="CANCEL"/>
            
            <CustomRenameModal  title={<>Rename { selectedRecord?.file_name !== undefined ?  <span style={{ color: "red",display:"inline" }}>
            "{` `} {selectedRecord?.file_name}{` `} "</span>:''} {` `}Connection</>} open={openRenameModal} onSubmit={formik?.handleSubmit}
            hideModal={hideRenameModal} value={formik?.values?.file_name} name={"file_name"} handleChange={formik?.handleChange}
            blur={formik?.handleBlur} touched={formik?.touched?.file_name} error={formik?.errors?.file_name}/>
        </div>  
      </>
    );  
}  
 
export default FlatFile