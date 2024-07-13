import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import image from '../images/home.jpg';

class Home extends Component {
  static contextType = MyContext; // using this.context to access global state

  render() {
    return (
      <div className="main">
        <h1 className="title normal-case">
          Ohayo, {this.context.username} nii-chan!
        </h1>
        <img className="block w-full" src={image} alt="" />
      </div>
    );
  }
}

export default Home;
