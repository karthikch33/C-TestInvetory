import { Radio } from "antd"

export const CustomRadioFileStatus = (props)=>{
    const {value,handleChange,touched,error} = props
    return(
        <>
            <div className="row my-3">
               <label htmlFor="form_status" className="col-4 col-form-label">Form Status</label>
                <div className="col-8 mt-2">
                    <Radio.Group
                    name="form_status"
                    value={value}
                    onChange={handleChange}
                    >
                        <Radio value={'preload'}>PreLoad</Radio>
                        <Radio value={'postload'}>PostLoad</Radio>
                        <Radio value={'source'}>Source</Radio>
                    </Radio.Group>
                <div className="error" style={{overflowX : 'auto'}}>{touched && error}</div>
                </div>
            </div>
        </>
    )
}