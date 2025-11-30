import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//config variables
const currency = "usd";
const deliveryCharge = 5;
const frontend_URL = 'http://localhost:5173';

// Placing User Order for Frontend using stripe
const placeOrder = async (req, res) => {

    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Delivery Charge"
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${frontend_URL}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_URL}/verify?success=false&orderId=${newOrder._id}`,
            line_items: line_items,
            mode: 'payment',
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// Placing User Order for Frontend using COD
const placeOrderCod = async (req, res) => {

    try {
        console.log("=== COD Order Placement ===");
        console.log("UserId:", req.body.userId);
        console.log("Items:", req.body.items);
        console.log("Amount:", req.body.amount);
        console.log("Address:", req.body.address);
        
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            payment: true,
        })
        await newOrder.save();
        console.log("Order saved successfully with ID:", newOrder._id);
        
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });
        console.log("Cart cleared for user:", req.body.userId);

        res.json({ success: true, message: "Order Placed" });

    } catch (error) {
        console.log("Error placing COD order:", error);
        res.json({ success: false, message: "Error" })
    }
}

// Listing Order for Admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// User Orders for Frontend
const userOrders = async (req, res) => {
    try {
        console.log("=== Fetching User Orders ===");
        console.log("UserId:", req.body.userId);
        
        const orders = await orderModel.find({ userId: req.body.userId });
        console.log("Orders found:", orders.length);
        console.log("Orders data:", JSON.stringify(orders, null, 2));
        
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log("Error fetching user orders:", error);
        res.json({ success: false, message: "Error" })
    }
}

const updateStatus = async (req, res) => {
    console.log("=== Updating Order Status ===");
    console.log("Request body:", req.body);
    console.log("Order ID:", req.body.orderId);
    console.log("New Status:", req.body.status);
    
    try {
        const updatedOrder = await orderModel.findByIdAndUpdate(
            req.body.orderId, 
            { status: req.body.status },
            { new: true } // Return the updated document
        );
        
        if (updatedOrder) {
            console.log("Order updated successfully:", updatedOrder._id);
            console.log("New status:", updatedOrder.status);
            res.json({ success: true, message: "Status Updated" })
        } else {
            console.log("Order not found");
            res.json({ success: false, message: "Order not found" })
        }
    } catch (error) {
        console.log("Error updating status:", error);
        res.json({ success: false, message: "Error: " + error.message })
    }

}

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid" })
        }
        else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({ success: false, message: "Not Paid" })
        }
    } catch (error) {
        res.json({ success: false, message: "Not  Verified" })
    }

}

export { placeOrder, listOrders, userOrders, updateStatus, verifyOrder, placeOrderCod }