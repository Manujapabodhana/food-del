import React, { useContext} from 'react'
import './FoodItem.css'
import {assets} from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext'

const FoodItem = ({id,name,price,description,image}) => {

    const {cartItems, addToCart, removeFromCart, url} = useContext(StoreContext)
    const getImageSrc = (img) => {
        if (!img) return '';
        const str = String(img);
        if (str.startsWith('http') || str.startsWith('/') || str.includes('/assets/')) {
            return str;
        }
        return url + "/images/" + str;
    }


  return (
    <div className='food-item'>
        <div className="food-item-img-container">
            <img className='food-item-image' src={getImageSrc(image)} alt={name} />
            {!cartItems[id]
            ?<img className='add' onClick={() => addToCart(id)} src={assets.add_icon_white} alt="add" />
            :<div className='food-item-counter'>
                <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red}/>
                <p>{cartItems[id]}</p>
                <img onClick={() => addToCart(id)} src={assets.add_icon_green}/>
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
