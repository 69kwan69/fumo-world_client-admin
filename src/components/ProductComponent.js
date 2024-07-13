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

    const prods = this.state.products.map((item) => {
      return (
        <tr key={item._id} onClick={() => this.trItemClick(item)}>
          <td>
            <img src={'data:image/jpg;base64,' + item.image} alt="" />
          </td>
          <td>{item.name}</td>
          <td>{item.price}</td>
          <td>{item.category.name}</td>
          <td>{new Date(item.cdate).toLocaleString()}</td>
          <td className="space-x-4">
            <button
              className="button"
              onClick={() => this.openUpdateProduct(item)}
            >
              Update
            </button>
            <button
              className="button"
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
          className={`${
            index + 1 === this.state.curPage
              ? '!bg-slate-300 !text-black !hover:bg-slate-300'
              : ''
          } cursor-pointer rounded px-3 py-1 hover:bg-slate-100 text-slate-500`}
          key={index}
          onClick={() => this.lnkPageClick(index + 1)}
        >
          {index + 1}
        </span>
      )
    );

    return (
      <div className="main">
        <div className="mb-6 flex items-center justify-between gap-10">
          <h1 className="title">Products</h1>
          <button
            className="button shadow"
            onClick={() => this.openCreateProduct()}
          >
            New product
          </button>
        </div>

        <div className="table">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{prods}</tbody>
          </table>
        </div>

        <div className="mt-6 w-full flex justify-center items-center">
          {pagination}
        </div>

        <dialog id="add-product-dlg" className="dlg max-w-96">
          <form className="form">
            <h2 className="font-bold text-2xl">New Product</h2>
            <label>
              Name: <input type="text" name="name" />
            </label>
            <label>
              Price: <input type="number" name="price" />
            </label>
            <label>
              Category:{' '}
              <select
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

            <div className="buttons">
              <button className="button" onClick={(e) => this.btnAddClick(e)}>
                Create
              </button>
              <button
                type="button"
                className="button"
                onClick={() => this.closeCreateProduct()}
              >
                Cancel
              </button>
            </div>
          </form>
        </dialog>

        <dialog data-id id="update-product-dlg" className="dlg max-w-96">
          <form className="form">
            <h2 className="font-bold text-2xl">Edit Product</h2>
            <label>
              Name: <input type="text" name="name" />
            </label>
            <label>
              Price: <input type="number" name="price" />
            </label>
            <label>
              Category:{' '}
              <select
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

            <div className="buttons">
              <button
                className="button"
                onClick={(e) => this.btnUpdateClick(e)}
              >
                Confirm
              </button>
              <button
                type="button"
                className="button"
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
    this.setState({ imgProduct: '' });
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
    this.setState({ imgProduct: 'data:image/jpg;base64,' + image });

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
