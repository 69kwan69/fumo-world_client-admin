import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Login extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: '',
    };
  }
  render() {
    if (this.context.token === '') {
      return (
        <div className="flex flex-col items-center justify-center min-h-dvh gap-4">
          <h2 className="font-bold text-2xl uppercase">Admin Login</h2>
          <form className="p-4 border rounded flex flex-col gap-4">
            <label>
              Username
              <br />
              <input
                className="px-4 py-2 border rounded"
                type="text"
                value={this.state.txtUsername}
                onChange={(e) => {
                  this.setState({ txtUsername: e.target.value });
                }}
              />
            </label>
            <label>
              Password
              <br />
              <input
                className="px-4 py-2 border rounded"
                type="password"
                value={this.state.txtPassword}
                onChange={(e) => {
                  this.setState({ txtPassword: e.target.value });
                }}
              />
            </label>
            <button
              className="px-4 py-2 border font-bold rounded uppercase"
              onClick={(e) => this.btnLoginClick(e)}
            >
              Login
            </button>
          </form>
        </div>
      );
    }
    return <div />;
  }
  
  // event-handlers
  btnLoginClick(e) {
    e.preventDefault();
    const username = this.state.txtUsername;
    const password = this.state.txtPassword;
    if (username && password) {
      const account = { username: username, password: password };
      this.apiLogin(account);
    } else {
      alert('Please input username and password');
    }
  }

  // apis
  apiLogin(account) {
    axios.post('/api/admin/login', account).then((res) => {
      const result = res.data;
      if (result.success === true) {
        this.context.setToken(result.token);
        this.context.setUsername(account.username);
      } else {
        alert(result.message);
      }
    });
  }
}

export default Login;
