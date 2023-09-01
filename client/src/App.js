import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Home from './components/Home';
import Bid from './components/Bid';
import RegisterUser from './components/RegisterUser';
import NewItem from './components/NewItem';
import Login from './components/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logout from './components/Logout';
const App = () => {

  return (
    <>
    
    <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/bid' element={<Bid/>} />
        <Route path='/register' element={<RegisterUser/>} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/logout' element={<Logout/>}/>
        <Route path='/newItem' element={<NewItem/>}/>
      </Routes>
      
    </>
  )
}

export default App