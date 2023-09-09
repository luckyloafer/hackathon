import React, { useEffect, useState } from 'react'
import './App.css';
import Button from '@mui/material/Button';
import jwt_decode from "jwt-decode";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { CircularProgress } from "@mui/material";
import Alert from 'react-bootstrap/Alert';
import io from 'socket.io-client'
const socket = io.connect('http://localhost:3001')
 //let roomcount =io.sockets.adapter.rooms.get()

const NewItem = () => {
    const navigate = useNavigate();

    const token = !!localStorage.getItem("token");
    if (token) {
        const Token = localStorage.getItem("token");
        var decodedToken = jwt_decode(Token);
        var userId = decodedToken.userId;
        var username = decodedToken.name;
        var email = decodedToken.email;
    }
    const [data, setData] = useState([]);
    const [itemImage, setItemImage] = useState("");
    const [itemName, setItemName] = useState("");
    const [price, setPrice] = useState(0);
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [otp, setOtp] = useState("");
    //const [loading, setLoading] = useState(false);
    //const [otpresponse, setOtpresponse] = useState(false);
    const [show, setShow] = useState(false);
    const [editBasePrices, setEditBasePrices] = useState(data.map(()=>0));

    const initialArray = Array(data.length).fill(false);
    const [otpresponse, setOtpresponse] = useState(initialArray);
    const [loading, setLoading] = useState(initialArray);
    const [startAuctionResponse, setStartAuctionResponse] = useState(initialArray);
    const [selectedCardIndex, setSelectedCardIndex] = useState(-1);
    const [auctionStarted, setAuctionStarted] = useState([]);
    //const [startAuctionResponse, setStartAuctionResponse] = useState(initialArray);


    const handleItemImage = (e) => {
        setItemImage(e.target.files[0]);
    }
    const handleItemName = (e) => {
        setItemName(e.target.value);
    }
    const handlePrice = (e) => {
        setPrice(e.target.value);
    }
    const handleState = (e) => {
        setState(e.target.value);
    }
    const handleCity = (e) => {
        setCity(e.target.value);
    }
    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    }
    const handleEditBasePrice = (e,i) => {
        const updatedEditBasePrices = [...editBasePrices]
        updatedEditBasePrices[i] = e.target.value;
        setEditBasePrices(updatedEditBasePrices);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            var formData = new FormData();
            formData.append('photo', itemImage);
            formData.append('itemName', itemName);
            formData.append('price', price);
            formData.append('state', state);
            formData.append('city', city);
            formData.append('userName', userId);
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
            const response = await axios.post("http://localhost:3001/newItem", formData, config);
            if (response.status === 201) {
                try {
                    alert('Items posted successfully');
                    socket.emit('newItemStatus');
                    navigate('/');
                } catch (error) {
                    console.log('error posting item', error);
                }
            }
            else {
                console.log(response);
            }

        } catch (error) {
            console.log(error);
        }
    }

    const getUserItems = async (userId) => {
        const res = await axios.get(`http://localhost:3001/userItemsData/${userId}`, {
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
            console.log(data.length)

        }
    }

    const handleOtp = async (i) => {
        //e.preventDefault();
        const newLoading = [...loading];
        newLoading[i] = !newLoading[i];
        setLoading(newLoading);
        try {

            const response = await axios.post("http://localhost:3001/dltOtprequest", {
                email
            });
            if (response.status === 201) {
                console.log(response.data.message.envelope);
                alert("OTP for deletion sent to your email: " + response.data.message.envelope.to[0])
                const newResponses = [...otpresponse];
                newResponses[i] = !newResponses[i];
                setOtpresponse(newResponses);
            }
            else {
                console.log(response);
                alert("Someone already has that email.Try another?");
                //setEmail("");
            }
            const newLoading = [...loading];
            newLoading[i] = !newLoading[i];
            setLoading(newLoading);

        } catch (error) {
            console.log("error during Otp", error);
        }
    }

    const dltItem = async (id) => {
        const res = await axios.delete(`http://localhost:3001/dltItem/${id}`, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (res.data.status === 401 || !res.data) {
            console.log("error");
        }
        else {
            console.log("item delete");
            setData(prevData => prevData.filter(item => item._id !== id));
            setShow(true);
        }
    }

    const changeBasePrice = async (id,i) => {

        const res = await axios.put(`http://localhost:3001/editBasePrice/${id}/${editBasePrices[i]}`, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (res.data.status === 401 || !res.data) {
            console.log("error");
        }
        else {
            console.log("price updated");
            //setData(prevData=>prevData);
            getUserItems(userId);

            //setEditBasePrices[i]=0;
        }
    }

    const startAuction = async (id, i,itemId)=>{
        
        if(!auctionStarted.includes(i)){
            
            console.log("startAuction - ", id);
            await axios.put(`http://localhost:3001/auctionStatus/${itemId}/true`,{
                headers: {
                    "Content-Type": "application/json"
                }
            })
            await socket.emit('auctionUpdate',itemId);
             socket.emit('auctionStarted',id);
           
            const updatedAuctionStarted = [...auctionStarted,i];
            setAuctionStarted(updatedAuctionStarted);
            
            //setStartAuctionResponse[i]=true;

        }
         
    }

    useEffect(() => {
        console.log("newItem page rendered")
        getUserItems(userId);

        
    }, [])


    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark" style={{ height: '60px' }}>
                <Container>
                    {token ? <h4 style={{ color: 'white' }}>Hi {username}</h4>:null}
                    <NavLink to="/" className="nav-link mx-2">Home</NavLink>
                    <Nav className="me-auto">
                        {token ?
                            (
                                <>
                                    
                                    <NavLink to="/newItem" className="nav-link mx-2">Dashboard </NavLink>
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

            {

                show ? <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                    Item Deleted
                </Alert> : ""

            }
            <div className='row d-flex align-items-center mt-5' style={{backgroundColor:'black'}}>
            <div>
            <form onSubmit={handleSubmit}>
            <div className="form-group row">
                <label className="col-sm-2 col-form-label">ITEM NAME : </label>
                <div class="col-sm-10">
                <input
                    type='text'
                    value={itemName}
                    onChange={handleItemName}
                    name='itemName'
                    required
                    //className="form-input"
                /></div><br />
                <label className="col-sm-2 col-form-label">BASE PRICE : </label>
                <div class="col-sm-10">
                <input
                    type='number'
                    value={price}
                    onChange={handlePrice}
                    name='price'
                    required
                    //className="form-input"
                /></div><br />

                <label className="col-sm-2 col-form-label">STATE:</label>
                <div class="col-sm-10">
                <input
                    type='text'
                    value={state}
                    onChange={handleState}
                    name='state'
                    required
                   // className="form-input"
                /></div><br />
                <label className="col-sm-2 col-form-label">CITY:</label>
                <div class="col-sm-10">
                <input
                    type='text'
                    value={city}
                    onChange={handleCity}
                    name='city'
                    required
                    //className="form-input"
                /></div><br />

                <label className="col-sm-2 col-form-label">UPLOAD ITEM : </label>
                <div class="col-sm-10">
                <input
                    type='file'
                    onChange={handleItemImage}
                    name='photo'
                    required
                    //className="form-input"
                //value={profile}
                /></div><br />
                <div class="col-sm-10">
                <Button type='submit'  variant='primary'>POST</Button>
                </div>
                </div>
            </form>
            </div>
            {
                data.length > 0 ? data.map((img, i) => {
                    return (
                        <div key={i}>

                            {/* <Image src={`http://localhost:3001/uploads/${img.imgpath}`} alt={img.name} width='225px' height='225px' thumbnail /> */}
                            <Card style={{ width: '18rem', marginRight:'30px', marginLeft:'30px' ,marginTop:'30px', marginBottom:'30px'}} classNAme='card-container'>
                                <Card.Img variant="top" src={`http://localhost:3001/uploads/${img.imgpath}`} style={{ width: '260px', height:'200px', paddingLeft:'0px', borderLeftWidth:'40px', paddingTop:'12px' }}/>
                                <Card.Body>
                                    <Card.Title className="card-title">{img.itemName}</Card.Title>
                                    <Card.Text className="card-text">
                                    
                                        <>Base Price : {img.price}$</><br />
                                        
                                        {img.sold === "yes" ? <span>Sold Price: {img.soldPrice}</span> :
                                        
                                        <><input type='number' value={editBasePrices[i]} onChange={(e)=>handleEditBasePrice(e,i)} placeholder='Edit price' style={{ width: "100px" }} />
                                        <Button variant='primary' onClick={()=>changeBasePrice(img._id,i)} className="form-button">Edit Price</Button><br /></>
                                        }
                                    </Card.Text>
                                    {/* <button onClick={()=>{dltItem(img._id)}}>Delete Item</button> */}
                                    {img.sold==="no"? <><Button variant='warning' onClick={()=>{startAuction(img.imgpath,i,img._id)}} className="form-button">Start Auction</Button><br/></> :null}
                                   
                                    {startAuctionResponse[i] ? <h4>started</h4>:null}

                                    {!otpresponse[i] ?
                                        <div>

                                            {loading[i] ? (<CircularProgress color="success" />) :
                                                <> {
                                                    img.sold === "no" ? <Button variant="dark" onClick={() => handleOtp(i)} className="form-button">
                                                        OTP-Deletion
                                                    </Button> : <Button variant="danger" className="form-button">
                                                        SOLD
                                                    </Button>}
                                                </>
                                            }
                                            {/* < Button variant="dark" onClick={handleOtp} >
                                            OTP-Deletion
                                        </Button>} */}
                                        </div> : (<div>
                                            <label>OTP:</label>
                                            <input
                                                type="text"
                                                value={otp}
                                                onChange={handleOtpChange}
                                                required
                                                name='otp'
                                                className="form-input"
                                            />
                                            <div >
                                                <button onClick={() => { dltItem(img._id) }} className="form-button">
                                                    Delete
                                                </button>
                                            </div>
                                        </div>)}
                                </Card.Body>
                            </Card >

                        </div>)
                }) : ""
            }
            </div>
        </>
    )
}

export default NewItem