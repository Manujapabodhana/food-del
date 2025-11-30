import React, { useContext, useEffect, useState, useCallback } from 'react'
import './MyOrders.css'
import axios from 'axios'
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  
  const [data,setData] =  useState([]);
  const {url,token,currency} = useContext(StoreContext);

  const fetchOrders = async () => {
    console.log("Fetching orders...");
    console.log("URL:", url);
    console.log("Token:", token);
    
    if (!token) {
      console.error("No token found - user not logged in");
      return;
    }
    
    try {
      const response = await axios.post(url+"/api/order/userorders",{},{headers:{token}});
      console.log("Orders response:", response.data);
      if (response.data.success) {
        setData(response.data.data);
        console.log("Orders fetched:", response.data.data);
        console.log("Number of orders:", response.data.data.length);
      } else {
        console.error("Failed to fetch orders:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      console.error("Error details:", error.response?.data);
    }
  };

  useEffect(()=>{
    console.log("MyOrders component mounted");
    console.log("Token in useEffect:", token);
    if (token) {
      fetchOrders();
    } else {
      console.log("No token available, skipping fetch");
    }
  },[token])

  return (
    <div className='my-orders'>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h2>My Orders</h2>
        <button onClick={fetchOrders} style={{padding: '10px 20px', cursor: 'pointer'}}>
          Refresh Orders
        </button>
      </div>
      <div className="container">
        {!token ? (
          <p>Please login to view your orders.</p>
        ) : data.length === 0 ? (
          <p>No orders found. Place your first order!</p>
        ) : (
          data.map((order,index)=>{
            return (
              <div key={index} className='my-orders-order'>
                  <img src={assets.parcel_icon} alt="" />
                  <p>{order.items.map((item,index)=>{
                    if (index === order.items.length-1) {
                      return item.name+" x "+item.quantity
                    }
                    else{
                      return item.name+" x "+item.quantity+", "
                    }
                    
                  })}</p>
                  <p>{currency}{order.amount}.00</p>
                  <p>Items: {order.items.length}</p>
                  <p><span>&#x25cf;</span> <b>{order.status}</b></p>
                  <button onClick={fetchOrders}>Track Order</button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default MyOrders
