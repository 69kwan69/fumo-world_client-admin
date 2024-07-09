import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import { Link } from 'react-router-dom';

class Menu extends Component {
  static contextType = MyContext; // using this.context to access global state
  render() {
    return (
      <div className="border p-4 flex items-center justify-between">
        <div className="uppercase">
          <ul className="flex gap-4">
            <li>
              <Link className="hover:underline decoration-2" to="/admin/home">
                Home
              </Link>
            </li>
            <li>
              <Link
                className="hover:underline decoration-2"
                to="/admin/category"
              >
                Category
              </Link>
            </li>
            <li>
              <Link
                className="hover:underline decoration-2"
                to="/admin/product"
              >
                Product
              </Link>
            </li>
            <li>
              <Link className="hover:underline decoration-2" to="">
                Order
              </Link>
            </li>
            <li>
              <Link className="hover:underline decoration-2" to="">
                Customer
              </Link>
            </li>
          </ul>
        </div>
        <Link
          className="hover:bg-slate-100 normal-case border rounded px-2 py-1"
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
