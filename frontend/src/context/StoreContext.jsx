import { useEffect, useState } from "react";
import { menu_list, food_list as localFoodList } from "../assets/assets";
import axios from "axios";
import StoreContext from "./StoreContextValue";
export { StoreContext };

const StoreContextProvider = (props) => {

    const url = "http://localhost:4000"
    const [food_list, setFoodList] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("")
    const currency = "$";
    const deliveryCharge = 5;

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            try {
              if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) {
                  totalAmount += itemInfo.price * cartItems[item];
                } else {
                  console.warn("Item not found in food_list:", item);
                }
            }  
            } catch (error) {
                console.error("Error calculating cart total for item", item, error);
            }
            
        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(url + "/api/food/list");
            if (response?.data?.success && response.data.data?.length > 0) {
                // If backend returns few items, combine with local items for better demo
                const backendFoods = response.data.data || [];
                const combined = backendFoods.concat(localFoodList.filter(lf => !backendFoods.some(bf => bf.name === lf.name)));
                setFoodList(combined);
            } else {
                console.warn('No foods from backend, using static food list.');
                setFoodList(localFoodList);
            }
        } catch (error) {
            console.error('Fetch food list error, using static localFoodList', error);
            setFoodList(localFoodList);
        }
    }

    const loadCartData = async (token) => {
        try {
            // Accept token as either a string, or as an object containing { token: <string> }
            let headersObj = {}
            if (typeof token === 'string') {
                headersObj = { token };
            } else if (token && typeof token === 'object') {
                headersObj = token.token ? { token: token.token } : token;
            }
            const response = await axios.post(url + "/api/cart/get", {}, { headers: headersObj });
            if (response.data.success) {
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            console.error('Error loading cart data:', error);
            // Initialize with empty cart if loading fails
            setCartItems({});
        }
    }

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"))
                await loadCartData({ token: localStorage.getItem("token") })
            }
        }
        loadData()
    }, [])

    // Keep axios default headers up-to-date with current token (so we don't have to add headers everywhere)
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['token'] = token;
        } else {
            delete axios.defaults.headers.common['token'];
        }
    }, [token]);

    const contextValue = {
        url,
        food_list,
        menu_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        loadCartData,
        setCartItems,
        currency,
        deliveryCharge
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )

}

export default StoreContextProvider;