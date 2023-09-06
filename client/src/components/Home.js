import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { NavLink, useNavigate } from 'react-router-dom';
import io from 'socket.io-client'
import Button from 'react-bootstrap/Button';
import jwt_decode from "jwt-decode";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card';
const socket = io.connect('http://localhost:3001')

//import { NavLink } from 'react-router-dom';
let room = "";
let setRoom = ""

const Home = () => {

  const navigate = useNavigate();

  const token = !!localStorage.getItem("token");
  if (token) {
    const Token = localStorage.getItem("token");
    var decodedToken = jwt_decode(Token);
    var username = decodedToken.name;
  }

  [room, setRoom] = useState("");
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");


  const handleClick = async (url) => {
    // + "kkkkkkkkkkkkkkkkkk"
    await setRoom(url );
    //console.log(room);
    navigate('/bid');

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
      //console.log(res.data.getItem)
      setData(res.data.getItem);
      

    }
  }


  useEffect(() => {
    console.log('rendered')
    getItemsData('all');
  }, [])


  return (
    <div>

      <Navbar bg="dark" data-bs-theme="dark" style={{ height: '60px' }}>
      
        <Container>
          <input placeholder="Filter By State" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          {searchTerm.length === 0 ? <button>search</button> : <button onClick={() => getItemsData(searchTerm)}>search</button>}
          <button onClick={() => getItemsData('all')}>Reset</button>
          <NavLink to="/" className="text-decoration-none text-light mx-2">Home</NavLink>
          <Nav className="me-auto">
            {token ?
              (
                <>
                  <h4 style={{ color: 'white' }}>Hi {username}</h4>
                  <NavLink to="/newItem" className="text-decoration-none text-light mx-2">Dashboard</NavLink>
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

              {/* <><Image src={`http://localhost:3001/uploads/${img.imgpath}`} alt={img.name} width='225px' height='225px' onClick={() => handleClick(img.url)} thumbnail />
                <h2>{img.itemName}</h2>
                {
                  token ?
                    <>
                      <NavLink to='/bid' ><Button variant='dark'>BID</Button></NavLink><br />
                    </>
                    : <><NavLink to='/login' ><Button variant='dark'>BID</Button></NavLink><br /></>

                }
              </> */}
              <>
                {img.sold === "no" ? <Card style={{ width: '18rem' }}>
                  <Card.Img variant="top" src={`http://localhost:3001/uploads/${img.imgpath}`} style={{ width: '200px', height: '200px' }} />
                  <Card.Body>
                    <Card.Title>{img.itemName}</Card.Title>
                    <Card.Text>
                      <>
                        <span style={{fontSize:"20px"}}>Base Price : </span><span>{img.price}$</span><br/>
                        <span>State : {img.state}</span>
                      </>

                    </Card.Text>
                    {
                      token ?
                        <>
                                                    <Button variant='dark' onClick={() => handleClick(img.imgpath)}>Explore</Button>
                          {/* <NavLink  to='/bid'  ><Button variant='dark' >BID</Button></NavLink><br /> */}
                        </>
                        : <><NavLink to='/login' ><Button variant='dark'>Explore</Button></NavLink><br /></>

                    }
                  </Card.Body>
                </Card> : null}
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
