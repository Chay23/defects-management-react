import {getCookie} from '../GetCookie/GetCookie';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={props => (
        getCookie('token') 
        ? <Component {...props} />
        : <Redirect to='/login' />
    )} />
)

export default ProtectedRoute;