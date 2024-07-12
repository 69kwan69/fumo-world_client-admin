import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Home extends Component {
  static contextType = MyContext; // using this.context to access global state

  render() {
    return (
      <div className="p-10">
        <h2 className="font-bold text-3xl">
          Ohayo, {this.context.username} nii-chan!
        </h2>
        <img
          className="block w-full"
          src="https://w7.pngwing.com/pngs/225/339/png-transparent-internet-meme-pol-anime-meme-child-mammal-hand.png"
          width="800px"
          alt=""
        />
      </div>
    );
  }
}

export default Home;
