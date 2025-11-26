import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { getExecuteQueriesSlice, getTableDataSlice } from '../../features/WorkSpace/workSpaceSlice';
import { EditableChat } from '../Bussiness Rules/EditableCell';
import { message } from 'antd';

const Chat = (props) => {
const {file_id,setResponseTableDataRowsWithIndex,setResponseTableDataColumns} = props;
const [messagess, setMessages] = useState([]);
const dispatch = useDispatch();

const getFormattedTime = () => {  
    const now = new Date();  
    return now?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });  
  }; 

  const handleSendMessage = (messages) => {  
    if (messages && messages.trim()){  
      setMessages(prev => [  
        ...prev,   
        {   
          id: Date.now(),   
          text: messages,   
          sender: 'me',   
          type: 'sent',     
          time: getFormattedTime()   
        }  
      ]);  

      const data = {
       file_id : file_id,
        message : {
            prompt : messages
        }
      }

      dispatch(getExecuteQueriesSlice(data))
    .then((response)=>{
    if(response?.payload?.status === 200) {
    const rows = response?.payload?.data?.rows || [];
    const cols = response?.payload?.data?.columns || [];
    const selected = response?.payload?.data?.["selected rows"] || [];

    setResponseTableDataColumns(cols);
    setResponseTableDataRowsWithIndex(rows);

    setMessages(prev => [
      ...prev,
      {
        id: Date.now() + 1,
        text: `✅ ${selected[0]} rows × ${selected[1]} columns Selected`,
        sender: 'system',
        type: 'received',
        time: getFormattedTime()
      }
    ]);
  }
  else console.log('Error');
})

    }
  };
  const messagessEndRef = useRef(null);  

  useEffect(() => {  
        if (messagessEndRef.current) messagessEndRef.current.scrollTop = messagessEndRef.current.scrollHeight;
    }, [messagess]);

  return (
    <div className="col-12 col-md-3 d-flex flex-column h-100 w-100">  
  <div className="flex-grow-1 border rounded shadow-sm overflow-hidden">  
    <div className="d-flex flex-column h-100 position-relative">       
      <div className="background-image"></div>  
      <div className="flex-grow-1 overflow-auto p-3 content" ref={messagessEndRef}>  
        {messagess?.map(msg => (  
          <div  
            key={msg?.id}  
            className={`d-flex ${msg.sender === 'me' ? 'justify-content-end' : 'justify-content-start'}`}  
          >  
            <div className={`p-1 rounded ${msg.type === 'sent' ? 'text-dark' : 'bg-light text-dark'}`} style={{ fontSize: "10px" }}>  
              {msg?.text}  
              <div className={`small text-end ${msg.type === 'sent' ? 'text-muted' : 'text-secondary'}`} style={{ fontSize: "8px" }}>  
                {msg?.time}  
              </div>  
            </div>  
          </div>  
        ))}  
      </div>  
      <EditableChat onUpdate={handleSendMessage} />  
    </div>  
  </div>  
</div>  
  )
}

export default Chat