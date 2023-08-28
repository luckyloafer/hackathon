import React from 'react'
import { useEffect, useState } from 'react'
import { room, setRoom } from './Home'

import io from 'socket.io-client'
const socket = io.connect('http://localhost:3001')


const Bid = () => {

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
            {/* <input placeholder='message' type='number' onChange={(e) => {
                setMessage(e.target.value)
            }} /> */}

            <button onClick={sendmessage}>Raise</button><br />
            <h1>Current Bid = RS: {max}</h1>
        </>
    )
}

export default Bid



