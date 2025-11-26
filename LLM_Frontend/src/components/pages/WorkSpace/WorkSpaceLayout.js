import{ useState } from 'react';  
import { Tabs } from 'antd';  
import WorkSpace from './WorkSpace';

const WorkSpaceLayout = () => {  
  const current_tab = localStorage.getItem('current_tab') ? localStorage?.getItem('current_tab') : '1';
  const [key,setKey] = useState(current_tab); 

  // useEffect(()=>{
  //       const handleBeforeUnload = (event) => {
  //           event.preventDefault();
  //           event.returnValue = "Are you sure you want to leave?";
  //       };
  //       window.addEventListener('beforeunload', handleBeforeUnload);
  //       return () => {
  //           window.removeEventListener('beforeunload', handleBeforeUnload);
  //       };
  //   },[]);
  
  const onChange = (key) => {  
    setKey(key) 
    localStorage.setItem('current_tab', key);
  };  
  const workspacesData = [  
    {  
      id: "1",  
      label: "WorkSpace",  
      children: <WorkSpace setKey={onChange}/>,  
    }
  ];

  return (  
    <Tabs  
      defaultActiveKey={"1"} 
      activeKey={key}
      onChange={onChange}  
      type="card"  
      className='p-1'
      items={workspacesData.map(({ id, label, children }) => ({  
        key: id, 
        label: label,   
        children: children,
      }))}  
    />  
  );  
};  

export default WorkSpaceLayout;  