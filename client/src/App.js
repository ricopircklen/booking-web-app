// This is the first component in front that will be executed

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import './App.css';

//Pages
import Settings from './pages/Settings';
import Login from './pages/Login';
import User from './pages/User';
import Calendar from './pages/Calendar';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import Contact from './pages/Contact';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Register from './pages/Register';

//layout
import NavBar from './components/NavBar';
import { AuthProvider } from './context/auth';
import AuthRoute from './utils/AuthRoute';
import AdminRoute from './utils/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Container className='components'>
          <NavBar />
          <Container>
            <Switch>
              <AuthRoute exact path='/' component={Calendar} />
              <AuthRoute exact path='/home' component={Calendar} />
              <Route path='/login' component={Login} />
              <Route path='/forgot' component={ForgotPassword} />
              <Route exact path='/reset/:token' component={ResetPassword} />
              <Route exact path='/signup/:token' component={Register} />
              <AuthRoute exact path='/settings' component={Settings} />
              <AuthRoute exact path='/bookings' component={User} />
              <AdminRoute exact path='/admin' component={Admin} />
              <Route exact path='/contact' component={Contact} />
              <Route component={NotFound} />
            </Switch>
          </Container>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
