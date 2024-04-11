import React, {useState} from 'react'
import './CSS/LoginSignup.css'

const LoginSignup = () => {

  const[state,setState]=useState("Login");
  
  //input field data for login/sign up page
  const[formData,setFormData]=useState({
    username:"",
    password:"",
    email:""
  })

  //To get data from the input field
  //Using change handler, we update the fields of setFormData
  const changeHandler = (e) =>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }
  //To add to backend
  const login=async()=>{
    //On execution of this function, we will update the formData
    console.log("Login Function executed.",formData)

    let responseData;

    await fetch('http://localhost:4000/login',{
      method:'POST',
      headers:{
        Accept:'application/form-data',
        'Content-Type':'application/json',
      },
      body:JSON.stringify(formData),
    })
    .then((response)=>response.json())
    //Parsed data will be saved in responseData
    .then((data)=>responseData=data)
     
    //Auth-token will be saved
    if(responseData.success){
      localStorage.setItem('auth-token',responseData.token);
      //When signed in; user will be transported to home page 
      window.location.replace("/");
    }
    else{
      alert(responseData.errors)
    }


  }

  const signup=async()=>{
    console.log("Sign Up Function executed.",formData);

    let responseData;

    await fetch('http://localhost:4000/signup',{
      method:'POST',
      headers:{
        Accept:'application/form-data',
        'Content-Type':'application/json',
      },
      body:JSON.stringify(formData),
    })
    .then((response)=>response.json())
    //Parsed data will be saved in responseData
    .then((data)=>responseData=data)
     
    //Auth-token will be saved
    if(responseData.success){
      localStorage.setItem('auth-token',responseData.token);
      //When signed in; user will be transported to home page 
      window.location.replace("/");
    }
    else{
      alert(responseData.errors)
    }

  }
  
  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state==="Sign Up"?<input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder='Your Name' />:<></>}
          <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder='Email Address' />
          <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder='Password' />
        </div>
        <button onClick={()=>{state==="Login"?login():signup()}}>Continue</button>
        {state==="Sign Up"?
        <p className="loginsignup-login">Already have an account? <span onClick={()=>{setState("Login")}}>Login here</span></p>:
        <p className="loginsignup-login">Create an account <span onClick={()=>setState("Sign Up")}> Click here</span></p>}
        
        <div className="loginsignup-agree">
          <input type="checkbox" name='' id='' />
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  )
}

export default LoginSignup
