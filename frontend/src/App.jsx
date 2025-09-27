import React from 'react'
import Navbar from './components/Navbar/Navbar'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/cart/cart'
import PlaceOrder from './pages/placeOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import StoreContextProvider from './context/StoreContext'
 
function App() {
   return (
     <StoreContextProvider>
       <div className='app'> 
         <Navbar></Navbar>
         <Routes>
           <Route path='/' element={<Home />} />
           <Route path='/cart' element={<Cart />} />
           <Route path='/placeOrder' element={<PlaceOrder />} />
         </Routes>
         <Footer />
       </div>
     </StoreContextProvider>
   )
 }
 
 export default App
 