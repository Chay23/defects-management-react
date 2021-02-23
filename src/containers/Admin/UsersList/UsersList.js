import React, { Component } from "react";
import axios from '../../../axios';

class UsersList extends Component{
    state = {
        usersList: []
    }

    async componentDidMount() {
        await axios.get('/users')
            .then(response => {
                this.setState({usersList: response.data})
            })
        
    }

    render() {
        return(
            <div>
                Admins list
            </div>
        );
        
    }
}

export default UsersList;