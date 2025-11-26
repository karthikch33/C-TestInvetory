import React from 'react'
import { Modal } from 'antd'
import CustomInput from './CustomInput'
import FormFile from './Connections/FlatFile/FormFile'

export const CustomDeleteModal = (props) => {
    const {open,performAction,hideModal,title,okText,cancelText} = props
  return (
    <Modal
        open={open}
        title={title}
        onOk={performAction}
        onCancel={hideModal}
        okText={okText}
        cancelText={cancelText}
      >
      </Modal>
  )
} 

export const CustomCreateFormFileModal = (props)=>{
  const {openCreateModal,hideCreateModal,loadFiles} = props;
  return(
    <Modal
          open = {openCreateModal}
          footer = {null}
          onCancel={hideCreateModal}
          hideModal = {hideCreateModal}
          >
          <p><FormFile handleOk={hideCreateModal} loadFile={loadFiles}/></p>
      </Modal>
  )
}

export const CustomRenameModal = (props)=>{
  const {title,open,hideModal,onSubmit,value,name,handleChange,blur,touched,error} = props 
  return(
    <Modal
        title={title}
        open={open}
        onCancel={hideModal}
        onOk={onSubmit}
        hideModal={hideModal}
        okText="OK"
        cancelText="CANCEL">
            <form onSubmit={onSubmit}>
                <CustomInput label='Change Name' type="text" value={value} name={name}
                handleChange={handleChange} blur={blur} disabled={false} touched={touched}
                error={error}/>
            </form>  
    </Modal>
  )
}
