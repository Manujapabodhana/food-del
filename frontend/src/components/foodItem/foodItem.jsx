import React, { useState } from 'react'
import './foodItem.css'
import {assets} from '../../assets/assets'

const FoodItem = ({id,name,price,description,image}) => {

    const[ itemCount,setItemCount] = useState(0)
  return (
    <div className='food-item'>
        <div className="food-item-img-container">
            <img className='food-item-image' src={image} alt={name} />
            {!itemCount
            ?<img className='add' onClick={()=>setItemCount(prev=>prev+1)} src={assets.add_icon_white} alt="add" />
            :<div className='food-item-counter'>
                <img onClick={()=>setItemCount(prev=>prev-1)} src={assets.remove_icon_red}/>
                <p>{itemCount}</p>
                <img onClick={()=>setItemCount(prev=>prev+1)} src={assets.add_icon_green}/>
            </div>
}
        </div>
        <div className="food-item-info">
            <div className="food-item-name-rating">
                <p>{name}</p>
                <div className="rating">
                    <img src={assets.rating_starts} alt="rating" />
                </div>
            </div>

            <p className="food-item-desc">{description}</p>
            <p className='food-item-price'>${price}</p>
            
        </div>
    </div>
  )
}

export default FoodItem
