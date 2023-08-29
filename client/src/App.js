import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Home from './components/Home';
import Bid from './components/Bid';
import RegisterUser from './components/RegisterUser';
import Header from './components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
const App = () => {

  return (
    <>
    <Header/>
    <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/bid' element={<Bid/>} />
        <Route path='/register' element={<RegisterUser/>} />
      </Routes>
      
    </>
  )
}

export default App