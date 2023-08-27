import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Home from './components/Home';
import Bid from './components/Bid';

const App = () => {

  return (
    <>
    <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/bid' element={<Bid/>} />
      </Routes>
      
    </>
  )
}

export default App