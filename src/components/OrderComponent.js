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
        <tr
          key={item._id}
          className={
            index % 2 === 0
              ? 'hover:bg-slate-100'
              : 'hover:bg-slate-100 bg-slate-50'
          }
          onClick={() => this.trItemClick(item)}
        >
          <td className="p-4 text-left">{item._id}</td>
          <td className="p-4 text-left">
            {new Date(item.cdate).toLocaleString()}
          </td>
          <td className="p-4 text-left">{item.customer.name}</td>
          <td className="p-4 text-left">{item.customer.phone}</td>
          <td className="p-4 text-left">{item.total}</td>
          <td className="p-4 text-left">{item.status}</td>
          <td className="p-4 text-left">
            {item.status === 'PENDING' && (
              <div>
                <button
                  className="hover:bg-slate-200 normal-case border rounded px-2 py-1"
                  onClick={() => this.lnkApproveClick(item._id)}
                >
                  Approve
                </button>
                <button
                  className="hover:bg-red-600 hover:text-white normal-case border rounded px-2 py-1"
                  onClick={(e) => this.lnkCancelClick(e, item._id)}
                >
                  Cancel
                </button>
              </div>
            )}
          </td>
        </tr>
      );
    });

    if (this.state.order) {
      var items = this.state.order.items.map((item, index) => {
        return (
          <tr
            className={
              index % 2 === 0
                ? 'hover:bg-slate-100'
                : 'hover:bg-slate-100 bg-slate-50'
            }
            key={item.product._id}
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
          <h1 className="font-bold text-2xl uppercase mb-6">Orders</h1>

          <table className="table-auto border-collapse border w-full">
            <thead>
              <tr className="border-b bg-slate-300">
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Creation date</th>
                <th className="p-4 text-left">Cust.name</th>
                <th className="p-4 text-left">Cust.phone</th>
                <th className="p-4 text-left">Total</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>{orders}</tbody>
          </table>
        </div>

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
