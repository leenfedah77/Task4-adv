import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'
import './index.css'
//import App from './App.tsx'
//import AuthRoot from './pages/AuthRoot.tsx'
import Login from "./pages/Login.tsx"
import Signup from "./pages/Signup.tsx"
//import Register from './pages/Dashboard.tsx'
//import Show from './pages/Show.tsx'
import Dashboard from './pages/Dashboard.tsx'
import ReadItems from './pages/ReadItems.tsx'
import AddItem from './pages/AddItem.tsx'
//import AddTasks from './pages/AddTasks.tsximport EditTask from './pages/EditTask.tsx'
import Edit from './pages/Edit.tsx'
import Show from './pages/Show.tsx'
/*createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)*/
const router = createBrowserRouter([
 {
  path:"/",
  element:<Login/>,},
  {
    path:"/signup",
    element:<Signup/>,
  },
  
  
  
  {
    path:"/dashboard",
    element:<Dashboard/>,
    children:[
      {
        path:"",
        element:<ReadItems/>
      },
      {
        path:"add",
       element:<AddItem/>
      },
      {
        path:"edit/:id",
       element:<Edit/>
      },
      
      {
        path:"show/:id",
       element:<Show/>
      },
    ]
  },
//{
      //  path:"items:id",
       // element:<ReadItems/>
      //},
      //{
        //path:"/show",
        //element:<Show/>
      //},
      
    
  
  
  
  //,{
   // path:"/additem",
   // element:<AddItem/>,
  //},

  //{
   // path:"/delete",
   // element:</>,
  //},
  //{
  //  path:"/edit",
 //   element:<Edit/>,
 // },
  
   /* children:[
      {
    path:"",
    element:<Login/>
      
      }
    ],*/
      
              
              
  
  ])
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <RouterProvider router={router}/>
    </StrictMode>
  )
  
