import React from 'react'
import { useEffect, useState } from 'react'
import { room, setRoom } from './Home'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import io from 'socket.io-client'
import { NavLink } from 'react-router-dom';
import jwt_decode from "jwt-decode";
const socket = io.connect('http://localhost:3001')


const Bid = () => {

    const token = !!localStorage.getItem("token");
    if (token) {
        const Token = localStorage.getItem("token");
        var decodedToken = jwt_decode(Token);
        var username = decodedToken.name;
    }
    const [message, setMessage] = useState(0);
    const [max, setMax] = useState(0);


    console.log(room);
    socket.emit('join_room', room);


    const sendmessage = () => {

        setMessage((prev) => {
            return prev + max + 10;
        })
        socket.emit('send_message', {
            message, room
        })

        setMax((prevMax) => {
            const newMax = Math.max(prevMax, message);
            return newMax;
        });
    };

    useEffect(() => {
        socket.on('received_message', (data) => {

            setMax((prevMax) => {
                const newMax = Math.max(prevMax, data.message);
                return newMax;
            });
        })
    }, [socket])





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

            <button onClick={sendmessage}>Raise</button><br />
            <h1>Current Bid = RS: {max}</h1>
        </>
    )
}

export default Bid



