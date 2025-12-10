import React, { useEffect, useMemo, useState } from 'react';  
import { Input, Table, Button, Radio, message} from 'antd';  
import { useDispatch, useSelector } from 'react-redux';
import { deleteFileSlice, getFileSlice } from '../../../features/Connections/fileSlice';
import { CustomSelectManageProjects } from '../../CustomSelect';
import  { CustomCreateFormFileModal, CustomDeleteModal } from '../../CustomModal';
import Meta from '../../../utils/Meta';
const FlatFile = () => {  

    const {Search} = Input
 
    const [messageApi, contextHolder] = message.useMessage();
    const [selectedKey, setSelectedKey] = useState(null);
    const [alertActive,setAlertActive] = useState(true);
    const [filesData,setFilesData] = useState([]);
    const [selectProjectId,setSelectedProjectId] = useState(0);
    const [selectedRecord,setSelectedRecord] = useState(null);  
    const [openDeleteModal, setOpenDeleteModal] = useState(false);  
    const [openCreateModal, setOpenCreateModal] = useState(false);   

    const { projects } = useSelector(state => state.project);

    const allProjects = useMemo(()=> projects ,[projects])
    
    const dispatch = useDispatch()


    useEffect(()=>{
        dispatch(getFileSlice())
    },[])

    const { files }  = useSelector(state => state.file)    
    
    const filterData = useMemo(()=>{
        if(!files) return []

        if(selectProjectId === 0){
            return files
        }

        const project_id = Number(selectProjectId);
        return files?.filter((file)=> file?.project_id === project_id)
        
    },[files,selectProjectId])

    useEffect(() => {        
       setFilesData(filterData)
     }, [filterData]);

     const handleProjectSelect = (e)=>{
        setSelectedProjectId(Number(e));
        setSelectedKey(null);
        setSelectedRecord(null);
    }

 
    const columns = [   
        {  
            title: 'File Name',  
            dataIndex: 'file_name',  
            key: 'file_name',  
        }
    ];

    const loadFiles = (response)=>{
        const updatedColumnsData = []
        const loadedFiles = response?.payload?.data?.data;

        loadedFiles?.forEach((field,i)=>{
            updatedColumnsData?.push({
                file_id : field?.file_id, 
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

        // setfiles(updatedColumnsData);
        setFilesData(filteredProjects);
    }

    const handleSearch = (e)=>{
        let filteredData = []
        if(selectProjectId)
        {
            filteredData = files?.filter(item => (
            item?.project_id === selectProjectId && (
                item?.file_name?.toLowerCase()?.includes(e?.toLowerCase()) || item?.file_type?.toLowerCase()?.includes(e?.toLowerCase()) ||
                item?.table_name?.toLowerCase()?.includes(e?.toLowerCase()) ||item?.sheet?.toLowerCase()?.includes(e?.toLowerCase()) )
            ))
        }
        else{
            filteredData = files?.filter(item => (
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
            if(project_id) filteredProjects = files?.filter(item => item?.project_id === project_id);
            else filteredProjects = files
            setFilesData(filteredProjects);
        }
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

    const rowSelection = {
        type : 'radio',
        selectedRowKeys : selectedKey ? [selectedKey] : [],
        onChange : (keys, rows)=>{
            setSelectedKey(keys[0]);
            setSelectedRecord(rows[0]);
        },
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
            <Search  
            placeholder="Search by File Name, File Type, Table Name, or Sheet"  
            onSearch={(e) => handleSearch(e)}  
            enterButton  
            onChange={(e) => handleSearchChange(e)}  
            style={{ minWidth: "300px", maxWidth: "300px", marginRight: "10px", marginBottom: "1px", maxHeight: "32px" }} />
            </div>                    
            </div>

            <Table
             className='flatFile'
             rowKey={"file_id"}
             rowSelection={rowSelection}
             columns={columns} 
             dataSource={filesData} 
             pagination={{ pageSize: 10}} 
             style={{overflowX:"auto",marginTop:"10px"}}
             />  

            <CustomCreateFormFileModal openCreateModal={openCreateModal} hideCreateModal={hideCreateModal} loadFiles={loadFiles}/>
 
            <CustomDeleteModal
            title={<>Delete { selectedRecord?.file_name !== undefined ?  <span style={{ color: "red",display:"inline" }}>"
            {` `} {selectedRecord?.file_name}{` `} "</span>:''} {` `}Connection</>} hideModal={hideDeleteModal} open={openDeleteModal}
            performAction = {handleDelete} onCancel={hideDeleteModal} okText="OK" cancelText="CANCEL"/>
            
        </div>  
      </>
    );  
}  
 
export default FlatFile