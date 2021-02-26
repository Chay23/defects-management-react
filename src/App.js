import './App.css';
import { Switch, Route, Redirect } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

import Login from './containers/Login/Login';
import Admin from './containers/Admin/Admin';

function App() {
  return (
    <>
      <Switch>
        <Route exact path='/login' component={Login}/>
        <ProtectedRoute path='/admin' component={Admin}/>
        <Redirect from='/' to='/login'/>
        <Route component={() => <h1>Not found 404</h1>}/>
      </Switch>
    </>
  );
}

export default App;
