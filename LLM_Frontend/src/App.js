import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import FlatFile from './components/pages/Connections/FlatFile/flatFile';
import AppLayout from './components/layout/AppLayout/AppLayout';
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
        <BrowserRouter>
          <Routes>
            {/* MainScreen Route*/}
            <Route path="/" element={<AppLayout/>} >
              <Route index element={<LandingPage/>}/>
              <Route path='/pagenotfound' element={<PageNotFound/>}/>
            </Route>

            {/* Project Routes */}
            <Route path='/project' element={<AppLayout/>}>
            <Route path='manageprojects' element={<ManageProjects/>}/>
            </Route>

            {/* Connections Routes */}
            <Route path="/connections" element={<AppLayout/>}>
              <Route path='flatfile' element={<FlatFile/>} />
            </Route>
            
            {/* Workspace Routes*/}
            <Route path="/workspace" element={<AppLayout/>}>
            <Route index element={<WorkSpaceLayout/>}/>
            </Route>

          </Routes>

        </BrowserRouter>
    </>
  );
}

export default App;
