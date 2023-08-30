import React, { useState } from 'react'
import axios from 'axios'
import { NavLink, useNavigate } from 'react-router-dom'
import { CircularProgress } from "@mui/material";

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


    return (
        <>
            <form>
                <label>FULL NAME:</label>
                <input
                    type='text'
                    value={fullname}
                    onChange={handleFullname}
                /><br/>
                <label>PH NUMBER:</label>
                <input
                    type='number'
                    value={phNumber}
                    onChange={handlePhNumber}
                /><br/>
                <label>EMAIL:</label>
                <input
                    type='email'
                    value={email}
                    onChange={handleEmail}
                /><br/>
                <label>STATE:</label>
                <input
                    type='text'
                    value={state}
                    onChange={handleState}
                /><br/>
                <label>CITY:</label>
                <input
                    type='text'
                    value={city}
                    onChange={handleCity}
                /><br/>
                <label>PASSWORD:</label>
                <input
                    type='password'
                    value={password}
                    onChange={handlePassword}
                /><br/>
                <label>CONFIRM PASSWORD:</label>
                <input
                    type='password'
                    value={cpassword}
                    onChange={handleCpassword}
                /><br/>
                <label>UPLOAD PROFILE:</label>
                <input
                    type='file'
                    onChange={handleProfile}
                    name='photo'
                    //value={profile}
                /><br/>
                {!otpresponse ?
                    <div>

                            {loading ? (<CircularProgress color="success" />) :
                            <button >
                                Request OTP
                            </button>}
                    </div> : (<div>
                        <label>OTP:</label>
                        <input
                            type="text"
                            value={otp}
                            //onChange={handleOtpChange}
                            required
                        />
                        <div >
                            <button  >
                                verify-otp
                            </button>
                        </div>
                    </div>)}
            </form>
        </>
    )
}

export default RegisterUser