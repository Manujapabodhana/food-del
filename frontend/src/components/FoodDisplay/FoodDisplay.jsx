import React, { useContext } from 'react'
import './FoodDisplay.css'

function FoodDisplay() {

    const {food_list} = useContext(StoreContext)
  return (
    <div className='food-display' id='food-display'>
        <h2>Top dishes near your</h2>
      
    </div>
  )
}

export default FoodDisplay
