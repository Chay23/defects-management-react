import React, { Component } from 'react';
import styles from './Login.module.css';
import axios from 'axios';
import { baseUrl } from '../../config';
import { getCookie } from '../../components/GetCookie/GetCookie';
import Spinner from '../../components/Spinner/Spinner';

class Login extends Component {
  state = {
    email: '',
    password: '',
    showPassword: false,
    error: false,
    message: '',
    loading: false,
  };

  handleFormChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleFormSubmit = async e => {
    e.preventDefault();
    this.setState({ loading: true });
    await axios
      .post(baseUrl + '/admin/login', this.state)
      .then(response => {
        const token = response.data.access_token;
        document.cookie = `token=${token}; path=/`;
        this.props.history.push('/admin/main');
      })
      .catch(error => {
        this.setState({
          password: '',
          error: true,
          message: error.response.data.message,
          loading: false,
        });
      });
  };

  showPassword = () => {
    this.setState(prevState => ({ showPassword: !prevState.showPassword }));
  };

  render() {
    const cookie = getCookie('token');
    const spinner = this.state.loading ? <Spinner /> : null;
    if (cookie !== undefined && cookie.length !== 0) {
      this.props.history.push('/admin/main');
    }
    const error = this.state.error ? (
      <div className={styles.customAlert + ' alert alert-danger'}>
        {this.state.message}
      </div>
    ) : null;
    return (
      <>
        <form onSubmit={this.handleFormSubmit} className={styles.loginForm}>
          {error}
          <p>Електронна пошта</p>
          <input
            type='text'
            name='email'
            value={this.state.email}
            onChange={this.handleFormChange}
          />
          <p>Пароль</p>
          <input
            type={this.state.showPassword ? 'text' : 'password'}
            name='password'
            value={this.state.password}
            onChange={this.handleFormChange}
          />
          <p>
            Показати пароль
            <input
              type='checkbox'
              className={styles.inputCheckbox}
              onClick={this.showPassword}
            />
          </p>
          <p>
            <button className='btn btn-primary'>Sign in</button>
          </p>
          <span style={{ width: '10px' }}>{spinner}</span>
        </form>
      </>
    );
  }
}

export default Login;
