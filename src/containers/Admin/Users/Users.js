import React, { Component } from "react";
import axios from '../../../axios';

class Users extends Component{
    state = {
        users: []
    }

    async componentDidMount() {
        await axios.get('/users')
            .then(response => {
                this.setState({users: response.data})
            })
        
    }

    render() {
        return(
            <div>
                Users list
            </div>
        );
        
    }
}

export default Users;