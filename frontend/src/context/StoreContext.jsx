import { createContext, useState } from "react";
import { food_list, menu_list } from "../assets/assets";

const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    
    const addToCart = (itemId) => {
        if(!cartItems[itemId]) {
            setCartItems((prev) => ({...prev, [itemId]: 1}));
        } else {
            setCartItems((prev) => ({...prev, [itemId]: prev[itemId] + 1}));
        }
    }

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({...prev, [itemId]: prev[itemId] - 1}))
    }
    
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    }

    const placeOrder = (deliveryData) => {
        console.log(deliveryData);
    }

    const contextValue = {
        food_list,
        menu_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        placeOrder
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export { StoreContext };
export default StoreContextProvider;
