import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Customer extends Component {
  static contextType = MyContext; // using this.context to access global state

  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      orders: [],
      order: null,
    };
  }

  render() {
    const customers = this.state.customers.map((item, index) => {
      return (
        <tr
          key={item._id}
          className={
            index % 2 === 0
              ? 'hover:bg-slate-100'
              : 'hover:bg-slate-100 bg-slate-50'
          }
          onClick={() => this.trCustomerClick(item)}
        >
          <td className="p-4 text-left">{item._id}</td>
          <td className="p-4 text-left">{item.username}</td>
          <td className="p-4 text-left">{item.password}</td>
          <td className="p-4 text-left">{item.name}</td>
          <td className="p-4 text-left">{item.phone}</td>
          <td className="p-4 text-left">{item.email}</td>
          <td className="p-4 text-left">{item.active}</td>
          <td className="p-4 text-left">
            {item.active === 0 ? (
              <button
                className="hover:bg-slate-200 normal-case border rounded px-2 py-1"
                onClick={() => this.lnkEmailClick(item)}
              >
                Email
              </button>
            ) : (
              <button
                className="hover:bg-red-600 hover:text-white normal-case border rounded px-2 py-1"
                onClick={() => this.lnkDeactiveClick(item)}
              >
                Deactivate
              </button>
            )}
          </td>
        </tr>
      );
    });

    const orders = this.state.orders.map((item, index) => {
      return (
        <tr
          key={item._id}
          className={
            index % 2 === 0
              ? 'hover:bg-slate-100'
              : 'hover:bg-slate-100 bg-slate-50'
          }
          onClick={() => this.trOrderClick(item)}
        >
          <td className="p-4 text-left">{item._id}</td>
          <td className="p-4 text-left">
            {new Date(item.cdate).toLocaleString()}
          </td>
          <td className="p-4 text-left">{item.customer.name}</td>
          <td className="p-4 text-left">{item.customer.phone}</td>
          <td className="p-4 text-left">{item.total}</td>
          <td className="p-4 text-left">{item.status}</td>
        </tr>
      );
    });

    if (this.state.order) {
      var items = this.state.order.items.map((item, index) => {
        return (
          <tr
            key={item.product._id}
            className={
              index % 2 === 0
                ? 'hover:bg-slate-100'
                : 'hover:bg-slate-100 bg-slate-50'
            }
          >
            <td className="p-4 text-left">{index + 1}</td>
            <td className="p-4 text-left">{item.product._id}</td>
            <td className="p-4 text-left">{item.product.name}</td>
            <td className="p-4 text-left">
              <img
                src={'data:image/jpg;base64,' + item.product.image}
                width="70px"
                height="70px"
                alt=""
              />
            </td>
            <td className="p-4 text-left">{item.product.price}</td>
            <td className="p-4 text-left">{item.quantity}</td>
            <td className="p-4 text-left">
              {item.product.price * item.quantity}
            </td>
          </tr>
        );
      });
    }

    return (
      <div className="p-10">
        <div>
          <h1 className="font-bold text-2xl uppercase mb-6">Customers</h1>

          <table className="table-auto border-collapse border w-full">
            <thead>
              <tr className="border-b bg-slate-300">
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Username</th>
                <th className="p-4 text-left">Password</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Active</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>{customers}</tbody>
          </table>
        </div>

        {this.state.orders.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl uppercase mb-6">Orders</h2>
            <table className="table-auto border-collapse border w-full">
              <thead>
                <tr className="border-b bg-slate-300">
                  <th className="p-4 text-left">ID</th>
                  <th className="p-4 text-left">Creation date</th>
                  <th className="p-4 text-left">Cust.name</th>
                  <th className="p-4 text-left">Cust.phone</th>
                  <th className="p-4 text-left">Total</th>
                  <th className="p-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>{orders}</tbody>
            </table>
          </div>
        )}

        {this.state.order && (
          <div className="mt-10">
            <h2 className="text-xl uppercase mb-6">Details</h2>
            <table className="table-auto border-collapse border w-full">
              <thead>
                <tr className="border-b bg-slate-300">
                  <th className="p-4 text-left">No.</th>
                  <th className="p-4 text-left">Prod.ID</th>
                  <th className="p-4 text-left">Prod.name</th>
                  <th className="p-4 text-left">Image</th>
                  <th className="p-4 text-left">Price</th>
                  <th className="p-4 text-left">Quantity</th>
                  <th className="p-4 text-left">Amount</th>
                </tr>
              </thead>
              <tbody>{items}</tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  componentDidMount() {
    this.apiGetCustomers();
  }

  // event-handlers
  trCustomerClick(item) {
    this.setState({ orders: [], order: null });
    this.apiGetOrdersByCustID(item._id);
  }

  trOrderClick(item) {
    this.setState({ order: item });
  }

  lnkDeactiveClick(item) {
    this.apiPutCustomerDeactive(item._id, item.token);
  }

  lnkEmailClick(item) {
    this.apiGetCustomerSendmail(item._id);
  }

  // apis
  apiGetCustomerSendmail(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/customers/sendmail/' + id, config).then((res) => {
      const result = res.data;
      alert(result.message);
    });
  }

  apiPutCustomerDeactive(id, token) {
    const body = { token: token };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .put('/api/admin/customers/deactive/' + id, body, config)
      .then((res) => {
        const result = res.data;
        if (result) {
          this.apiGetCustomers();
        } else {
          alert('SORRY BABY!');
        }
      });
  }

  apiGetCustomers() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/customers', config).then((res) => {
      const result = res.data;
      this.setState({ customers: result });
    });
  }

  apiGetOrdersByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/orders/customer/' + cid, config).then((res) => {
      const result = res.data;
      this.setState({ orders: result });
    });
  }
}

export default Customer;
