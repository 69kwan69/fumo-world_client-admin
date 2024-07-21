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
        <tr key={item._id} onClick={() => this.trCustomerClick(item)}>
          <td>{index + 1}</td>
          <td>{item.username}</td>
          <td>{item.password}</td>
          <td>{item.name}</td>
          <td>{item.phone}</td>
          <td>{item.email}</td>
          <td>
            <span
              className={
                item.active == 1
                  ? 'text-green-700'
                  : item.active == 0
                  ? 'text-red-700'
                  : ''
              }
            >
              {item.active == 1 ? 'Active' : 'Inactive'}
            </span>
          </td>
          <td>
            {item.active === 0 ? (
              <button
                className="button"
                onClick={() => this.lnkEmailClick(item)}
              >
                Email
              </button>
            ) : (
              <button
                className="button"
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
        <tr key={item._id} onClick={() => this.trOrderClick(item)}>
          <td>{index + 1}</td>
          <td>{new Date(item.cdate).toLocaleString()}</td>
          <td>{item.customer.name}</td>
          <td>{item.customer.phone}</td>
          <td>${item.total}</td>
          <td>
            <span
              className={
                item.status === 'CANCELED'
                  ? 'text-red-700'
                  : item.status === 'APPROVED'
                  ? 'text-green-700'
                  : ''
              }
            >
              {item.status}
            </span>
          </td>
        </tr>
      );
    });

    if (this.state.order) {
      var items = this.state.order.items.map((item, index) => {
        return (
          <tr key={item.product._id}>
            <td>{index + 1}</td>
            <td>
              <img src={'data:image/jpg;base64,' + item.product.image} alt="" />
            </td>
            <td>{item.product.name}</td>
            <td>{item.product.category.name}</td>
            <td>{item.quantity}</td>
            <td>${item.product.price * item.quantity}</td>
          </tr>
        );
      });
    }

    return (
      <div className="main">
        <div>
          <h1 className="title mb-6">Customers</h1>

          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Username</th>
                  <th>Password</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Activity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{customers}</tbody>
            </table>
          </div>
        </div>

        {this.state.orders.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl uppercase mb-6">Orders</h2>
            <div className="table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Creation date</th>
                    <th>Cust.name</th>
                    <th>Cust.phone</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>{orders}</tbody>
              </table>
            </div>
          </div>
        )}

        {this.state.order && (
          <div className="mt-10">
            <h2 className="text-xl uppercase mb-6">Details</h2>
            <div className="table">
              <table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>{items}</tbody>
              </table>
            </div>
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
