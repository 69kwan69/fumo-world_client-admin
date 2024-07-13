import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import { Link, NavLink } from 'react-router-dom';

class Menu extends Component {
  static contextType = MyContext; // using this.context to access global state

  render() {
    return (
      <div className="nav">
        <div className="uppercase">
          <ul>
            <li>
              <Link
                className="font-bold normal-case hover:!no-underline text-xl"
                to="/admin/home"
              >
                ᗜˬᗜ Admin
              </Link>
            </li>
            <li>
              <NavLink to="/admin/category">Category</NavLink>
            </li>
            <li>
              <NavLink to="/admin/product">Product</NavLink>
            </li>
            <li>
              <NavLink to="/admin/order">Order</NavLink>
            </li>
            <li>
              <NavLink to="/admin/customer">Customer</NavLink>
            </li>
          </ul>
        </div>
        <Link
          className="button"
          to="/admin/home"
          onClick={() => this.lnkLogoutClick()}
        >
          Logout
        </Link>
      </div>
    );
  }

  // event-handlers
  lnkLogoutClick() {
    this.context.setToken('');
    this.context.setUsername('');
  }
}

export default Menu;
