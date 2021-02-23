import React, { Component } from 'react';
import styles from './Login.module.css';
import axios from 'axios';
import { baseUrl } from '../../config';


class Login extends Component{
    state = {
        email: '',
        password: '',
        error: false,
        message: ''
    }

    handleFormChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    }

    handleFormSubmit = async (e) => {
        e.preventDefault();
        await axios.post(baseUrl + '/admin/login', this.state)
        .then(response => {
            const token = response.data.access_token;
            document.cookie = `token=${token}; path=/`;
            this.setState({password: ''})
            this.props.history.push('/admin/main')
        })
        .catch(error => {
            this.setState({
                error: true,
                message: error.response.data.message,
            })
        })
    }

    render() {
        const error = this.state.error ? <div className={styles.customAlert+' alert alert-danger'}>
        {this.state.message}
      </div> : null
        return (
            <>
            <form onSubmit={this.handleFormSubmit} className={styles.loginForm}>
                {error}
                <p>Електронна пошта</p><input type='text' name='email' value={this.state.email} onChange={this.handleFormChange}/>
                <p>Пароль</p><input type='password' name='password' value={this.state.password} onChange={this.handleFormChange}/>
                <p><button className='btn btn-primary'>Sign in</button></p>
            </form> 
            </>
        );   
    }
}

export default Login;