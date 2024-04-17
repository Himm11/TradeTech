import React, { useContext } from 'react'
import './CSS/ShopCategory.css'
import { ShopContext } from '../Context/ShopContext'
import dropdown_icon from '../Components/Assets/dropdown_icon.png'
import Item from '../Components/Item/Item'
import new_collection from '../Components//Assets/new_collections'
import ChatBot from '../Components/ChatBot/ChatBot'

const ShopCategory = (props) => {
  const {all_product} = useContext(ShopContext);
  // Debugging statement to check if products are available
  console.log("All Products:", all_product);

  return (
    
    <div className='shop-category'>

    <div className="additional-products">
        <h2>Recommended Products</h2>
        </div>
        <div className="add-products">
        {new_collection.map((item,i)=>{
            return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
        })}
      </div>

      <div className="shopcategory-indexSort">
        <h2>
          <span>Showing all products</span>
        </h2>
      </div>
      <div className="shopcategory-products">
        {all_product.map((item,i)=>{
            return <Item key={i} id={item.id} name={item.name} image={item.image} price={item.price} />

        })}
      </div>
      <ChatBot/>

      
    </div>


  )
}

export default ShopCategory
