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
        <div className="grid place-items-center min-h-dvh">
          <div>
            <h1 className="title text-2xl mb-6">Admin Login</h1>
            <form className="form border rounded-md w-80 shadow">
              <label>
                Username
                <br />
                <input
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
                  type="password"
                  value={this.state.txtPassword}
                  onChange={(e) => {
                    this.setState({ txtPassword: e.target.value });
                  }}
                />
              </label>
              <button
                className="button uppercase font-bold tracking-widest"
                onClick={(e) => this.btnLoginClick(e)}
              >
                Login
              </button>
            </form>
          </div>
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
