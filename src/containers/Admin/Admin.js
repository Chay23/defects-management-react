import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import Users from './Users/Users';
import Defects from './Defects/Defects';
import Defect from './Defects/Defect/Defect';

class Admin extends Component {
  handleStatusColor = status => {
    switch (status) {
      case 'Відкрито':
        return { background: 'red' };
      case 'В процесі':
        return { background: 'rgb(255, 255, 0)' };
      default:
        return { background: 'rgb(7, 207, 0)' };
    }
  };

  handleLogout = () => {
    document.cookie = 'token=; path=/';
  };

  render() {
    return (
      <Layout handleLogout={this.handleLogout}>
        <Switch>
          <Route path='/admin/users' exact component={Users}></Route>
          <Route
            path='/admin/defects'
            exact
            render={props => (
              <Defects
                {...props}
                getStatusColor={status => this.handleStatusColor(status)}
              />
            )}
          ></Route>
          <Route
            path='/admin/defects/:defectId'
            exact
            render={props => (
              <Defect
                {...props}
                getStatusColor={status => this.handleStatusColor(status)}
              />
            )}
          ></Route>
          <Route component={() => <h1>Not found 404</h1>}></Route>
        </Switch>
      </Layout>
    );
  }
}

export default Admin;
