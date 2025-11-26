import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import FlatFile from './components/pages/Connections/FlatFile/flatFile';
import MainScreen from './components/pages/MainScreen/MainScreen';
import LandingPage from './components/pages/LandingPage';
import ManageProjects from './components/pages/Project/ManageProjects';
import { useEffect } from 'react'; 
import { useDispatch } from 'react-redux';
import { getProjectsSlice } from './components/features/Project/projectSlice';
import PageNotFound from './components/pages/PageNotFound';
import WorkSpaceLayout from './components/pages/WorkSpace/WorkSpaceLayout';


function App() {      
      const dispatch = useDispatch();
      useEffect(()=>{
        dispatch(getProjectsSlice())
},[dispatch]); 
  
  return (
    <>
    {/* {contextHolder} */}
        <BrowserRouter>
          <Routes>
            {/* MainScreen Route*/}
            <Route path="/" element={<MainScreen/>} >
              <Route index element={<LandingPage/>}/>
              <Route path='/pagenotfound' element={<PageNotFound/>}/>
            </Route>

            {/* Project Routes */}
            <Route path='/project' element={<MainScreen/>}>
            <Route path='manageprojects' element={<ManageProjects/>}/>
            </Route>

            {/* Connections Routes */}
            <Route path="/connections" element={<MainScreen/>}>
              <Route path='flatfile' element={<FlatFile/>} />
            </Route>
            
            {/* Workspace Routes*/}
            <Route path="/workspace" element={<MainScreen/>}>
            <Route index element={<WorkSpaceLayout/>}/>
            </Route>


            {/* Business Rules Routes}*/}
            {/* <Route path='/bussinessrules' element={<MainScreen/>}>
                  <Route path='create' element={<CreateBussinessRules/>}/>
                  <Route path='create/:project_id' element={<CreateBussinessRules/>}/>
                  <Route path='reupload' element={<CreateBussinessRules/>}/>
                  <Route path='reupload/:project_id' element={<CreateBussinessRules/>}/>
                  <Route path='manage' element={<ManageBussinessRules/>}/>
                  <Route path='views' element={<ViewBussinessRule/>}/>
                  <Route path='views/:project_id/:object_id' element={<ViewBussinessRule/>}/>
            </Route> */}


          </Routes>

        </BrowserRouter>
    </>
  );
}

export default App;
