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
          <td className="py-2 px-4 flex items-center justify-center gap-2">
            <button
              className="hover:bg-slate-200 normal-case border rounded px-2 py-1"
              onClick={() => this.openUpdateCategory(item._id, item.name)}
            >
              Update
            </button>
            <button
              className="hover:bg-red-600 hover:text-white normal-case border rounded px-2 py-1"
              onClick={(e) =>
                this.btnDeleteClick(e, { txtID: item._id, txtName: item.name })
              }
            >
              Delete
            </button>
          </td>
        </tr>
      );
    });

    return (
      <div className="p-10">
        <div className="mb-6 flex justify-between items-center gap-10">
          <h1 className="font-bold text-2xl uppercase">Categories</h1>
          <button
            className="hover:bg-green-600 hover:text-white normal-case border rounded px-2 py-1"
            onClick={() => this.openCreateCategory()}
          >
            New Category
          </button>
        </div>
        <div className="">
          <table className="table-auto border-collapse border w-full">
            <thead className="border-b bg-slate-300">
              <tr>
                <th className="p-4 text-left">Id</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>{cates}</tbody>
          </table>
          {/* <CategoryDetail
            item={this.state.itemSelected}
            updateCategories={this.updateCategories}
          /> */}
        </div>

        <dialog id="add-category-dlg" className="rounded border">
          <form className="flex gap-4 p-4 justify-center items-center">
            <input
              id="add-category"
              className="px-4 py-2 border rounded"
              type="text"
              placeholder="Category name..."
            />
            <button
              className="hover:bg-slate-200 normal-case border rounded px-2 py-1"
              onClick={(e) => this.btnAddClick(e)}
            >
              Create
            </button>
            <button
              type="button"
              className="hover:bg-red-600 hover:text-white normal-case border rounded px-2 py-1"
              onClick={() => this.closeCreateCategory()}
            >
              Cancel
            </button>
          </form>
        </dialog>

        <dialog id="update-category-dlg" className="rounded border">
          <form className="flex gap-4 p-4 justify-center items-center">
            <input
              id="update-category"
              className="px-4 py-2 border rounded"
              type="text"
              placeholder="Category name..."
              data-id
            />
            <button
              className="hover:bg-slate-200 normal-case border rounded px-2 py-1"
              onClick={(e) => this.btnUpdateClick(e)}
            >
              Update
            </button>
            <button
              type="button"
              className="hover:bg-red-600 hover:text-white normal-case border rounded px-2 py-1"
              onClick={() => this.closeUpdateCategory()}
            >
              Cancel
            </button>
          </form>
        </dialog>
      </div>
    );
  }

  // dialog
  openCreateCategory() {
    document.querySelector('#add-category-dlg').showModal();
  }

  openUpdateCategory(id, name) {
    const modal = document.querySelector('#update-category-dlg');
    modal.querySelector('#update-category').dataset.id = id;
    modal.querySelector('#update-category').value = name;
    modal.showModal();
  }

  closeCreateCategory() {
    document.querySelector('#add-category-dlg').close();
  }

  closeUpdateCategory() {
    document.querySelector('#update-category-dlg').close();
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  updateCategories = (categories) => {
    // arrow-function
    this.setState({ categories: categories });
  };

  // event-handlers
  trItemClick(item) {
    this.setState({ itemSelected: item });
  }

  btnAddClick(e) {
    e.preventDefault();
    const name = document.querySelector('#add-category').value;
    if (name) {
      const cate = { name: name };
      this.apiPostCategory(cate);
    } else {
      alert('Please input name');
    }
  }

  btnUpdateClick(e) {
    e.preventDefault();
    const id = document.querySelector('#update-category').dataset.id;
    const name = document.querySelector('#update-category').value;
    console.log(id, name);
    if (id && name) {
      const cate = { name: name };
      this.apiPutCategory(id, cate);
    } else {
      alert('Please input name');
    }
  }

  btnDeleteClick(e, item) {
    e.preventDefault();
    if (window.confirm('ARE YOU SURE?')) {
      const id = item.txtID;
      if (id) {
        this.apiDeleteCategory(id);
      } else {
        alert('Please input id');
      }
    }
  }

  // apis
  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories', config).then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    });
  }

  apiPostCategory(cate) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/admin/categories', cate, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('OK BABY!');
        this.apiGetCategories();
      } else {
        alert('SORRY BABY!');
      }
    });
  }

  apiPutCategory(id, cate) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/categories/' + id, cate, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('OK BABY!');
        this.apiGetCategories();
      } else {
        alert('SORRY BABY!');
      }
    });
  }

  apiDeleteCategory(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.delete('/api/admin/categories/' + id, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('OK BABY!');
        this.apiGetCategories();
      } else {
        alert('SORRY BABY!');
      }
    });
  }
}

export default Category;
