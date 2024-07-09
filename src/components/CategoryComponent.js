import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CategoryDetail from './CategoryDetailComponent';

class Category extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      itemSelected: null,
    };
  }

  render() {
    const cates = this.state.categories.map((item, index) => {
      return (
        <tr
          className={
            index % 2 == 0
              ? 'hover:bg-slate-100'
              : 'hover:bg-slate-100 bg-slate-50'
          }
          key={item._id}
          onClick={() => this.trItemClick(item)}
        >
          <td className="py-2 px-4">{item._id}</td>
          <td className="py-2 px-4">{item.name}</td>
        </tr>
      );
    });

    return (
      <div className="p-10">
        <h1 className="font-bold text-2xl uppercase mb-6">Category</h1>
        <div className="grid grid-cols-5">
          <table className="col-span-3 table-auto border-collapse border w-full">
            <thead className="border-b bg-slate-300">
              <tr>
                <th className="p-4 text-left">Id</th>
                <th className="p-4 text-left">Name</th>
              </tr>
            </thead>
            <tbody>{cates}</tbody>
          </table>
          <div className="col-span-2" />
          <CategoryDetail
            item={this.state.itemSelected}
            updateCategories={this.updateCategories}
          />
        </div>
      </div>
    );
  }

  componentDidMount() {
    // this.apiGetCategories();
  }

  // event-handlers
  trItemClick(item) {
    this.setState({ itemSelected: item });
  }

  // apis
  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories', config).then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    });
  }

  updateCategories = (categories) => {
    // arrow-function
    this.setState({ categories: categories });
  };
}
export default Category;
