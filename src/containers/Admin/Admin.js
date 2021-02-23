import React, { Component } from "react";
import {Route, Switch} from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import Main from "./Main/Main";
import UsersList from './UsersList/UsersList';
import DefectsList from './DefectsList/DefectsList';

class Admin extends Component{

    render() {
        return(
                <Layout>
                    <Switch>
                    <Route path='/admin/main' exact component={Main}></Route>
                    <Route path='/admin/users' exact component={UsersList}></Route>
                    <Route path='/admin/defects' exact component={DefectsList}></Route>
                    <Route component={() => <h1>Not found 404</h1>}></Route>
                    </Switch>
                </Layout>
        );
    }
}

export default Admin;