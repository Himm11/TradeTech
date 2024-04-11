import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "./upload_area.svg";

const AddProduct = () => {

  const[image,setImage] = useState(false);

  const [productDetails,setProductDetails] = useState({
    name:"",
    image:"",
    price:"",
});

  const imageHandler = (e) => {
      //Set image that we have selected; will be added to above image state
    setImage(e.target.files[0]);
    }

    //Update details
  const changeHandler = (e) => {
    console.log(e);
    setProductDetails({...productDetails,[e.target.name]:e.target.value});
    }

  //for add button 
  //on clicking add button, the product details will be sent back in json format to console
  const Add_Product = async () => {
      console.log(productDetails);

      //to send product details back to backend and save in database
      let responseData;
      //Taking a copy of product object
      let product=productDetails;

      let formData=new FormData();
      //append in the image in formData
      formData.append('product', image);

      //Sending formData to API
      await fetch('http://localhost:4000/upload', {
      method: 'POST',
      headers: {
        Accept:'application/json',
      },
      body: formData,
    })
      .then((resp) => resp.json())   //get parsed data
      .then((data) => {responseData=data});
      //we will fet image url and success as true or false

      if (responseData.success) {  //i.e., image has been stored in the multer storage system
        //getting url of image
        product.image = responseData.image_url;
        console.log(product);
        await fetch('http://localhost:4000/addproduct',{
            method:'POST',
            headers:{
                Accept:'application/json',
                'Content-Type':'application/json',
            },
             body:JSON.stringify(product),
        })
        .then((resp)=>resp.json())
        .then((data)=>{
            data.success?alert("Product Added"):alert("Failed")
        })

      }
  }
   


  return (
    <div className="addproduct">
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input type="text" name="name" value={productDetails.name} onChange={changeHandler} placeholder="Type here" />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input type="text" name="price" value={productDetails.price} onChange={changeHandler} placeholder="Type here" />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Image</p>
        <label for="file-input">
          <img className="addproduct-thumbnail-img" src={image?URL.createObjectURL(image):upload_area} alt="" />
        </label>
        <input onChange={imageHandler} type="file" name="image" id="file-input" hidden />
      </div>
      <button className="addproduct-btn" onClick={()=>{Add_Product()}}>UPLOAD</button>
    </div>
  );
};

export default AddProduct;
