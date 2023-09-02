import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { NavLink, useNavigate } from 'react-router-dom';
import io from 'socket.io-client'
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import jwt_decode from "jwt-decode";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
const socket = io.connect('http://localhost:3001')

//import { NavLink } from 'react-router-dom';
let room = "";
let setRoom = ""

const Home = () => {
  
  const navigate= useNavigate();

  const token = !!localStorage.getItem("token");
  if (token) {
    const Token = localStorage.getItem("token");
    var decodedToken = jwt_decode(Token);
    var username = decodedToken.name;
  }

  [room, setRoom] = useState("https://tse1.mm.bing.net/th?id=OIP.j14GSop07qOYX6Q9h04LhwHaF6&pid=Api&P=0&h=180");
  const [data, setData] = useState([]);
  const [searchTerm,setSearchTerm]= useState("");


  const handleClick = (url) => {
    setRoom(url + "kkkkkkkkkkkkkkkkkk");
  }

 
 
  

  const getItemsData = async (state) => {
    const res = await axios.get(`http://localhost:3001/itemsData/${state}`, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (res.data.status === 401 || !res.data) {
      console.log("error");
    }
    else {
      console.log(res.data.getItem)
      setData(res.data.getItem);
      
    }
  }


  useEffect(() => {
    console.log('rendered')
    getItemsData('telangana');
  }, [])


  return (
    <div>

      <Navbar bg="dark" data-bs-theme="dark" style={{ height: '60px' }}>
        <Container>

        <input placeholder="Search for a movie" value={searchTerm} onChange={(event)=>setSearchTerm(event.target.value)}/>
          <button onClick={()=>getItemsData(searchTerm)}>search</button>
          <NavLink to="/" className="text-decoration-none text-light mx-2">Home</NavLink>
          <Nav className="me-auto">
            {token ?
              (
                <>
                  <h4 style={{ color: 'white' }}>Hi {username}</h4>
                  <NavLink to="/newItem" className="text-decoration-none text-light mx-2">NewItem</NavLink>
                  <NavLink to="/logout" className="text-decoration-none text-light mx-2">Logout</NavLink>
                </>

              ) : (
                <>
                  <NavLink to="/login" className="text-decoration-none text-light mx-2">Login</NavLink>

                  <NavLink to="/register" className="text-decoration-none text-light mx-2">SignUp</NavLink>

                </>
              )}
            {/* <NavLink to="/register" className="text-decoration-none text-light mx-2">Register</NavLink>    
            <NavLink to="/login" className="text-decoration-none text-light mx-2">Login</NavLink> */}
          </Nav>
        </Container>
      </Navbar>

      {
        
        data.length > 0 ? data.map((img, i) => {

          return (
            <>
              
              <><Image src={`http://localhost:3001/uploads/${img.imgpath}`} alt={img.name} width='225px' height='225px' onClick={() => handleClick(img.url)} thumbnail />
              <h2>{img.itemName}</h2>
              {
                token ?
                  <>
                    <NavLink to='/bid' ><Button variant='dark'>BID</Button></NavLink><br />
                  </>
                  : <><NavLink to='/login' ><Button variant='dark'>BID</Button></NavLink><br /></>

              }
              </>
              
              
              

            </>
          )
        }) : ""
      }
    </div>
  )
}
export { room }
export default Home