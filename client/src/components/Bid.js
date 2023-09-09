import React from 'react'
import { useEffect, useState } from 'react'
import { room, setRoom } from './Home'
import { BookmarkRoom, setBookmarkRoom } from './Bookmarks'
import { roomId } from './Home';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import io from 'socket.io-client'
import { NavLink, useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import axios from 'axios';
const socket = io.connect('http://localhost:3001');



const Bid = () => {

    const navigate = useNavigate();
    const token = !!localStorage.getItem("token");
    if (token) {
        const Token = localStorage.getItem("token");
        var decodedToken = jwt_decode(Token);
        var username = decodedToken.name;
        var phNumber =decodedToken.phNumber ;
    }
    const [message, setMessage] = useState(0);
    const [max, setMax] = useState(0);
    const [maxBidder, setMaxBidder] = useState("");
    const [maxBidderPhno, setMaxBidderPhno] = useState(0);
    const [auctionSignal, setAuctionSignal] = useState(false);
    const [roomName, setRoomName] = useState("");
    //const [countdown, setCountdown] = useState(20);
    const [timerRunning, setTimerRunning] = useState(false);
    const [CloseSignal, setCloseSignal] = useState(false);
    const [item, setItem] = useState({});
    const [startBid, setStartBid] = useState(false);
    const [auctionCountDown, setAuctionCountDown] = useState(30);
    //console.log(room);
    //console.log(roomId)

    // const startTimer = () => {
    //     setCountdown(20);
    //     setTimerRunning(true);
    // };

    const startAuctionTimer = ()=>{
        setAuctionCountDown(30);
        setTimerRunning(true);
    }

    // const stopTimer = () => {
    //     setTimerRunning(false);
    // };

    const sendmessage = () => {
        //setCountdown(20);
        setMessage((prev) => {
            return prev + max + 10;
        })
        socket.emit('send_message', {
            message, room, username,phNumber
        })

        setMax((prevMax) => {
            const newMax = Math.max(prevMax, message);
            return newMax;
        });
        setMaxBidder(username);
        setMaxBidderPhno(phNumber);
    };

    const setSoldStatus = async () => {
        const res = await axios.put(`http://localhost:3001/soldStatus/${roomId}/yes`, {
            headers: {
                "Content-Type": "application/json"
            }
        });


    }

    const getItem = async () => {
        const res = await axios.get(`http://localhost:3001/bidItem/${roomId}`, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (res.data.status === 401 || !res.data) {
            console.log("error");
        }
        else {
            console.log(res.data.item)
            setItem(res.data.item);

        }
    }

    const storeMaxBidder = async (maxBidder)=>{
        await axios.post(`http://localhost:3001/maxBidder/${roomId}`, {
            maxBidder,maxBidderPhno,max
        });
    }


    useEffect(() => {

        getItem();
        console.log("big rendered")
        console.log(room);
        socket.emit('join_room', room);
        socket.emit('join_room', BookmarkRoom);

        

        socket.on(room, (data) => {
            console.log("startAuctionSignal - ", data);
            //alert("auction starts within few")
            setRoomName(data);
            setAuctionSignal(true);
            startAuctionTimer();
           // startTimer();

            
            socket.on('received_message', (data) => {

                console.log("received msg - ", data);
                setMax((prevMax) => {
                    const newMax = Math.max(prevMax, data.message);
                    return newMax;
                });
                // setMaxBidder((prevBidder)=>{
                //     return data.username
                // });
                setMaxBidder(data.username)
                setMaxBidderPhno(data.phNumber)
                //startTimer();
            })
        })
        //socket.off('startAuctionSignal');

    }, [roomName,maxBidder])


    useEffect(() => {
        let intervalId;

        if (timerRunning) {
            intervalId = setInterval(() => {
                setAuctionCountDown((prevCountdown) => prevCountdown - 1);
            }, 1000);
        } else {
            clearInterval(intervalId);
        }

        if (auctionCountDown === 0) {
            window.alert("Auction was ended");
            setTimerRunning(false);
            socket.off('received_message');
            socket.off('send_message');
            setAuctionSignal(false);
            setCloseSignal(true);
            //axios.put(`http://localhost:3001/soldStatus/&{room}/`)
            setSoldStatus();
            storeMaxBidder(maxBidder);
            navigate('/');
        }

        return () => clearInterval(intervalId);
    }, [auctionCountDown, timerRunning]);


    // useEffect(() => {
    //     let intervalId;

    //     if (timerRunning) {
    //         intervalId = setInterval(() => {
    //             setAuctionCountDown((prevCountdown) => prevCountdown - 1);
    //         }, 1000);
    //     } else {
    //         clearInterval(intervalId);
    //     }

    //     if (countdown === 0) {
    //         window.alert("Auction was ended");
    //         setTimerRunning(false);
    //         socket.off('received_message');
    //         socket.off('send_message');
    //         setAuctionSignal(false);
    //         setCloseSignal(true);
    //         //axios.put(`http://localhost:3001/soldStatus/&{room}/`)
    //         setSoldStatus();
            
    //         navigate('/');

    //     }

    //     return () => clearInterval(intervalId);
    // }, [countdown, timerRunning]);


    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark" style={{ height: '60px' }}>
                <Container>
                    <NavLink to="/" className="text-decoration-none text-light mx-2">Home</NavLink>
                    <Nav className="me-auto">
                        {token ? (
                            <NavLink to="/logout" className="text-decoration-none text-light mx-2">Logout</NavLink>
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
            {/* <input placeholder='message' type='number' onChange={(e) => {
                setMessage(e.target.value)
            }} /> */}
            {!startBid && !auctionSignal?<h1>Auction will start when the owner starts</h1> :<h1>Auction ends in {auctionCountDown} seconds</h1>}
            {auctionSignal ? <><h1>Start Bidding </h1><br /><button onClick={sendmessage}>Raise</button><br /></> : null}
            {CloseSignal ? <h1>Auction Closed</h1> : null}
            <h4>{username}</h4>
            <h4>Current Bid = RS: {max}</h4>
            <h4>Max Bidder : {maxBidder}</h4>
            <h4>phNumber : {maxBidderPhno}</h4>
            {/* {auctionSignal ? <h4>Countdown Timer: {countdown} seconds</h4>:null} */}
        </>
    )
}

export default Bid



