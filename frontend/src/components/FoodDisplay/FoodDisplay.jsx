import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'

const FoodDisplay = ({category}) => {

    const {food_list} = useContext(StoreContext)
  return (
    <div className='food-display' id='food-display'>
        <h2>Top dishes near you</h2>
        <div className="food-display-list">
            {food_list.map((item, index) => {
                if (category === "All" || category === item.category) {
                    return (
                        <div key={index} className='food-item'>
                            <img src={item.image} alt={item.name} />
                            <div className="food-item-info">
                                <div className="food-item-name-rating">
                                    <p>{item.name}</p>
                                    <img src="/src/assets/rating_starts.png" alt="rating" />
                                </div>
                                <p className="food-item-desc">{item.description}</p>
                                <p className="food-item-price">${item.price}</p>
                            </div>
                        </div>
                    )
                }
            })}
        </div>
    </div>
  )
}

export default FoodDisplay
