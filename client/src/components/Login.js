import React, { useState } from "react";
import { Link,NavLink } from "react-router-dom";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

const Login = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const response = await axios.post('http://localhost:3001/login', {
        email,
        password
      })

      setPassword('');
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        console.log(response.data.token);
        console.log(response.data.message);
        navigate('/');
      }
      else {
        alert(response.data.message + " or incorrect password")
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
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input

          type="email"
          value={email}
          onChange={handleEmailChange}
          required
        /><br />
        <label>Password:</label>
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={handlePasswordChange}
        />
        {

          showPassword ? (
            <VisibilityOffIcon onClick={togglePasswordVisibility} />
          ) : (
            <VisibilityIcon onClick={togglePasswordVisibility} />
          )
        }<br />
        <Button variant="dark" type="submit">Login</Button><br />
        <span>New to Auction?</span>
        <Link to="/register" >Create an account</Link>
      </form>
    </>
  )
}

export default Login