import React, { useEffect, useState } from 'react'
import jwt_decode from "jwt-decode";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
const NewItem = () => {
    const navigate = useNavigate();

    const token = !!localStorage.getItem("token");
    if (token) {
        const Token = localStorage.getItem("token");
        var decodedToken = jwt_decode(Token);
        var userId = decodedToken.userId;
        var username = decodedToken.name
    }
    const [data, setData] = useState([]);
    const [itemImage, setItemImage] = useState("");
    const [itemName, setItemName] = useState("");
    const [price, setPrice] = useState(0);
    const [state, setState] = useState("");
    const [city, setCity] = useState("");

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

        }
    }

    useEffect(() => {
        getUserItems(userId);
    }, [])


    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark" style={{ height: '60px' }}>
                <Container>
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

            <form onSubmit={handleSubmit}>
                <label>Item NAME:</label>
                <input
                    type='text'
                    value={itemName}
                    onChange={handleItemName}
                    name='itemName'
                    required
                /><br />
                <label>Base Price:</label>
                <input
                    type='number'
                    value={price}
                    onChange={handlePrice}
                    name='price'
                    required
                /><br />

                <label>STATE:</label>
                <input
                    type='text'
                    value={state}
                    onChange={handleState}
                    name='state'
                    required
                /><br />
                <label>CITY:</label>
                <input
                    type='text'
                    value={city}
                    onChange={handleCity}
                    name='city'
                    required
                /><br />

                <label>UPLOAD Item:</label>
                <input
                    type='file'
                    onChange={handleItemImage}
                    name='photo'
                    required
                //value={profile}
                /><br />
                <button type='submit'>post</button>
            </form>
            {
                data.length > 0 ? data.map((img, i) => {
                    return (
                        <>
                            {/* <Image src={`http://localhost:3001/uploads/${img.imgpath}`} alt={img.name} width='225px' height='225px' thumbnail /> */}
                            <Card style={{ width: '18rem' }}>
                                <Card.Img variant="top" src={`http://localhost:3001/uploads/${img.imgpath}`} width='60px'/>
                                <Card.Body>
                                    <Card.Title>{img.itemName}</Card.Title>
                                    <Card.Text>
                                        Base Price : {img.price}$
                                    </Card.Text>
                                </Card.Body>
                            </Card>

                        </>)
                }) : ""
            }
        </>
    )
}

export default NewItem