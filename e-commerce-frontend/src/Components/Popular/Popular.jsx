import React,{useState, useEffect} from 'react'
import './Popular.css'
import Item from '../Item/Item'

const Popular = () => {
   const [newcollection,setNew_collection]=useState([]);

   useEffect(()=>{
     fetch('http://localhost:4000/newcollection')
     .then((response)=>response.json())
     .then((data)=>setNew_collection(data));
   },[])

  return (
    <div className='popular'>
      <h1>RECENTLY ADDED</h1>
      <hr />
      <div className="popular-item">
        {newcollection.map((item,i)=>{
            return <Item key={i} id={item.id} name={item.name} image={item.image} price={item.price} />
        })}
      </div>
    </div>
  )
}

export default Popular
