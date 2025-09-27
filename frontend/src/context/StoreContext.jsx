import { createContext}  from "react";
import { food_list } from "../assets/assets";   

export const StoreContext = createContext(null)


const StoreContextProvider = (props) => {


    const [cardItems, setCardItems] = useState({});

    const addToCart = (itemId) => {
        if (!CartItems[itemId]) {
            setCardItems(prev => ({ ...prev, [itemId]: 1 }))
        }
        else{
            setCardItems(prev => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }
    }


    const removeFromCart = (itemId) => {
        setCardItems(prev) =>({...prev, [itemId]: prev[itemId] - 1 })

    const contextValue = {

        food_list,
        cardItems,
        setCardItems,
        addToCart,
        removeFromCart

    }


    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}
export default StoreContextProvider