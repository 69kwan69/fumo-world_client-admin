import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import image from '../images/home.jpg';
import { Link } from 'react-router-dom';

class Home extends Component {
  static contextType = MyContext; // using this.context to access global state

  render() {
    return (
      <div className="main grid grid-cols-2">
        <img
          className="block w-full"
          src={image}
          alt="Fumo sitting on a sofa."
        />
        <div className="place-self-center">
          <h1 className="title normal-case italic text-4xl">
            I wish I was a fumo.
            <br />
            no school, no work,
            <br />
            just{' '}
            <span className="font-serif text-5xl bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              fumo fumo.
            </span>
          </h1>

          <Link
            to="/admin/order"
            className="button font-bold uppercase mt-10 flex gap-4 items-center w-max"
          >
            Get to work now.{' '}
            <span class="material-symbols-rounded">arrow_forward</span>
          </Link>
        </div>
      </div>
    );
  }
}

export default Home;
