 import React from 'react'
import Navbar from './components/Navbar/Navbar'
import { Routes } from 'react-router-dom'
 
 function App() {
   return (
     <div className='app'> 
      <Navbar></Navbar>
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
       
     </div>
   )
 }
 
 export default App
 