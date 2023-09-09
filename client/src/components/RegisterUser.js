import React, { useState } from 'react'
import axios from 'axios'
import Button from '@mui/material/Button';
import { NavLink, useNavigate } from 'react-router-dom'
import { CircularProgress } from "@mui/material";
// import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const RegisterUser = () => {

    const navigate = useNavigate();

    const [fullname, setFullName] = useState("");
    const [phNumber, setPhNumber] = useState("");
    const [email, setEmail] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [password, setPassword] = useState("");
    const [cpassword, setCpassword] = useState("");
    const [profile, setProfile] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [otpresponse, setOtpresponse] = useState(false);

    const handleFullname = (e) => {
        setFullName(e.target.value);
    }
    const handlePhNumber = (e) => {
        setPhNumber(e.target.value);
    }
    const handleEmail = (e) => {
        setEmail(e.target.value);
    }
    const handleState = (e) => {
        setState(e.target.value);
    }
    const handleCity = (e) => {
        setCity(e.target.value);
    }
    const handlePassword = (e) => {
        setPassword(e.target.value);
    }
    const handleCpassword = (e) => {
        setCpassword(e.target.value);
    }
    const handleProfile = (e) => {
        setProfile(e.target.files[0]);
    }
    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    }

    const handleOtp = async (e) => {
        e.preventDefault();
        if (!fullname || !email || !phNumber || !password || !profile || !city || !state) {
            alert("Please enter all fields");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:3001/otprequest", {
                email
            });
            console.log(response);
            if (response.status === 201) {
                console.log(response.data.message.envelope);
                alert("OTP sent to your email: " + response.data.message.envelope.to[0])
                setOtpresponse(true);
            }
            else {
                console.log(response);
                alert("Someone already has that email.Try another?");
                setEmail("");
            }
            setLoading(false);
        } catch (error) {
            console.error('Error during OTP request:', error);
            //setError(error.response.data.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            var formData = new FormData();
            formData.append('photo', profile);
            formData.append('fullname', fullname);
            formData.append('phNumber', phNumber);
            formData.append('email', email);
            formData.append('state', state);
            formData.append('city', city);
            formData.append('password', password);
            formData.append('otp', otp);
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
            const response = await axios.post("http://localhost:3001/register", formData, config)

            console.log("hi");
            if (response.status === 201) {
                try {
                    await axios.post('http://localhost:3001/success', { email, fullname });
                    alert('User Registered successfully');
                    navigate('/login');
                } catch (error) {
                    console.log('error sending success email', error);
                }
            }
            else {
                alert('Invalid otp:! try again');
                setOtpresponse(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark" style={{ height: '60px' }}>
                <Container>
                    <NavLink to="/" className="text-decoration-none text-light mx-2">Home</NavLink>
                    <Nav className="me-auto">
                        
                        <NavLink to="/login" className="text-decoration-none text-light mx-2">Login</NavLink>
                        <NavLink to="/register" className="text-decoration-none text-light mx-2">Register</NavLink>
                    </Nav>
                </Container>
            </Navbar>
            <div className="form-container">
            <form className="register-form">
                <label className="col-sm-2 col-form-label">FULL NAME:</label>
                <input
                    type='text'
                    value={fullname}
                    onChange={handleFullname}
                    name='fullname'
                    className="register-form-label"
                /><br />
                <label className="col-sm-2 col-form-label">PH NUMBER:</label>
                <input
                    type='number'
                    value={phNumber}
                    onChange={handlePhNumber}
                    name='phNumber'
                    className="register-form-label"
                /><br />
                <label className="col-sm-2 col-form-label">EMAIL:</label>
                <input
                    type='email'
                    value={email}
                    onChange={handleEmail}
                    name='email'
                    className="register-form-label"
                /><br />
                <label className="col-sm-2 col-form-label">STATE:</label>
                <input
                    type='text'
                    value={state}
                    onChange={handleState}
                    name='state'
                    className="register-form-label"
                /><br />
                <label className="col-sm-2 col-form-label">CITY:</label>
                <input
                    type='text'
                    value={city}
                    onChange={handleCity}
                    name='city'
                    className="register-form-label"
                /><br />
                <label className="col-sm-2 col-form-label">PASSWORD:</label>
                <input
                    type='password'
                    value={password}
                    onChange={handlePassword}
                    name='password'
                    className="register-form-label"
                /><br />
                <label className="col-sm-2 col-form-label">CONFIRM PASSWORD:</label>
                <input
                    type='password'
                    value={cpassword}
                    onChange={handleCpassword}
                    className="register-form-label"
                /><br />
                <label className="col-sm-2 col-form-label">UPLOAD PROFILE:</label>
                <input
                    type='file'
                    onChange={handleProfile}
                    name='photo'
                    className="file-input-label"
                //value={profile}
                /><br />
                {!otpresponse ?
                    <div>

                        {loading ? (<CircularProgress color="success" />) :
                            <Button variant="dark" onClick={handleOtp} >
                                Request OTP
                            </Button>}
                    </div> : (<div>
                        <label>OTP:</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={handleOtpChange}
                            required
                            name='otp'
                            className='otp-container'
                        />
                        <div >
                            <button onClick={handleSubmit} className='verify-otp-button' variant="contained" color="success">
                                verify-otp
                            </button>
                        </div>
                    </div>)}
            </form>
            </div>
        </>
    )
}

export default RegisterUser