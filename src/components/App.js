import {Route, Routes} from 'react-router-dom'
import Main from './Main';
import Account from './Account';
import Socials from './Socials';
import Login from './Login';
import { AuthContext } from '../helpers/AuthContext';
import { useState } from 'react';

const App = () => {
  const [authState, setAuthState] = useState(false);

  return (
    <div className="app">
      <AuthContext.Provider value = {{authState, setAuthState}}>
      <Routes>
        <Route path='/' element={ <Main /> }></Route>
        <Route path='/account' element={ <Account /> }></Route>
        <Route path='/socials' element={<Socials/> }></Route>
        <Route path='/login' element={ <Login /> } ></Route>
      </Routes>
      </AuthContext.Provider>
    </div>
  )
}

export default App;