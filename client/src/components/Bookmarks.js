import React, { useEffect, useState } from 'react'
import jwt_decode from "jwt-decode";
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { NavLink, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const Bookmarks = () => {

  const [data, setData] = useState([]);
  // const initialArray = Array(data.length).fill(true);
  // const [bookmarkStatus, setbookmarkStatus] = useState(initialArray);
  const [reload,setReload] = useState(0);

  const token = !!localStorage.getItem("token");
  if (token) {
    const Token = localStorage.getItem("token");
    var decodedToken = jwt_decode(Token);
    var username = decodedToken.name;
    var userId = decodedToken.userId;
  }


  const getBookMarkData = async () => {

    const res = await axios.get(`http://localhost:3001/getBookMarkData/${userId}`, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    if (res.data.status === 401 || !res.data) {
      console.log("error");
    }
    else {
      //console.log(res.data.getItem)
      console.log(res.data.bookmarks)
      setData(res.data.bookmarks);
    }

  }
  const unmark = async (id, i) => {

    const res = await axios.delete(`http://localhost:3001/unbookmark/${userId}/${id._id}`, {
      headers: {
        "Content-Type": "application/json"
      }
    });
      if(res.data.status===401 || !res.data){
        console.log("error");
      }
      else{
        setReload((prev)=>prev+1);
      }
    
    //getBookMarkData();
  }


  useEffect(() => {
    console.log("bookmark rendered")
    getBookMarkData();
  }, [reload])

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" style={{ height: '60px' }}>

        <Container>
          {/* <input placeholder="Filter By State" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          {searchTerm.length === 0 ? <button>search</button> : <button onClick={() => getItemsData(searchTerm)}>search</button>}
          <button onClick={() => getItemsData('all')}>Reset</button> */}
          {token ? <h4 style={{ color: 'white' }}>Hi {username}</h4> : null}

          <NavLink to="/" className="text-decoration-none text-light mx-2">Home</NavLink>
          <Nav className="me-auto">
            {token ?
              (
                <>

                  <NavLink to="/newItem" className="text-decoration-none text-light mx-2">Dashboard</NavLink>
                  <NavLink to="/bookmarks" className="text-decoration-none text-light mx-2">Bookmarks</NavLink>
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
      {data.length > 0 ? data.map((img, i) => {
        //console.log(img);
        return (
          <>
            <>
              {(img.sold === "no" || img.sold === "yes") ?
                <Card style={{ width: '18rem' }}>
                  <Card.Img variant="top" src={`http://localhost:3001/uploads/${img.imgpath}`} style={{ width: '200px', height: '200px' }} />
                  {/* {!bookmarkStatus[i] ?<BookmarksOutlinedIcon/>:<>Bookmarked</>}  */}
                  <Card.Body>

                    <Card.Title>{img.itemName}</Card.Title>

                    {/* {img.sold==="no"?<>{img.auctionStatus==="true"? <h1>Auction Ongoing</h1>:<h1>Not Started yet</h1>}</>:null}   */}

                    <Card.Text>
                      <>
                        <span style={{ fontSize: "20px" }}>Base Price : </span><span>{img.price}$</span><br />
                        <span>State : {img.state}</span>
                      </>

                    </Card.Text>
                    {
                      token ?
                        <>
                          {img.sold === "no" ? <Button variant='dark' >Explore</Button> : <Button variant='danger'>SOLD</Button>}<br />
                          <Button variant='primary' onClick={() => unmark(img, i)}>Remove Bookmark</Button>
                          {/* <NavLink  to='/bid'  ><Button variant='dark' >BID</Button></NavLink><br /> */}
                        </>
                        : <><NavLink to='/login' ><Button variant='dark'>Explore</Button></NavLink><br /></>

                    }
                  </Card.Body>
                </Card> : null}
            </>

          </>
        )

      }) : <h1>No bookmarks</h1>}
    </>
  )
}

export default Bookmarks