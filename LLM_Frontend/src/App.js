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
  
    // useEffect(() => {
    //   const fetchProjects = async () => {
    //     try {
    //       // unwrap() throws automatically if thunk rejected
    //       await dispatch(getProjectsSlice()).unwrap();
  
    //     } catch (error) {
    //       // ERROR HANDLING
    //       if (error?.status === 404) {
    //         toast.info("No projects found");
    //       } else if (error?.status === 500) {
    //         toast.error("Server error while loading projects");
    //       } else {
    //         toast.error(error?.message || "Failed to load projects");
    //       }
    //     }
    //   };
  
    //   fetchProjects();
    // }, [dispatch]);
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
