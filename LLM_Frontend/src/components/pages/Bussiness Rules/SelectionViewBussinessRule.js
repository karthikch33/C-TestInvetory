import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { createSaveRulesSlice,  getDataSegmentsSlice,
getFetchRulesSlice,
handleIntialVersionCheckSlice,
handleUploadSheetSlice} from '../../features/BussinessRules/BussinessRulesSlice';
import { Checkbox, Form, Input, Select, Spin, Table, Tooltip } from 'antd';
import Switch from '@mui/material/Switch';
import { Option } from 'antd/es/mentions';
import {EditableField, EditableArea, EditableSelectRuleStatus, EditableSelectMappingType} from './EditableCell';
import { MdOutlineFileUpload } from "react-icons/md";
import { MdOutlineFileDownload } from "react-icons/md";
import { LuSave } from "react-icons/lu";
import { message } from 'antd';
import * as XLSX from 'xlsx';
import Meta from '../../utils/Meta';
 
const SelectionViewBussinessRule = (params) => {
    const { Search } = Input;
    const [spinner,setSpinner] = useState(false);
    const [editable, setEditable] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();
    const [expanded, setExpanded] = useState(false);
    const [rules, setRules] = useState(null);
    const [searchText,setSearchText] = useState(null);
    const [rulesSearch,setRulesSearch] = useState(null);
    const [segments, setSegments] = useState(null);
    const [tableDisplayBasis, setTableDisplayBasis] = useState(false);
    const [alertActive,setAlertActive] = useState(false); 
    const [selectionDisplayBasis, setSelectionDisplayBasis] = useState(false);
    const [tip,setTip] = useState('');
   
    const dispatch = useDispatch();

    const { selectionContext } = params;

    useEffect(()=>{
        let things = createDataSource(expanded)
        setRulesSearch(things)
    },[rules])

    useEffect(()=>{
      const data = {
        project_id : selectionContext?.project_id,
        object_id : selectionContext?.object_id
      }
      dispatch(getDataSegmentsSlice(data))
      .then((response)=>{
        setSegments(response?.payload?.data);
      })
    },[selectionContext])
 
    const formik = useFormik({
        initialValues:{
            selected_segment: '',
            selected_segment_name : ''
        },
    })

    const columns = [
        {
            title : 'Mandatory',
            data : 'user_mandatory',
            key : 'user_mandatory',
            render : (_,record) =>(
                 <Checkbox checked={record?.user_mandatory}
                onClick={(newValue)=> handleInputChange(record?.displayIndex,'user_mandatory',newValue?.target?.checked)} disabled={false}/>
            )
        },
        {  
            title: 'Source Table',  
            dataIndex: 'source_table',  
            key: 'source_table',  
            render: (_,record) => (  
                <EditableField  
                    value={record?.source_table}  
                    disabled={false}
                    onUpdate={(newValue) => handleInputChange(record?.displayIndex, 'source_table', newValue)}
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
                    onUpdate={(newValue) => handleInputChange(record?.displayIndex, 'source_field_name', newValue)}
                    disabled={false}
                    source='source_field_name'  
                />
            )  
        },  
        {  
            title: 'Mapping Type',  
            dataIndex: 'data_mapping_type',  
            key: 'data_mapping_type',  
            render: (_, record) => (  
                <EditableSelectMappingType handleChange={(value) => handleInputChange(record?.displayIndex, 'data_mapping_type', value)}
                value={record?.data_mapping_type} disabled={false}/>
            )  
        },  
        {  
            title: 'Rules',  
            dataIndex: 'data_mapping_rules',  
            key: 'data_mapping_rules',  
            render: (_, record) => (  
                <EditableArea
                disabled={false}
                    value={record?.data_mapping_rules}
                    onUpdate={ (newValue)=>handleInputChange(record?.displayIndex,'data_mapping_rules',newValue)}
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
            render : (_,record)=>{
               return <Tooltip title={record?.target_sap_field } color={'black'} key={'white'} style={{color:"black"}}  placement="bottomRight">
                <label>{record?.isKey === 'true'? <span style={{color:"red"}}> *{record?.target_sap_field }</span>: record?.target_sap_field}</label>
                </Tooltip>
            }
        },  
        {  
            title: 'Text Description',  
            dataIndex: 'text_description',  
            key: 'text_description',  
        },  
        {  
            title: 'Look Up Table',  
            dataIndex: 'lookup_table',  
            key: 'lookup_table',  
            render: (_, record) => (  
                <EditableField      
                value={record.lookup_table}  
                disabled={false}
                onUpdate={(newValue) => handleInputChange(record?.displayIndex, 'lookup_table', newValue)}  
            />
            )  
        },  
        {
            title : 'Look Up Field',
            data : 'lookup_field',
            key : 'lookup_field',
            render : (_,record) =>(
                <EditableField
                value = {record?.lookup_field}
                disabled={false}
                onUpdate = {(newValue) => handleInputChange(record?.displayIndex,'lookup_field',newValue)}
                />
            )
        },
        {  
            title: 'Rule Status',  
            dataIndex: 'rule_status',  
            key: 'rule_status',  
            render: (_, record) => (  
                <EditableSelectRuleStatus value={record?.rule_status}
                disabled={false}
                handleChange={(value) => handleInputChange(record?.displayIndex, 'rule_status', value)}/>
            )  
        }  
    ]; 
 
    const handleInputChange = (index, field, value) => {
        const updatedRules = [...rules];
        updatedRules[index - 1][field] = value;
        updatedRules[index - 1]['check_box']=true;

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
  
    const handleSegmentChange  = (value, option)=>{
        formik.setFieldValue('selected_segment', value);
        setExpanded(false);
        setRules(null);
        setEditable(false);
        setSpinner(true);
        setTip('Fetching...');

        formik.setFieldValue('selected_segment_name',option?.record?.segement_name);
 
        const data = {
            project_id :selectionContext?.project_id,
            object_id : selectionContext?.object_id,
            segment_id : value
        }


            dispatch(handleIntialVersionCheckSlice(data))
            .then((response)=>{
                if(response?.payload?.status === 200){
                    setTableDisplayBasis(false);
                    setSelectionDisplayBasis(false);
                    message.info('Versions Are Already Created For this Segment');
                }
                else if(response?.payload?.status === 404){
                    setTableDisplayBasis(true);
                    setSelectionDisplayBasis(true);
                            dispatch(getFetchRulesSlice(data))
                            .then((response)=>{
                            if(response?.payload?.status === 200)
                            {
                                const updatedValues = [];
                                const fetchedRules = response?.payload?.data;
                                console.log(fetchedRules);
                                Array.isArray(fetchedRules[0]) && fetchedRules[0]?.forEach((rule, index) => {  
                                    updatedValues.push({ ...rule, displayIndex: index + 1 });  
                                });  
                                setRules(updatedValues);
                            }
                            else{
                                message?.error('Internal Server Error')
                            }
                    })
                }
            })
            .finally(()=>{
                setSpinner(false);
            })

            
    }

 
    const handleSubmit = () => {  
        setSpinner(true);
        setTip('Saving...');
        console.log(rules)
        console.log(rulesSearch);
        dispatch(createSaveRulesSlice(rules))
        .then((response)=>{
            if(response?.payload?.status === 200)
            {
                setRules('');
                setExpanded(false); 
                message?.success('Changes saved temporarily'); 
            }
            else message?.error('Error in Saving');
        }).finally(()=>{
            setSpinner(false);
        })
    };  
     
    const createDataSource = (expanded) => 
    {
        if(expanded){
            return rules;
        }
        console.log(rules)
        return Array.isArray(rules) && rules?.filter((record)=> record?.isMandatory ==='True' || record?.isMandatory === true) // try optimzation here why filter always
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

     const handleExcelSheet = ()=>{
            const worksheet = XLSX.utils.json_to_sheet(rules);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
            XLSX.writeFile(workbook, `${formik?.values?.selected_segment_name}.xlsx`);
    }


    const inputRef = useRef(null);

  const openPicker = () =>{ 
    if(alertActive === true)
    {
        return;
    }
    if(!formik.values.selected_segment){
        messageApi?.info('Please Select a Segment')
        setAlertActive(true)
        setTimeout(()=> setAlertActive(false), 4000)
        return;
    }
    inputRef.current?.click();
 }

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // validate by MIME and extension as a fallback
    const isXlsx = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || /\.xlsx$/i.test(file.name);
    const isXls  = file.type === 'application/vnd.ms-excel' || /\.xls$/i.test(file.name);
    if (!isXlsx && !isXls) {
      // show toast or message
      alert('Not an EXCEL')
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    // append more fields if needed, e.g. formData.append('projectId', projectId)

    dispatch(handleUploadSheetSlice(formData))
    .then((response)=>{
      const text = response?.payload?.data
      const safe = text.replace(/\bNaN\b/g, "null");
      const arr = JSON.parse(safe);
      setRules(arr);
    })
    // reset input so same file can be selected again
    e.target.value = '';
  };
 
  return (
    <Spin spinning={spinner} tip={tip}>
        <Meta title="Edit Rules"/>
        {contextHolder}
    <div className='container p-4'>
        <div className="filters">
        <Form className='' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',overflowX:'auto' }}>

        <div style={{ flex: '0 0 50%', display: 'flex', justifyContent: 'space-between' }}>  
        <Form.Item label='Segment' style={{ minWidth: 200, maxWidth: 200, marginRight: 10 }}>  
            <Select  
                style={{ width: 130 }}  
                onChange={handleSegmentChange}  
                value={formik.values.selected_segment || undefined}  
            >  
                {segments && segments.map((segment) => (  
                    <Option key={segment?.segment_id} value={segment?.segment_id} record={segment}>  
                        {segment?.segement_name}  
                    </Option>  
                ))}  
            </Select>  
        </Form.Item>  
    </div>  

    <div style={{ flex: '0 0 7%', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>  

    <>
      <input
        type="file"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
        ref={inputRef}
        onChange={onFileChange}
        style={{ display: 'none' }}
      />
      <Form.Item>
        <Tooltip title="File Upload" color="black" key="black">
          <MdOutlineFileUpload
            style={{ marginRight: 10, fontSize: 20, cursor: 'pointer', color: 'blue' }}
            onClick={openPicker}
          />
        </Tooltip>
      </Form.Item>
    </>


        <Form.Item> 
        <Tooltip title="Save" color={'black'} key={'black'} >   
            <LuSave onClick={handleSubmit} style={{ marginRight: "10px", fontSize: "20px", cursor: "pointer", color: "blue" }} />  
            </Tooltip>
        </Form.Item>  

        <Form.Item >  
            <Tooltip title="Show All Fields" color={'black'} key={'black'}>  
                <Switch checked={expanded} onChange={createDataSourceExpand} size='small'/>  
            </Tooltip>  
        </Form.Item>  

        <Form.Item>
          <Tooltip title="Sheet Download">
            <MdOutlineFileDownload style={{marginLeft : "10px", fontSize : "20px", cursor : "pointer", color : "blue"}} onClick={handleExcelSheet}/>
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
          <div className='rules_table'>
           {
            tableDisplayBasis &&  <Table
            columns={columns}
            className='View_Bussiness_Rule_Table'
            dataSource={rulesSearch || []} 
            scroll={{y: "70vh" }}
            style={{overflow:"auto"}}
            pagination={
               {
                   pageSize:7,
                   pageSizeOptions:[],
                   showQuickJumper:true,
                   showSizeChanger:false,
               }
            }
            />
           }
           </div>
           <div className='selection_screen' style={{marginTop : "20px"}}>
           { selectionDisplayBasis &&   <label htmlFor="">Lorem ipsum dolor sit amet consectetur adipisicing elit.</label> }
        { selectionDisplayBasis && <div className='text_area_selection_screen' style={{marginTop : '20px'}}>
                <textarea  className="form-control fixed-height-textarea" placeholder='Selection Criteria'>

                </textarea>
              </div>
}
           </div>
           
        </div>
    </div>
    </Spin>
  )
}
export default SelectionViewBussinessRule

