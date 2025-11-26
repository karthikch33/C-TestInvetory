import { Button, Input, message, Modal, Radio, Table } from 'antd';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import CryptoJs from 'crypto-js'
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import * as yup from 'yup'

import { deleteBussinessRulesSlice, getBussinessRulesSlice, getDataSegmentsSlice } from '../../features/BussinessRules/BussinessRulesSlice';
import { CustomSelectManageProjects } from '../CustomSelect';
import Meta from '../../utils/Meta';
import ViewBussinessRule from './ViewBussinessRule';
import SelectionRules from './SelectionRules';
import SelectionViewBussinessRule from './SelectionViewBussinessRule';

const ManageBussinessRules = () => {
    const {Search} = Input;

     const [selectProjectId,setSelectProjectId] = useState(0);
     const [openDeleteModal, setOpenDeleteModal] = useState(false);  
     const [openSelectionModal,setOpenSelectionModal] = useState(false);
     const [alertActive,setAlertActive] = useState(true);
     const [selectedKey, setSelectedKey] = useState(null); 
     const [messageApi, contextHolder] = message.useMessage();
     const [selectedRecord,setSelectedRecord] = useState(null); 
     const [allProjects, setAllProjects] = useState([]);
     const [partialBussinessRules,setPartialBusinessRules] = useState([]);
     const [bussinessRules,setBussinessRules] = useState([]);
     const [selectionContext, setSelectionContext] = useState({project_id : null, object_id : null})

     const navigate = useNavigate();
     const dispatch = useDispatch();

     const projects = useSelector(state => state?.project?.projects);

     useEffect(()=>{
        const filteredProjects = projects?.filter(item => item?.project_type === 'DMC')
        setAllProjects(filteredProjects);
    },[projects])

     useEffect(()=>{
        loadBussinessRules();
    },[])


    const loadBussinessRules = ()=>{
        const data = {
            obj_id : 0,
            project_type : 'DMC'
        }
        dispatch(getBussinessRulesSlice(data))
        .then((response)=>{
            if(response?.payload?.status === 200)
            {
                const bussiness_rules = response?.payload?.data;
                let filteredData = []

                if(selectProjectId !== 0) filteredData = bussiness_rules?.filter(item => item?.project_id === selectProjectId);
                else filteredData = bussiness_rules;

                setPartialBusinessRules(bussiness_rules);
                setBussinessRules(filteredData)
            }
            else if(response?.payload?.status === 500){
                if(alertActive){
                    messageApi?.error('Internal Server Error')
                    setAlertActive(false);
                    setTimeout(()=>setAlertActive(true),3000);
                }
            }
            else if(response?.payload?.status === 404){
                setPartialBusinessRules([]);
                setBussinessRules([])
            }
        })
    }

      const schema = yup.object({
             connection_name : yup.string().required("Connection Name Required")
      })

     const formik = useFormik({
             initialValues:{
                 connection_name:"",
                 project_id_select:""
             },
             validationSchema:schema,
             onSubmit:(values)=>{
                 console.log(values);
             }
     })

     const handleRadioChange = (record) => {  
            setSelectedKey(record?.obj_id); 
            setSelectedRecord(record);
    };  

    const encryptValue = (value) => {
        try {
            const encrypted = CryptoJs.AES.encrypt(value?.toString(),process.env.REACT_APP_PrivateKey)?.toString();
            const encryptedHex = CryptoJs.enc.Hex.stringify(CryptoJs.enc.Base64.parse(encrypted));
            return encryptedHex;
        } 
        catch (error) {
          console.error("Encryption error:", error);
          return value;
        }
      };


    const navigateViewBussinessRule = (record)=>{
        const project_id = record?.project_id;
        const object_id = record?.obj_id;
        const project_name = record?.project_name
        const object_name = record?.obj_name
        navigate(`/bussinessrules/views?projectId=${project_id}&projectName=${project_name}&objectId=${object_id}&objectName=${object_name}`)
    }

    const navigateSelectionCriteria = (record)=>{
        setSelectionContext({
            project_id : record?.project_id,
            object_id : record?.obj_id
        })
        handleSelectionModal()
    }

    const columns = [   
        {  
            title: 'Select',  
            dataIndex: 'selecteditem',  
            render: (text, record) => (  
                <div style={{display:'flex',justifyContent:'center'}}>
                <Radio  
                    checked={selectedKey === record.obj_id}  
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
            title: 'Data Object',  
            dataIndex: 'obj_name',  
            key: 'obj_name',  
            render: (text, record) => 
                (
                <>
                <button className="link-button" onClick={()=> navigateViewBussinessRule(record)}  
                style={{width:"100%",background:'none',border:"none",padding:"0",textDecoration:"underline",textAlign:"start"}}>{record.obj_name}</button>
                </>               
            )
        },  
        {  
            title: 'Project Type',  
            dataIndex: 'project_type',  
            key: 'project_type',  
        },  
        {  
            title: 'Data Mapping Sheet',  
            dataIndex: 'template_name',  
            key: 'template_name',  
        },
        {
            title : 'Selection Manage',
            dataIndex :'selection_manage',
            key : 'selection_manage',
            render : (text,record)=>(
                <button className='link-button' onClick={()=>navigateSelectionCriteria(record)}
                style={{width:"100%", background : 'none', border : 'none', padding : "0", textDecoration : 'underline', textAlign : 'start'}}>
                    Selection Screen
                </button>
            )
        }
    ];      

    const handleProjectSelect = (e)=>{
        setSelectProjectId(e);
        let filteredData = []
        if(e === 0) filteredData = partialBussinessRules;
        else filteredData = partialBussinessRules && partialBussinessRules?.filter(item => item?.project_id === e)
        setBussinessRules(filteredData);
    }

    const showDeleteModal = ()=>{
        if(selectedRecord === null){
            if(alertActive){
                messageApi.info('Please Select a File')
                setAlertActive(false);
                setTimeout(()=>setAlertActive(true),3000);
                }
        }
       else{
           setOpenDeleteModal(true);
       }
    }

    const handleCreateNavigation = ()=>{
        if(selectProjectId !== 0) navigate(`/bussinessrules/create/${selectProjectId}`);
        else{
            if(alertActive){
                messageApi.info('Please Select a Project')
                setAlertActive(false);
                setTimeout(()=>setAlertActive(true),3000);
            }
        }
    }

    const handleEditNavigation = ()=>{
        if(selectedRecord === null)
        {
            if(alertActive){
            messageApi?.info('Please Select a File')
            setAlertActive(false);
            setTimeout(()=>setAlertActive(true),3000);
            }
        }
        else{
            navigate(`/bussinessrules/reupload/${selectedRecord?.obj_id}`);
        }
    }   

    const hideDeleteModal = () => {  
        setOpenDeleteModal(false);  
    }; 

    const handleViewRules = ()=>{
        if(selectedRecord === null)
            {
                if(alertActive){
                messageApi.info('Please Select a File')
                setAlertActive(false);
                setTimeout(()=>setAlertActive(true),3000);
                }
            }
            else{
                navigate(`/bussinessrules/viewsegmenttables/${selectedRecord?.project_id}&&${selectedRecord?.obj_id}`);
            }
    }

    const handleDelete = ()=>{
        dispatch(deleteBussinessRulesSlice({obj_id : selectedRecord?.obj_id}))
        .then((response)=>{
            if(response?.payload?.status === 202){
                toast?.success(`${selectedRecord?.obj_name} Deletion Successfull`)
                loadBussinessRules();
                hideDeleteModal(false);
            }
            else{
                toast?.error(`${selectedRecord?.obj_id} Deletion Failed`)
            }
        })
        setOpenDeleteModal(false);
    }

    const handleSelectionModal = ()=>{
        setOpenSelectionModal(true);
    }

    const hideSelectionModal = ()=>{
        setOpenSelectionModal(false);
    }


    const handleSearch = (e)=>{
        let filteredData = []
        if(selectProjectId !== 0){
            filteredData = partialBussinessRules?.filter((item =>(
                item?.project_id === selectProjectId && (
                    item?.obj_name?.toLowerCase()?.includes(e?.toLowerCase()) || item?.obj_id?.toString()?.includes(e?.toLowerCase())
                )
            )))
        }
        else{
            filteredData = partialBussinessRules?.filter(item => (
               item?.obj_name?.toLowerCase()?.includes(e?.toLowerCase()) || item?.obj_id?.toString()?.includes(e?.toLowerCase())
            ))
        }
        setBussinessRules(filteredData);
    }

    const handleSearchChange = (e)=>{
        if(!e?.target?.value)
        {
            let filteredData = []
            if(selectProjectId !== 0)
            {   
                filteredData = partialBussinessRules?.filter(item =>(
                    item?.project_id === selectProjectId
                ))
            }
            else filteredData = partialBussinessRules;
            setBussinessRules(filteredData);
        }
    }

    const handleSelectionModal2 = ()=>{
        alert(2);
    }

  return (
    
    <div className='w-100 p-4'>
        <Meta title="Manage Bussiness Rules"/>
         <ToastContainer
            position='top-center' autoClose={2500} hideProgressBar={false} closeOnClick newestOnTop={true} rtl={false} pauseOnFocusLoss
            draggable  pauseOnHover theme='light'/>
                {contextHolder}
                <div className="container-fluid ">  
                <div className="options_header" style={{ overflowX: "auto"}}>  
            <label style={{ color: "skyblue", fontSize: "20px",marginRight:"10px" }}>Bussines Rules</label>  
            <CustomSelectManageProjects value={selectProjectId} handleChange={handleProjectSelect} projects={allProjects}/>
            <Button onClick={handleCreateNavigation} style={{ fontSize: '14px', marginRight:"10px" }}>  
                Upload  
            </Button>  
            <Button  onClick={handleEditNavigation} style={{ fontSize: '14px', marginRight:"10px" }}>  
                ReUpload  
            </Button>  
            <Button  onClick={handleViewRules} style={{ fontSize: '14px', marginRight:"10px" }}>  
                View Tables   
            </Button>  
            <Button  onClick={showDeleteModal} style={{ fontSize: '14px', marginRight:"10px" }}>  
                Delete  
            </Button>   

            <Search  
            placeholder="Search by Data Object, or Id"  
            onSearch={(e) => handleSearch(e)}  
            enterButton  
            onChange={(e) => handleSearchChange(e)}  
            style={{ minWidth: "300px", maxWidth: "300px", marginRight: "10px", marginBottom: "1px", maxHeight: "32px" }} />
                </div>  
            </div>

         <div className='managebussinessrules'style={{marginTop:"10px"}}>
           <Table  
                columns={columns} 
                dataSource={bussinessRules} 
                // dataSource={ dummy} // Use the filtered data  
                pagination={{  
                    pageSize: 10,  
                }}  
                className='Manage_BussinessRules_table'
                style={{overflowX:"auto"}}
            />  
            </div>

            <Modal
            open={openDeleteModal}
            title={<>Delete { selectedRecord?.obj_name !== undefined ?  <span style={{ color: "red",display:"inline" }}>"{` `} {selectedRecord?.obj_name}{` `} "</span>:''} {` `}Object</>}
            onOk={handleDelete}
            onCancel={hideDeleteModal}
            okText="OK"
            cancelText="CANCEL">
      </Modal>

                <Modal
                open={openSelectionModal}
                title={<SelectionViewBussinessRule selectionContext={selectionContext} handleOk={handleSelectionModal2}/>}
                width={1000}
                onOk={handleSelectionModal2}
                onCancel={hideSelectionModal}
                >
                </Modal>
    </div>
  )
}

export default ManageBussinessRules