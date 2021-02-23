import './App.css';
import { Switch, Route, Redirect } from 'react-router-dom'

import Login from './containers/Login/Login';
import Admin from './containers/Admin/Admin';

function App() {
  return (
    <>
      <Switch>
        <Route exact path='/login' component={Login}></Route>
        <Route path='/admin' component={Admin}></Route>
        <Redirect from='/' to='/login'></Redirect>
        <Route component={() => <h1>Not found 404</h1>}></Route>
      </Switch>
    </>
  );
}

export default App;
