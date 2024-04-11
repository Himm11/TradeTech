import React, { useEffect, useState } from "react";
import "./ListProduct.css";
import cross_icon from './cross_icon.png'

const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]);


  //Fetch data from API and save it in setAllProducts
  const fetchInfo = async() => { 
    fetch('http://localhost:4000/allproducts') 
            .then((res) => res.json()) 
            .then((data) => setAllProducts(data))
    }

    useEffect(() => {
      fetchInfo();
    }, [])  //placing sqaure brackets because we only want this exceuted once

    const removeProduct = async (id) => {
      await fetch('http://localhost:4000/removeproduct', {
      method: 'POST',
      headers: {
        Accept:'application/json',
        'Content-Type':'application/json',
      },
      body: JSON.stringify({id:id}),
    })

    await fetchInfo();

    }

  return (
    <div className="listproduct">
      <h1>DISPLAYING ALL PRODUCTS</h1>
      <div className="listproduct-format-main">
          <p>Products</p>
          <p>Title</p>
          <p>Price</p>
          <p>Remove</p>
        </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product,index) => {
          return <>
              <div key={index} className="listproduct-format-main listproduct-format">
                <img className="listproduct-product-icon" src={product.image} alt="" />
                <p cartitems-product-title>
                  {product.name}</p>
                <p>₹{product.price}</p>
                <img className="listproduct-remove-icon" onClick={()=>{removeProduct(product.id)}} src={cross_icon} alt="" />
            </div>
            <hr />
            </>
        })}
        </div>
    </div>
  )}
        

export default ListProduct;
