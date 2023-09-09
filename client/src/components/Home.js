import React from 'react'
import './App.css';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react'
import axios from 'axios'
import { NavLink, useNavigate } from 'react-router-dom';
import io from 'socket.io-client'
// import Button from 'react-bootstrap/Button';
import jwt_decode from "jwt-decode";
import Container from 'react-bootstrap/Container';
import BookmarksOutlinedIcon from '@mui/icons-material/BookmarksOutlined';
import BookmarksRoundedIcon from '@mui/icons-material/BookmarksRounded';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';


const socket = io.connect('http://localhost:3001')

//import { NavLink } from 'react-router-dom';
let room = "";
let setRoom = ""
let roomId=  "";
let setRoomId = "";

const Home = () => {

  const navigate = useNavigate();

  
  const token = !!localStorage.getItem("token");
  if (token) {
    const Token = localStorage.getItem("token");
    var decodedToken = jwt_decode(Token);
    var username = decodedToken.name;
    var userId = decodedToken.userId;
    var phNumber =decodedToken.phNumber  ;
   // console.log(phNumber);
  }

  [room, setRoom] = useState("");
  const [data, setData] = useState([]);
  const [marking,setMarking] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  [roomId, setRoomId] = useState("");
  const initialArray = Array(data.length).fill(false);
  const [bookmarkStatus, setbookmarkStatus] = useState(initialArray);
  const [reload, setReload] = useState(0);

  // socket.on('setReloadHomePage',()=>{
  //   setReload((prev)=>prev+1);
  // })
  


  const handleClick = async (url,id) => {
    // + "kkkkkkkkkkkkkkkkkk"
    await setRoom(url );
    await setRoomId(id);
    //console.log(room);
    navigate(`/bid/${id}`);

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

  const mark = async(item,i)=>{

    setbookmarkStatus((prevBookmarkStatus) => {
      const newBookmarkStatus = [...prevBookmarkStatus];
      newBookmarkStatus[i] = true;
      return newBookmarkStatus;
    });
    console.log("Home",item)
    const res = await axios.post(`http://localhost:3001/bookmark/${userId}/${item._id}`,{
      item,phNumber
    })

    // await axios({
    //   method:'post',
    //   url:`http://localhost:3001/bookmark/${userId}`,
    //   data:item
    // })

  }

  
  socket.on('newItemStatus',()=>{
    alert('newItem Added in auction');
    
    setReload((prev)=>prev+1);
  })

  useEffect(() => {
    console.log('rendered')
    
    getItemsData('all');
    
   // console.log(Timer.isStarted());
  }, [reload])


  return (
    <div style={{backgroundColor:'black',minheight: '100vh'}}>
     
      <Navbar bg="dark" data-bs-theme="dark" style={{ height: '60px' }}>
      
        <Container className="navbar-container">
        
        {token ? <h4 style={{ color: 'white' }}>Hi {username}</h4>:null}
          <input placeholder="Filter By State" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} style={{margin:'0px 5px'}}/>
          {searchTerm.length === 0 ? <Button variant="contained" color="success" className='search-button' style={{marginRight:'3px'}}>search</Button> : <Button onClick={() => getItemsData(searchTerm)} variant="contained" color="success" className="search-button">search</Button>}
          <Button onClick={() => getItemsData('all')} className="reset-button" variant="contained" color="error" style={{marginLeft:'3px'}}>Reset</Button>
          <NavLink to="/" className="nav-link mx-2">Home</NavLink>
          <Nav className="me-auto">
            {token ?
              (
                <>
                  
                  <NavLink to="/newItem" className="nav-link mx-2">Dashboard</NavLink>
                  <NavLink to="/bookmarks" className="nav-link mx-2">Bookmarks</NavLink>
                  <NavLink to="/logout" className="nav-link mx-2">Logout</NavLink>
                  
                </>

              ) : (
                <>
                  <NavLink to="/login" className="nav-link mx-2">Login</NavLink>

                  <NavLink to="/register" className="nav-link mx-2">SignUp</NavLink>

                </>
              )}
            {/* <NavLink to="/register" className="text-decoration-none text-light mx-2">Register</NavLink>    
            <NavLink to="/login" className="text-decoration-none text-light mx-2">Login</NavLink> */}
          </Nav>
        </Container>
      </Navbar>
      {/* //justify-content-between */}
      <div className='row d-flex  align-items-center mt-5' style={{backgroundColor:'black'}}>

     
      {

        data.length > 0 ? data.map((img, i) => {
        console.log(typeof(img))
        //console.log(img.winner.soldPrice)
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
                {img.sold === "no" || img.sold==="yes" ? <Card style={{ width: '18rem' }}>
                  <Card.Img variant="top" src={`http://localhost:3001/uploads/${img.imgpath}`} className='card-image' />
                 {!bookmarkStatus[i] ?<BookmarksOutlinedIcon onClick= {()=>{mark(img,i); alert("Item bookmarked")}}/>:<BookmarksRoundedIcon/>} 
                  <Card.Body className='card'>
                  
                    <Card.Title className='card-title'>{img.itemName}</Card.Title>
                    
                  {img.sold==="no"?<>{img.auctionStatus==="true"? <h3>Auction Ongoing</h3>:<h3>Not Started yet</h3>}</>:null}  
                    
                    <Card.Text className='card-text'>
                      <>
                        <span style={{fontSize:"20px"}}>Base Price : </span><span>{img.price}$</span><br/>
                        <span>State : {img.state}</span>
                        {img.sold==="yes" ? <h1>Sold Price: {img.winner.soldPrice}</h1>:null}
                      </>

                    </Card.Text>
                    {
                      token ?
                        <>
                          {img.sold==="no" ? <Button variant='outlined' style={{ backgroundColor: 'black', color: 'white' }} onClick={() => handleClick(img.imgpath,img._id)}>Explore</Button>:<Button variant='outlined' color='secondary'>SOLD</Button>}  
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
    </div>
  )
}
export { room }
export {roomId}
export default Home
