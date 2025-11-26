import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { createSaveRulesSlice, createVersionRulesSlice, getBussinessRulesSlice, getDataSegmentsSlice,
getFetchRulesSlice ,getVersionRulesSlice } from '../../features/BussinessRules/BussinessRulesSlice';
import { Checkbox, Form, Input, Select, Spin, Table, Tooltip } from 'antd';
import Switch from '@mui/material/Switch';
import { Option } from 'antd/es/mentions';
import { VscVersions } from "react-icons/vsc";
import CryptoJS from 'crypto-js';
import { IoArrowBackCircleSharp } from "react-icons/io5";
import {EditableField, EditableArea, EditableSelectRuleStatus, EditableSelectMappingType} from './EditableCell';
import { useLocation,useNavigate } from 'react-router-dom';
import { LuSave } from "react-icons/lu";
import { message } from 'antd';
import Meta from '../../utils/Meta';
 
const ViewBussinessRule = () => {
    const { Search } = Input;
    const projects = useSelector(state => state.project.projects);
    const [allProjects,setAllProjects] = useState([]);
    const [spinner,setSpinner] = useState(false);
    const [editable, setEditable] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();
    const [expanded, setExpanded] = useState(false);
    const [rules, setRules] = useState(null);
    const [searchText,setSearchText] = useState(null);
    const [rulesSearch,setRulesSearch] = useState(null);
    const [tip,setTip] = useState('');
   
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);

    // const project_details = location?.pathname?.split('/')[3];
    // const object_details = location?.pathname?.split('/')[4];
    // const object_id = decryptValue(object_details?.split('&&')[0]);
    // const object_name = decryptValue(object_details?.split('&&')[1]);
    // const project_id = decryptValue( project_details?.split('&&')[0]);
    // const project_name = decryptValue(project_details?.split('&&')[1]);  

    const project_id = queryParams.get('projectId')
    const project_name =queryParams.get('projectName')
    const object_id = queryParams.get('objectId')
    const object_name = queryParams.get('objectName')

    
 
    // useEffect(()=>{
    //     const handleBeforeUnload = (event) => {
    //         event.preventDefault();
    //         event.returnValue = "Are you sure you want to leave?";
    //     };
    //     window.addEventListener('beforeunload', handleBeforeUnload);
    //     return () => {
    //         window.removeEventListener('beforeunload', handleBeforeUnload);
    //     };
    // },[]);

    const callError = ()=>{
        message?.warning("Avoid using your intellect; it won't yield updates.")
    }
 
    useEffect(()=>{
        formik.setFieldValue('current_project',project_name);
        formik.setFieldValue('selected_project',project_id);
        setExpanded(false);
        if(project_id){
            dispatch(getBussinessRulesSlice({ obj_id: project_id }))  
            .then((response) => {  
                formik.setFieldValue('objects', response?.payload?.data);  
            }) 
        }
        else{
            message.warning("Critical Warning: Parameters Must Not Be Altered.")
            navigate('/bussinessrules/manage')
        }
    },[project_id])
 
    useEffect(()=>{
        formik.setFieldValue('current_object',object_name)
        formik.setFieldValue('selected_object',object_id)
        setExpanded(false);
        const data = {
            project_id,
            object_id
        }
        if(object_id){
            dispatch(getDataSegmentsSlice(data))
            .then((response)=>{
                console.log(response?.payload?.data)
                formik.setFieldValue('segments', response?.payload?.data);  
            })
        }
        else{
            message.warning("Critical Warning: Parameters Must Not Be Altered.")
            navigate('/bussinessrules/manage')
        }
    },[object_id])

    useEffect(()=>{
        const filteredProjects = projects?.filter(item => item?.project_type === 'DMC')
        setAllProjects(filteredProjects);
    },[projects])

    useEffect(()=>{
        let things = createDataSource(expanded)
        setRulesSearch(things)
    },[rules])
 
    const formik = useFormik({
        initialValues:{
            objects:'',
            segments:'',
            versions:'',
            selected_project:'',
            selected_object : '',
            selected_version: '',
            selected_segment: '',
            current_project : '',
            current_object : '',
            current_version:''
        },
    })

    const columns = [
        {
            title : 'Mandatory',
            data : 'user_mandatory',
            key : 'user_mandatory',
            render : (_,record) =>(
                 <Checkbox checked={record?.user_mandatory}
                onClick={(newValue)=> handleInputChange(record?.displayIndex,'user_mandatory',newValue?.target?.checked)} disabled={editable}/>
            )
        },
        {  
            title: 'Source Table',  
            dataIndex: 'source_table',  
            key: 'source_table',  
            render: (_,record) => (  
                <EditableField  
                    value={record?.source_table}  
                    onUpdate={editable ? callError : (newValue) => handleInputChange(record?.displayIndex, 'source_table', newValue)}
                    disabled={editable}
                />  
            )  
        },  
        {  
            title: 'Source Field Name',  
            dataIndex: 'source_field_name',  
            key: 'source_field_name',  
            render: (_, record) => (  
                <EditableField  
                    value={record?.source_field_name}  
                    onUpdate={editable ? callError : (newValue) => handleInputChange(record?.displayIndex, 'source_field_name', newValue)}
                    disabled={editable}
                    source='source_field_name'  
                />
            )  
        },  
        {  
            title: 'Mapping Type',  
            dataIndex: 'data_mapping_type',  
            key: 'data_mapping_type',  
            render: (_, record) => (  
                <EditableSelectMappingType handleChange={editable ? callError : (value) => handleInputChange(record?.displayIndex, 'data_mapping_type', value)}
                value={record?.data_mapping_type} disabled={editable}/>
            )  
        },  
        {  
            title: 'Rules',  
            dataIndex: 'data_mapping_rules',  
            key: 'data_mapping_rules',  
            render: (_, record) => (  
                <EditableArea
                    value={record?.data_mapping_rules}
                    disabled={editable}
                    onUpdate={editable ? callError : (newValue)=>handleInputChange(record?.displayIndex,'data_mapping_rules',newValue)}
                />
            )  
        },  
        {  
            title: 'Target SAP Table',  
            dataIndex: 'target_sap_table',  
            key: 'target_sap_table',  
        },  
        {  
            title: 'Target SAP Field',  
            dataIndex: 'target_sap_field',  
            key: 'target_sap_field',  
            width : 120,
            render : (_,record)=>(
                <Tooltip title={record?.target_sap_field } color={'black'} key={'white'} style={{color:"black"}}  placement="bottomRight">
                <label>{record?.isKey === "True"? <span style={{color:"red"}}> *{record?.target_sap_field }</span>: record?.target_sap_field}</label>
                </Tooltip>
            )
        },  
        {  
            title: 'Text Description',  
            dataIndex: 'text_description',  
            key: 'text_description',  
        },  
        // {  
        //     title: 'Look Up Table',  
        //     dataIndex: 'lookup_table',  
        //     key: 'lookup_table',  
        //     render: (_, record) => (  
        //         <EditableField      
        //         value={record.lookup_table}  
        //         disabled={editable}
        //         onUpdate={editable ? callError : (newValue) => handleInputChange(record?.displayIndex, 'lookup_table', newValue)}  
        //     />
        //     )  
        // },  
        // {
        //     title : 'Look Up Field',
        //     data : 'lookup_field',
        //     key : 'lookup_field',
        //     render : (_,record) =>(
        //         <EditableField
        //         value = {record?.lookup_field}
        //         disabled = {editable}
        //         onUpdate = {editable ? callError : (newValue) => handleInputChange(record?.displayIndex,'lookup_field',newValue)}
        //         />
        //     )
        // },
        // {  
        //     title: 'Rule Status',  
        //     dataIndex: 'rule_status',  
        //     key: 'rule_status',  
        //     render: (_, record) => (  
        //         <EditableSelectRuleStatus value={record?.rule_status} disabled={editable}
        //         handleChange={editable ? callError : (value) => handleInputChange(record?.displayIndex, 'rule_status', value)}/>
        //     )  
        // } 
        {
            title : 'LookUP',
            data : 'lookup',
            key : 'lookup',
            render : (_,record) =>(
                 <Checkbox checked={record?.lookup}
                onClick={(newValue)=> handleInputChange(record?.displayIndex,'lookup',newValue?.target?.checked)} disabled={editable}/>
            )
        } 
    ]; 
 
    const handleInputChange = (index, field, value) => {
        // alert();
        const updatedRules = [...rules];
        updatedRules[index - 1][field] = value;
        updatedRules[index - 1]['check_box']=true;

        console.log("index " + index)
        console.log("field " + field)
        console.log("value " + value)

        console.log(updatedRules);
        if(searchText){
            const updatedValues = createDataSource(expanded);
            const filteredData = updatedValues && updatedValues.filter(item => (
            item?.target_sap_field?.toLowerCase().includes(searchText.toLowerCase()) ||
            item?.target_sap_table?.toLowerCase().includes(searchText.toLowerCase()) ||
            item?.text_description?.toLowerCase().includes(searchText.toLowerCase())
        ));
        setRulesSearch(filteredData)
        }
        else 
        setRules(updatedRules); 
    };  
 
    const handleProjectChange = (value) => {  
        formik.resetForm();
        setExpanded(false);
        setRules(null)
        formik.setFieldValue('selected_project', value);
        formik.setFieldValue('current_project',value);
        const data = {
            obj_id : value,
            project_type : 'DMC'
        }
        dispatch(getBussinessRulesSlice(data))  // we are project id only but it is named has obj_id
        .then((response) => {  
            const filteredObjects = response?.payload?.data?.filter((item)=> item?.project_id === value);
            formik.setFieldValue('objects', filteredObjects);
        })
    };
 
    const handleObjectChange = (value) =>{
        formik.setFieldValue('selected_segment', '');
        formik.setFieldValue('selected_version', null);  
        formik.setFieldValue('current_version', '');
        formik.setFieldValue('selected_object',value);
        formik.setFieldValue('current_object', value);
        formik.setFieldValue('segments',[]);
        formik.setFieldValue('versions',[]);
        setExpanded(false);
        setRules(null);
 
        const data = {
            project_id : formik.values.selected_project,
            object_id : value
        }
        dispatch(getDataSegmentsSlice(data))
        .then((response)=>{
            formik.setFieldValue('segments', response?.payload?.data);  
        })
    };

    const handleSegmentChange  = (value)=>{
        formik.setFieldValue('selected_version',null);
        formik.setFieldValue('current_version', '');
        formik.setFieldValue('selected_segment', value);
        formik.setFieldValue('versions',[]);
        setExpanded(false);
        setRules(null);
        setEditable(false);
        setSpinner(true);
        setTip('Fetching...');
 
        const data = {
            project_id : formik.values.selected_project,
            object_id : formik.values.selected_object,
            segment_id : value
        }
            dispatch(getFetchRulesSlice(data))
            .then((response)=>{
                if(response?.payload?.status === 200)
                {
                    const updatedValues = [];
                    const fetchedRules = response?.payload?.data;
                    Array.isArray(fetchedRules[0]) && fetchedRules[0]?.forEach((rule, index) => {  
                        updatedValues.push({ ...rule, displayIndex: index + 1 });  
                    });  
                    setRules(updatedValues);
                    formik?.setFieldValue('versions',fetchedRules[1]);
                    formik?.setFieldValue('current_version','In Process');
                }
                else{
                    message?.error('Internal Server Error')
                }
            })
            setSpinner(false);
    }
 
    const handleVersionChange = (value)=>{
        setEditable(true);
        setExpanded(false);
        formik.setFieldValue('selected_version',value);
        formik.setFieldValue('current_version',value);
        if(value === 'X'){
            setEditable(false);
            const data = {
                project_id : formik.values.selected_project,
                object_id : formik.values.selected_object,
                segment_id : formik.values.selected_segment
             }
            fetchSaveRules(data);
        }
        else{
            const data = {
                project_id : formik.values.selected_project,
                object_id : formik.values.selected_object,
                segment_id : formik.values.selected_segment,
                verison_number : value
            }
            dispatch(getVersionRulesSlice(data))
            .then((resposne)=>{
                if(resposne?.payload?.status === 200) setRules(resposne?.payload?.data)
            })
            formik.setFieldValue('selected_version',value);
            formik.setFieldValue('current_version',value);
        }          
    }
 
    const handleSubmit = () => {  
        setSpinner(true);
        setTip('Saving...');
        console.log(rules)
        console.log(rulesSearch)
        dispatch(createSaveRulesSlice(rules))
        .then((response)=>{
            if(response?.payload?.status === 200)
            {
                formik?.setFieldValue('current_version','');
                setRules('');
                setExpanded(false); 
                message?.success('Changes saved temporarily'); 
            }
            else message?.error('Error in Saving');
        }).finally(()=>{
            setSpinner(false);
        })
    };  
    
    const handleVersion = () => {   
        setSpinner(true);  
        setTip('Creating Version...');  
        dispatch(createVersionRulesSlice(rules))
        .then((response) => {  
            if (response?.payload?.status === 200){  
                formik?.resetForm();
                setExpanded(false); 
                setRules('');
                message?.success("New Version " + response?.payload?.data[0]?.version_id + " has been created successfully ");  
            }
            else if(response?.payload?.status === 406) message?.error('One to One Mapping Failed, New Version Created');
            else message.error('Error in Creating Version');
        })
        .finally(() => {  
            setSpinner(false);  
        });  
    };  

    const fetchSaveRules = (data)=>{
        setSpinner(true);
        setTip('Fetching...')
        dispatch(getFetchRulesSlice(data))
        .then((response)=>{
            if(response?.payload?.status === 200){
                const updatedValues = [];  // creating a new array to store the updated values with index
                const fetchedRules = response?.payload?.data;
                fetchedRules[0].forEach((rule, index) => {  
                    updatedValues.push({ ...rule, displayIndex: index + 1 });  
                });  
                setRules(updatedValues)
            }
        })
        setSpinner(false);
    }
 
    const createDataSource = (expanded) => 
    {
        if(expanded){
            return rules;
        }
        return Array.isArray(rules) && rules?.filter((record)=> record?.isMandatory ==='True') // try optimzation here why filter always
    };
   
    const createDataSourceExpand = () => {  
        setExpanded(!expanded);  
        setRulesSearch(createDataSource(!expanded)); 
    };

    const handleSearch = (e)=>{
        setSearchText(e);
        const updatedValues = createDataSource(expanded);
        const filteredData = updatedValues && updatedValues.filter(item => (
            item?.target_sap_field?.toLowerCase().includes(e.toLowerCase()) ||
            item?.target_sap_table?.toLowerCase().includes(e.toLowerCase()) ||
            item?.text_description?.toLowerCase().includes(e.toLowerCase())
        ));
        setRulesSearch(filteredData)
    }

    const handleSearchChange = (e)=>{
        setSearchText(null)
        if(!e.target.value)
         setRulesSearch(createDataSource(expanded))
    }
 
  return (
    <Spin spinning={spinner} tip={tip}>
        <Meta title="Edit Rules"/>
        {contextHolder}
    <div className='container p-4'>
        <div className="filters">
        <Form className='' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',overflowX:'auto' }}>  
    <div style={{ flex: '0 0 3%', display: 'flex', alignItems: 'center' }}>  
        <Form.Item style={{ marginRight: 10 }}>  
            <IoArrowBackCircleSharp style={{ fontSize: "20px", cursor: "pointer" }} onClick={() => navigate('/bussinessrules/manage')} />  
        </Form.Item>  
    </div>  

        <div style={{ flex: '0 0 50%', display: 'flex', justifyContent: 'space-between' }}>  
        <Form.Item label='Project' style={{ minWidth: 160, maxWidth: 160, marginRight: 10 }}>  
            <Select  
                style={{ width: 100 }}  
                onChange={handleProjectChange}  
                key={formik.values.current_project || undefined}  
                value={formik.values.current_project || undefined}  
            >  
                {allProjects && allProjects.map((project) => (  
                    <Option key={project?.project_id} value={project?.project_id}>  
                        {project?.project_name}  
                    </Option>  
                ))}  
            </Select>  
        </Form.Item>  

        <Form.Item label='Object' style={{ minWidth: 160, maxWidth: 160, marginRight: 10 }}>  
            <Select  
                style={{ width: 100 }}  
                key={formik.values.selected_object || undefined}  
                value={formik.values.current_object || undefined}  
                onChange={handleObjectChange}  
            >  
                {formik.values.objects && formik.values.objects.map((object) => (  
                    <Option key={object?.obj_id} value={object?.obj_id}>  
                        {object?.obj_name}  
                    </Option>  
                ))}  
            </Select>  
        </Form.Item>  

        <Form.Item label='Segment' style={{ minWidth: 200, maxWidth: 200, marginRight: 10 }}>  
            <Select  
                style={{ width: 130 }}  
                onChange={handleSegmentChange}  
                value={formik.values.selected_segment || undefined}  
            >  
                {formik.values.segments && formik.values.segments.map((segment) => (  
                    <Option key={segment?.segment_id} value={segment?.segment_id}>  
                        {segment?.segement_name}  
                    </Option>  
                ))}  
            </Select>  
        </Form.Item>  

        <Form.Item label='Version' style={{ minWidth: 160, maxWidth: 160, marginRight: 10 }}>  
            <Select  
                style={{ marginRight: 10 }}  
                key={formik.values.selected_version || undefined}  
                value={formik.values.current_version || undefined}  
                onChange={handleVersionChange}  
            >  
                {formik.values.versions && formik.values.versions.map((version) => (  
                    <Option value={version?.ind} key={version?.ind}>  
                        {"v" + version?.ind}  
                    </Option>  
                ))}  
                <Option value='X' key='X'>In Process</Option>  
            </Select>  
        </Form.Item>  
    </div>  

    <div style={{ flex: '0 0 7%', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>  
        <Form.Item> 
        <Tooltip title="Save" color={'black'} key={'black'} >   
            <LuSave onClick={handleSubmit} style={{ marginRight: "10px", fontSize: "20px", cursor: "pointer", color: "blue" }} />  
            </Tooltip>
        </Form.Item>  
        <Form.Item>  
        <Tooltip title="Create New Version" color={'black'} key={'black'} >  
            <VscVersions onClick={handleVersion} style={{ marginRight: "10px", fontSize: "22px", cursor: "pointer", color: "blue" }} />  
            </Tooltip>  
        </Form.Item>  
        <Form.Item >  
            <Tooltip title="Show All Fields" color={'black'} key={'black'}>  
                <Switch checked={expanded} onChange={createDataSourceExpand} size='small'/>  
            </Tooltip>  
        </Form.Item>  
    </div>  

    <div style={{ flex: '0 0 20%', display: 'flex', alignItems: 'center' }}>  
        <Form.Item>  
            <Search  
                placeholder="Search by Sap Table Sap Field"  
                onSearch={(e) => handleSearch(e)}  
                enterButton  
                onChange={(e) => handleSearchChange(e)}  
                style={{ minWidth: "250px", maxWidth: "250px", marginRight: "10px", marginBottom: "1px", maxHeight: "32px" }}  
            />  
        </Form.Item>  
    </div>  
        </Form>  
        </div>
        <div className='bussiness_rules_table container-fluid'>
            <Table
             columns={columns}
             className='View_Bussiness_Rule_Table'
             dataSource={rulesSearch || []} 
             scroll={{y: "70vh" }}
             style={{overflow:"auto"}}
            //  rowClassName={(record, index) => ((record?.rule_status==='Completed' ? 'lightgreen' : record?.rule_status==='In Progress' ? 'lightyellow' : record?.rule_status==='To Start' ? 'lightred' : record?.rule_status==='On Hold' ? 'lightblue' : ''))}
             pagination={
                {
                    pageSize:7,
                    pageSizeOptions:[],
                    showQuickJumper:true,
                    showSizeChanger:false,
                }
             }
            // pagination = {false}
             />
        </div>
    </div>
    </Spin>
  )
}
export default ViewBussinessRule

