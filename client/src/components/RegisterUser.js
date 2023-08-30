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
    const handleOtpChange = (e)=>{
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
          if (response.status===201) {
            console.log(response.data.message.envelope);
            alert("OTP sent to your email: "+response.data.message.envelope.to[0])
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

      const handleSubmit = async (e)=>{
          e.preventDefault();
          try {

            var formData = new FormData();
            formData.append('photo',profile);
            formData.append('fullname',fullname);
            formData.append('phNumber',phNumber);
            formData.append('email',email);
            formData.append('state',state);
            formData.append('city',city);
            formData.append('password',password);
            formData.append('otp',otp);
            const config = {
                headers:{
                    "Content-Type":"multipart/form-data"
                }
            }
            const response = await axios.post("http://localhost:3001/register",formData,config)
            
            console.log("hi");
            if(response.status===201){
                try {
                    await axios.post('http://localhost:3001/success',{email,fullname});
                    alert('User Registered successfully');
                    navigate('/');
                } catch (error) {
                    console.log('error sending success email',error);
                }
            }
            else{
                alert('Invalid otp:! try again');
                setOtpresponse(false);
            }
          } catch (error) {
              console.log(error);
          }
      }

    return (
        <>
            <form>
                <label>FULL NAME:</label>
                <input
                    type='text'
                    value={fullname}
                    onChange={handleFullname}
                    name='fullname'
                /><br/>
                <label>PH NUMBER:</label>
                <input
                    type='number'
                    value={phNumber}
                    onChange={handlePhNumber}
                    name='phNumber'
                /><br/>
                <label>EMAIL:</label>
                <input
                    type='email'
                    value={email}
                    onChange={handleEmail}
                    name='email'
                /><br/>
                <label>STATE:</label>
                <input
                    type='text'
                    value={state}
                    onChange={handleState}
                    name='state'
                /><br/>
                <label>CITY:</label>
                <input
                    type='text'
                    value={city}
                    onChange={handleCity}
                    name='city'
                /><br/>
                <label>PASSWORD:</label>
                <input
                    type='password'
                    value={password}
                    onChange={handlePassword}
                    name='password'
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
                            <button onClick={handleOtp} >
                                Request OTP
                            </button>}
                    </div> : (<div>
                        <label>OTP:</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={handleOtpChange}
                            required
                            name='otp'
                        />
                        <div >
                            <button  onClick={handleSubmit}>
                                verify-otp
                            </button>
                        </div>
                    </div>)}
            </form>
        </>
    )
}

export default RegisterUser