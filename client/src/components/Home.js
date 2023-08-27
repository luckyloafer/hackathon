import React from 'react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom';
import io from 'socket.io-client'
const socket = io.connect('http://localhost:3001')
let room="";
let setRoom=""
const url1= 'https://tse1.mm.bing.net/th?id=OIP.j14GSop07qOYX6Q9h04LhwHaF6&pid=Api&P=0&h=180'
     const url2= 'https://www.melaniecooks.com/wp-content/uploads/2014/07/cook-dried-beans-1024x768.jpg'
     const url3 = 'https://tse1.mm.bing.net/th?id=OIP.IKB7G_jY59lK-4_VmUsDRQHaFF&pid=Api&P=0&h=180'
const Home = () => {
     [room,setRoom]= useState("https://tse1.mm.bing.net/th?id=OIP.j14GSop07qOYX6Q9h04LhwHaF6&pid=Api&P=0&h=180");

        const handleClick = (url)=>{
          setRoom(url+"kkkkkkkkkkkkkkkkkk");
        }
      
  return (
    <div>
        {/* <input placeholder='roomId' onChange={(e)=>{
      setRoom(e.target.value);
    }} />
      <button  ><NavLink to='/bid'>JOIN</NavLink></button> */}
      <img  src={url1} alt='tomato'  onClick={()=>handleClick(url1)}/>
      <NavLink to='/bid' >Bid</NavLink><br/>
      <img  src={url2} alt='beans' width='225px' onClick={()=>handleClick(url2)}/>
      <NavLink to='/bid' >Bid</NavLink><br/>
      <img  src={url3} alt='beans' width='225px' onClick={()=>handleClick(url3)}/>
      <NavLink to='/bid' >Bid</NavLink>
     <br/>
    </div>
  )
}
export {room}
export default Home