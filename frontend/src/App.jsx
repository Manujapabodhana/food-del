import React from 'react'
import Navbar from './components/Navbar/Navbar'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/cart/cart'
import PlaceOrder from './pages/placeOrder/PlaceOrder'
 
 function App() {
   return (
     <div className='app'> 
      <Navbar></Navbar>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/placeOrder' element={<PlaceOrder />} />
      </Routes>
       
     </div>
   )
 }
 
 export default App
 