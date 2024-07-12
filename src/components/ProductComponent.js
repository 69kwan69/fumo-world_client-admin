import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Product extends Component {
  static contextType = MyContext; // using this.context to access global state

  constructor(props) {
    super(props);
    this.state = {
      products: [],
      categories: [],
      noPages: 0,
      curPage: 1,
      itemSelected: null,
    };
  }

  render() {
    const cates = this.state.categories.map((cate) => {
      if (this.props.item != null) {
        return (
          <option
            key={cate._id}
            value={cate._id}
            selected={cate._id === this.props.item.category._id}
          >
            {cate.name}
          </option>
        );
      } else {
        return (
          <option key={cate._id} value={cate._id}>
            {cate.name}
          </option>
        );
      }
    });

    const prods = this.state.products.map((item, index) => {
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
          <td className="py-2 px-4">
            <img
              src={'data:image/jpg;base64,' + item.image}
              width="100px"
              height="100px"
              alt=""
            />
          </td>
          <td className="py-2 px-4">{item.name}</td>
          <td className="py-2 px-4">{item.price}</td>
          <td className="py-2 px-4">{item.category.name}</td>
          <td className="py-2 px-4">{new Date(item.cdate).toLocaleString()}</td>
          <td className="py-2 px-4">
            <button
              className="hover:bg-slate-200 normal-case border rounded px-2 py-1"
              onClick={() => this.openUpdateProduct(item)}
            >
              Update
            </button>
            <button
              className="hover:bg-red-600 hover:text-white normal-case border rounded px-2 py-1"
              onClick={(e) => this.btnDeleteClick(e, item._id)}
            >
              Delete
            </button>
          </td>
        </tr>
      );
    });

    const pagination = Array.from(
      { length: this.state.noPages },
      (_, index) => (
        <span
          className={`hover:underline cursor-pointer ${
            index + 1 === this.state.curPage ? 'font-bold' : ''
          }`}
          key={index}
          onClick={() => this.lnkPageClick(index + 1)}
        >
          {index + 1}
        </span>
      )
    );

    return (
      <div className="p-10">
        <div className="mb-6 flex items-center justify-between gap-10">
          <h1 className="font-bold text-2xl uppercase">Products</h1>
          <button
            className="hover:bg-green-600 hover:text-white normal-case border rounded px-2 py-1"
            onClick={() => this.openCreateProduct()}
          >
            New Product
          </button>
        </div>

        <table className="table-auto border-collapse border w-full">
          <thead className="border-b bg-slate-300">
            <tr>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Created At</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>{prods}</tbody>
        </table>

        <div className="mt-6 w-full flex justify-center gap-2 text-lg items-center">
          {pagination}
        </div>

        <dialog id="add-product-dlg" className="rounded border max-w-72">
          <form className="flex flex-col gap-4 p-6">
            <h2 className="font-bold text-xl">New Product</h2>
            <label>
              Name:{' '}
              <input
                className="px-4 py-2 border rounded w-full"
                type="text"
                name="name"
              />
            </label>
            <label>
              Price:{' '}
              <input
                className="px-4 py-2 border rounded w-full"
                type="number"
                name="price"
              />
            </label>
            <label>
              Category:{' '}
              <select
                className="px-4 py-2 border rounded w-full"
                name="category"
                onChange={(e) => {
                  this.setState({ cmbCategory: e.target.value });
                }}
              >
                <option value="select">select</option>
                {cates}
              </select>
            </label>
            <label>
              Image:{' '}
              <input
                type="file"
                name="fileImage"
                accept="image/jpeg, image/png, image/gif"
                onChange={(e) => this.previewImage(e)}
              />
            </label>

            <img className="block w-full" src={this.state.imgProduct} alt="" />

            <div className="flex justify-between gap-4">
              <button
                className="hover:bg-slate-200 normal-case border rounded px-2 py-1 flex-1"
                onClick={(e) => this.btnAddClick(e)}
              >
                Create
              </button>
              <button
                type="button"
                className="hover:bg-red-600 hover:text-white normal-case border rounded px-2 py-1 flex-1"
                onClick={() => this.closeCreateProduct()}
              >
                Cancel
              </button>
            </div>
          </form>
        </dialog>

        <dialog
          data-id
          id="update-product-dlg"
          className="rounded border max-w-72"
        >
          <form className="flex flex-col gap-4 p-6">
            <h2 className="font-bold text-xl">Edit Product</h2>
            <label>
              Name:{' '}
              <input
                className="px-4 py-2 border rounded w-full"
                type="text"
                name="name"
              />
            </label>
            <label>
              Price:{' '}
              <input
                className="px-4 py-2 border rounded w-full"
                type="number"
                name="price"
              />
            </label>
            <label>
              Category:{' '}
              <select
                className="px-4 py-2 border rounded w-full"
                name="category"
                onChange={(e) => {
                  this.setState({ cmbCategory: e.target.value });
                }}
              >
                <option value="select">select</option>
                {cates}
              </select>
            </label>
            <label>
              Image:{' '}
              <input
                type="file"
                name="fileImage"
                accept="image/jpeg, image/png, image/gif"
                onChange={(e) => this.previewImage(e)}
              />
            </label>

            <img className="block w-full" src={this.state.imgProduct} alt="" />

            <div className="flex justify-between gap-4">
              <button
                className="hover:bg-slate-200 normal-case border rounded px-2 py-1 flex-1"
                onClick={(e) => this.btnUpdateClick(e)}
              >
                Confirm
              </button>
              <button
                type="button"
                className="hover:bg-red-600 hover:text-white normal-case border rounded px-2 py-1 flex-1"
                onClick={() => this.closeUpdateProduct()}
              >
                Cancel
              </button>
            </div>
          </form>
        </dialog>
      </div>
    );
  }

  // dialog
  openCreateProduct() {
    document.querySelector('#add-product-dlg').showModal();
  }

  openUpdateProduct(item) {
    const { _id, name, price, category, image } = item;

    const modal = document.querySelector('#update-product-dlg');
    modal.dataset.id = _id;
    modal.querySelector('[name="name"]').value = name;
    modal.querySelector('[name="price"]').value = price;
    modal.querySelectorAll('option').forEach((option) => {
      if (option.value === category._id) option.selected = true;
    });
    this.state.imgProduct = 'data:image/jpg;base64,' + image;

    modal.showModal();
  }

  closeCreateProduct() {
    document.querySelector('#add-product-dlg').close();
  }

  closeUpdateProduct() {
    document.querySelector('#update-product-dlg').close();
  }

  updateProducts = (products, noPages, curPage) => {
    this.setState({ products: products, noPages: noPages, curPage: curPage });
  };

  componentDidMount() {
    this.apiGetProducts(this.state.curPage);
    this.apiGetCategories();
  }

  // event-handlers
  lnkPageClick(index) {
    this.apiGetProducts(index);
  }

  trItemClick(item) {
    this.setState({ itemSelected: item });
  }

  previewImage(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        this.setState({ imgProduct: evt.target.result });
      };
      reader.readAsDataURL(file);
    }
  }

  btnAddClick(e) {
    e.preventDefault();
    const form = document.querySelector('#add-product-dlg');
    const name = form.querySelector('[name="name"]').value;
    const price = parseInt(form.querySelector('[name="price"]').value);
    const category = this.state.cmbCategory;
    const image = this.state.imgProduct.replace(
      /^data:image\/[a-z]+;base64,/,
      ''
    ); // remove "data:image/...;base64,"
    if (name && price && category && category !== 'select' && image) {
      const prod = {
        name: name,
        price: price,
        category: category,
        image: image,
      };
      this.apiPostProduct(prod);
    } else {
      alert('Please input name and price and category and image');
    }
  }

  btnUpdateClick(e) {
    e.preventDefault();
    const form = document.querySelector('#update-product-dlg');
    const id = form.dataset.id;
    const name = form.querySelector('[name="name"]').value;
    const price = parseInt(form.querySelector('[name="price"]').value);
    const category = form.querySelector('[name="category"]').value;
    const image = this.state.imgProduct.replace(
      /^data:image\/[a-z]+;base64,/,
      ''
    ); // remove "data:image/...;base64,"
    // console.log(id, name, price, category, image);
    if (id && name && price && category && category !== 'select' && image) {
      const prod = {
        name: name,
        price: price,
        category: category,
        image: image,
      };
      this.apiPutProduct(id, prod);
    } else {
      alert('Please input id and name and price and category and image');
    }
  }

  btnDeleteClick(e, txtID) {
    e.preventDefault();
    if (window.confirm('ARE YOU SURE?')) {
      const id = txtID;
      if (id) {
        this.apiDeleteProduct(id);
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

  apiGetProducts(page) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/products?page=' + page, config).then((res) => {
      const result = res.data;
      this.setState({
        products: result.products,
        noPages: result.noPages,
        curPage: result.curPage,
      });
    });
  }

  apiPostProduct(prod) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/admin/products', prod, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('OK BABY!');
        this.apiGetProducts();
      } else {
        alert('SORRY BABY!');
      }
    });
  }

  apiDeleteProduct(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.delete('/api/admin/products/' + id, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('OK BABY!');
        this.apiGetProducts();
      } else {
        alert('SORRY BABY!');
      }
    });
  }

  apiPutProduct(id, prod) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/products/' + id, prod, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('OK BABY!');
        this.apiGetProducts();
      } else {
        alert('SORRY BABY!');
      }
    });
  }
}

export default Product;
