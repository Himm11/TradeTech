//This file connect the backend to the frontend

import React, { createContext, useEffect, useState } from "react";

export const ShopContext =  createContext(null);


const getDefaultCart = ()=>{
    let cart = {};
    for (let index = 0; index < 300+1; index++) {
        cart[index] = 0;
    }
    return cart;
}


const ShopContextProvider = (props) => {
    //Store all product data in all_product state variable
    const[all_product,setAll_Product]=useState([]);

    const [cartItems,setCartItems] = useState(getDefaultCart());

    useEffect(() => {
        fetch('http://localhost:4000/allproducts')
            .then((response) => response.json())
            .then((data) => {
                console.log("Fetched Product Data:", data); // Log fetched product data
                setAll_Product(data); // Set fetched product data in state
            })
            .catch((error) => {
                console.error("Error fetching product data:", error); // Log any errors that occur during fetching
            })

            if(localStorage.getItem('auth-token')){
                //if logged in
                fetch('http://localhost:4000/getcart',{
                    //Get data from the cart
                    method:'POST',
                    headers:{
                        Accept:'application/form-data',
                        'auth-token':`${localStorage.getItem('auth-token')}`,
                        'Content-Type':'application/json',
                    },
                    body:"",
                }).then((response)=>response.json())
                //Save the cart info
                .then((data)=>setCartItems(data))
            }
            
    }, []);
    
    
    const addToCart = (itemId) =>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}));
       if(localStorage.getItem('auth-token')){
           //If auth-token present, that means we are logged in
           fetch('http://localhost:4000/addtocart',{
               method:'POST',
               headers:{
                   Accept:'application/form-data',
                   'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
               },
               body:JSON.stringify({"itemId":itemId}),
           })
           .then((response)=>response.json())
           .then((data)=>console.log(data)); 

       }
    }

    const removeFromCart = (itemId) =>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
        //if auth-token available
        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/removefromcart',{
               method:'POST',
               headers:{
                   Accept:'application/form-data',
                   'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
               },
               body:JSON.stringify({"itemId":itemId}),
           })
           .then((response)=>response.json())
           .then((data)=>console.log(data)); 

        }
    }
    
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
          if (cartItems[item] > 0) {
            let itemInfo = all_product.find((product) => product.id === Number(item));
            totalAmount += cartItems[item] * itemInfo.price;
          }
        }
        return totalAmount;
      }

      const getTotalCartItems = () =>{
        let totalItem = 0;
        for(const item in cartItems)
        {
            if(cartItems[item]>0)
            {
                totalItem+= cartItems[item];
            }
        }
        return totalItem;
      }


    //data will be passed to this variable
    const contextValue = {getTotalCartItems,getTotalCartAmount,all_product,cartItems,addToCart,removeFromCart};
    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;