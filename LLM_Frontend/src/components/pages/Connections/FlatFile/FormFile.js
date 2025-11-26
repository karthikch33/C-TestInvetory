import React, { useEffect, useState } from 'react';  
import { Button, message,Spin } from 'antd';  
import { useFormik } from "formik";  
import * as yup from 'yup';  
import 'bootstrap/dist/css/bootstrap.min.css';  
import { useDispatch, useSelector } from 'react-redux';
import { getFileSlice, uploadCsvSheetSlice, uploadExcelSheetSlice, uploadExcelSlice, uploadTxtSheetSlice } from '../../../features/Connections/fileSlice';
import { CustomSelectCheckbox, CustomSelectFileType, CustomSelectFormType, CustomSelectProject, CustomSelectSheet } from '../../CustomSelect';
import { extractFirstColumnSlice } from '../../../features/Connections/connectionSlice';
 
const FormFile = ({handleOk,loadFile}) => {
    const [allProjects, setAllProjects] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [fileType, setFileType] = useState(null);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [sheets, setSheets] = useState([]);
    const [primaryKeys, setPrimaryKeys] = useState([]);
    const [selectedPrimaryKeys, setSelectedPrimaryKeys] = useState([]);
    const dispatch = useDispatch();

    const projects = useSelector(state => state.project.projects);  

    useEffect(()=>{
        setAllProjects(projects);
    },[projects])

    const schema = yup.object().shape({  
        project_id: yup.string().required('Project Selection Required'),     
        file_type: yup.string().required('File Type Selection Required'),  
        form_type : yup.string().required('Form Type Selection Required'),
    });  
 
    const formik = useFormik({  
            initialValues: {  
                project_id: "",
                file_type: "",
                form_type : '',
                file_status : '',
                project_name:'',
                uploaded_fileName:'',
                selected_sheet: ''
            },
            validationSchema : schema,
            onSubmit : (values)=>{
                handleFormUploadExcel()
            }
    });
    
    const handleFormUploadExcel = async() => {
        setLoading(true);
        if (!file) 
        {
            message?.error('File Not Attached')
            return;
        }    

        const trimedData = selectedPrimaryKeys.filter(key => key != '');
        setSelectedPrimaryKeys(trimedData);

        const formData = new FormData();
        formData?.append('project_id', formik?.values?.project_id);
        formData?.append('file_name', formik?.values?.uploaded_fileName);
        formData?.append('file', file);
        formData?.append('primary_keys',trimedData);
        
        dispatch(uploadExcelSheetSlice(formData))
        .then((response)=>{
            console.log(response)
            if(response?.payload?.status === 200){
                message?.success('File Uploded',1)
                handleOk();
                formik?.resetForm();
                
                setFileType(null);
                setFile(null);
                setSheets([]);
            }
            else if(response?.payload?.status === 409) message?.info('Table name already exists please choose a different one',3)
            else if(response?.payload?.status === 423) message?.info('File name already exists please choose a different one',3)
            else message?.error('Internal Server Error')
        })
        .finally(()=>{
            dispatch(getFileSlice()).then((response)=>{
                if(response?.payload?.status === 200) loadFile(response);
                else message?.error('Fetching Files Failed')
            })
            setLoading(false);
        })
    }
 
    const  handleFormUploadCSV = async()=>{
        setLoading(true);
        if (!file)
        {
            message?.error('File Not Attached')
            return;
        }    
        const formData = new FormData();
        formData?.append('projectID', formik?.values?.project_id);
        formData?.append('fileName', formik?.values?.uploaded_fileName);
        formData?.append('delimiter', formik?.values?.delimiter);
        formData?.append('sheet', "N/A");
        formData?.append('fileStatus',formik?.values?.file_status)
        formData?.append('file', file); 

        dispatch(uploadCsvSheetSlice(formData))
        .then((response)=>{
            if(response?.payload?.status === 200){
                messageApi?.success('File Uploaded')
                handleOk();
                setFileType(null);
                setFile(null);
                setSheets([]);
                formik?.resetForm();
            }
            else{
                messageApi?.error('Error Encountered')
            }
        })
        .finally(()=>{
            dispatch(getFileSlice())
            .then((response)=>{
                if(response?.payload?.status === 200) loadFile(response);
                else message?.error('Fetching Files Failed')
            })
            setLoading(false);
        })
    }

    const handleFileChangeExcel = (event)=>{
        const file = event?.target?.files[0];
        if (file) {
            if(file?.name?.split('.').pop() === 'xls' || file?.name?.split('.').pop() === 'xlsx'){
                setLoading(true);
                const fileName = file?.name
                formik?.setFieldValue('uploaded_fileName',fileName);
                setFile(file);

                const formData = new FormData();
                formData?.append('file', file);
                dispatch(uploadExcelSlice(formData))
                .then((response)=>{
                    // here error must be handle
                    console.log(response)
                    if(response?.payload?.status === 200)
                    {
                        setSheets(response?.payload?.data);
                        const sheets = response?.payload?.data;
                        formik.setFieldValue('selected_sheet',sheets);
                    }
                    else{
                        message?.error(response?.payload?.message || 'Internal Server Error')
                    }
                })
                .finally(()=>{
                    setLoading(false);
                })
            }
            else{
                message?.error('Accepted extensions .xls or .xlsx');
            }
        }
        else 
        {
            message?.error('File Not Attached');
            setLoading(false);
        }
    }

    const handleFileChangeCsv = (event)=>{
        const file = event?.target?.files[0];
        if (file){
            if((file?.name?.split('.').pop() === 'csv' && fileType === 'CSV')){
                const fileName = file?.name
                formik?.setFieldValue('uploaded_fileName',fileName);
                setFile(file);
            }
            else{
                message?.error(`Accepted Type ${fileType} `)
            }
        }
        else{
            message?.error('File Not Attached');
        }
    }

    const handleProjectChange = (e)=>{
        formik?.setFieldValue('project_id',e)
    }

    const handleSelectedSheet = (e)=>{
        if(!file)
        {
            message?.error('File Not Attached')
            return;
        }   

        formik?.setFieldValue('selected_sheet',e)
        const formData = new FormData();
        formData?.append('file',file);
        formData?.append('sheet_name',e);
        
        dispatch(extractFirstColumnSlice(formData))
        .then((response)=>{
            if(response?.payload?.status === 404){
                message?.error('Error');
            }
            else if(response?.payload?.status === 200){
                const columns = response?.payload?.data?.first_row || [];
                setPrimaryKeys(columns);
            }
        })
    }

    const handleFileType = (e)=>{
        formik?.setFieldValue('file_type', e);
        setFileType(e);
        setFile('');
        setSheets([]);  
        formik?.setFieldValue('selected_sheet','');
        formik?.setFieldValue('uploaded_fileName','');
    }

    const handleFormTypeChange = (e)=>{
        formik?.setFieldValue('form_type',e);
    }

    const handleFileStatus = (e)=>{
        formik?.setFieldValue('file_status',e?.target?.value);
    }

    const handleSelectCheckbox = (e)=>{
        console.log(e)
        setSelectedPrimaryKeys(e);
    }
 
  return (
    <Spin spinning={loading} tip="Uploading...">
        {contextHolder}
        <h3 className="text-center"> File</h3>  
        <CustomSelectFormType value={formik?.values?.form_type} error={formik?.errors?.form_type} touched={formik?.touched?.form_type}
        handleChange={handleFormTypeChange}/>

       { formik?.values?.form_type === 'File' && <form onSubmit={formik.handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
        <CustomSelectProject  touched={formik?.touched?.project_id} error={formik?.errors?.project_id} 
        value={formik?.values?.project_id} handleChange={handleProjectChange} disabled={false} projects={allProjects}/>

        {/* <CustomRadioFileStatus value={formik.values.file_status} handleChange={handleFileStatus}
        touched={formik?.touched?.file_status} error={formik?.errors?.file_status}/> */}

        <CustomSelectFileType value={formik?.values?.file_type} handleChange={handleFileType} 
        touched={formik?.touched?.file_type} error={formik?.errors?.file_type}/>
  
        <div className="row mb-3">  
        <label htmlFor="filePath" className="col-4 col-form-label">File Path</label>  
        <div className="col-8 d-flex align-items-center">  
            <input  
                className="form-control me-2"  
                value={formik?.values?.uploaded_fileName}  
                readOnly  
                style={{ flex: '1 1 auto' }} 
            />  
         { fileType &&  <input  
                type="file"  
                className="form-control"  
                hidden id="browse"  
                onChange={fileType === 'Excel' ? handleFileChangeExcel : handleFileChangeCsv}  
            />  }
       { fileType &&    <label htmlFor="browse" className="form-control btn btn-outline-secondary" style={{ marginLeft: '5px' }}>  
                Browse  
            </label> 
       } 
        </div>  
        </div>  

        <CustomSelectCheckbox primaryKeys={sheets} handleChange={handleSelectCheckbox}/>
    
        <div className="d-flex justify-content-end" style={{ marginTop: "10px" }}>  
        {file && <Button type="primary" htmlType='submit'>Upload</Button>}  
        </div>  

    </form>}
       {formik?.values?.form_type === 'Connection' && alert('Connection Form File')}
</Spin>
  )
}
 
export default FormFile