import React, { useContext, useEffect, useState, useCallback } from 'react'
import './MyOrders.css'
import axios from 'axios'
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  
  const [data,setData] =  useState([]);
  const [trackingOrderId, setTrackingOrderId] = useState(null);
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

  const trackOrder = async (orderId) => {
    setTrackingOrderId(orderId);
    console.log("Tracking order:", orderId);
    
    // Store old status to compare
    const oldOrder = data.find(order => order._id === orderId);
    const oldStatus = oldOrder?.status;
    
    try {
      // Fetch latest orders from backend to get updated status
      const response = await axios.post(url+"/api/order/userorders",{},{headers:{token}});
      
      if (response.data.success) {
        setData(response.data.data);
        
        // Find the specific order to show its status
        const updatedOrder = response.data.data.find(order => order._id === orderId);
        if (updatedOrder) {
          console.log("Order status updated:", updatedOrder.status);
          
          // Check if status actually changed
          if (oldStatus && oldStatus !== updatedOrder.status) {
            // Status changed - show specific notification
            if (updatedOrder.status === "Delivered") {
              alert("🎉 Great News! Your order has been delivered!");
            } else if (updatedOrder.status === "Out for delivery") {
              alert("🚚 Your order is now out for delivery!");
            } else if (updatedOrder.status === "Food Processing") {
              alert("👨‍🍳 Your order is being prepared!");
            } else {
              alert(`📦 Order Status Updated: ${updatedOrder.status}`);
            }
          } else {
            // No change - just show current status
            if (updatedOrder.status === "Delivered") {
              alert("✅ Your order has been delivered!");
            } else if (updatedOrder.status === "Out for delivery") {
              alert("🚚 Your order is out for delivery!");
            } else if (updatedOrder.status === "Food Processing") {
              alert("👨‍🍳 Your order is being prepared!");
            } else {
              alert(`📦 Current Status: ${updatedOrder.status}`);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error tracking order:", error);
      alert("❌ Failed to update order status. Please try again.");
    }
    
    // Clear tracking state
    setTimeout(() => {
      setTrackingOrderId(null);
    }, 1500);
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
                  <p className={`order-status ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    <span>&#x25cf;</span> <b>{order.status}</b>
                  </p>
                  <button 
                    onClick={() => trackOrder(order._id)}
                    disabled={trackingOrderId === order._id}
                    className={trackingOrderId === order._id ? 'tracking' : ''}
                  >
                    {trackingOrderId === order._id ? '🔄 Tracking...' : 'Track Order'}
                  </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default MyOrders
