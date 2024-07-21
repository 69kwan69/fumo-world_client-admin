import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Order extends Component {
  static contextType = MyContext; // using this.context to access global state

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null,
    };
  }

  render() {
    const orders = this.state.orders.map((item, index) => {
      return (
        <tr key={item._id} onClick={() => this.trItemClick(item)}>
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
          <td className="flex flex-nowrap gap-4">
            {item.status === 'PENDING' && (
              <>
                <button
                  className="button"
                  onClick={() => this.lnkApproveClick(item._id)}
                >
                  Approve
                </button>
                <button
                  className="button"
                  onClick={(e) => this.lnkCancelClick(e, item._id)}
                >
                  Cancel
                </button>
              </>
            )}
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
          <h1 className="title mb-6">Orders</h1>

          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Creation date</th>
                  <th>Cust. name</th>
                  <th>Cust. phone</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{orders}</tbody>
            </table>
          </div>
        </div>

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
                    <th>Total price</th>
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
    this.apiGetOrders();
  }

  // event-handlers
  trItemClick(item) {
    this.setState({ order: item });
  }

  lnkApproveClick(id) {
    this.apiPutOrderStatus(id, 'APPROVED');
  }

  lnkCancelClick(id) {
    this.apiPutOrderStatus(id, 'CANCELED');
  }

  // apis
  apiGetOrders() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/orders', config).then((res) => {
      const result = res.data;
      this.setState({ orders: result });
    });
  }

  apiPutOrderStatus(id, status) {
    const body = { status: status };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/orders/status/' + id, body, config).then((res) => {
      const result = res.data;
      if (result) {
        this.apiGetOrders();
      } else {
        alert('SORRY BABY!');
      }
    });
  }
}
export default Order;
