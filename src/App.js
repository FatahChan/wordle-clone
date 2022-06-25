import './App.css';
import {getWords} from "./words";
import React, {Component} from 'react';
import RowComponent from "./Row.Component";
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

const keyboardLayout = {
  'default': [
    'q w e r t y u i o p {bksp}',
    'a s d f g h j k l {enter}',
    'z x c v b n m',
  ]
}
const keyboardDisplay = {
  '{bksp}': '🔙',
  '{enter}': '✔',
}
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfGuess: 0,
      isGameOver: false,
      answer: getWords[Math.floor(Math.random()*getWords.length)],
      guesses: Array(6).fill(null).map(() => Object.create({word: '', correctness: Array(5).fill(0)})),
    }
    this.handleInput = this.handleInput.bind(this);
    this.handleKey = this.handleKey.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }


  onKeyPress = (button) => {
    console.log(button)
    let input;
    switch (button){
      case '{enter}':
        input = 'enter'
      break;
      case '{bksp}':
        input = 'backspace'
      break;
      default:
        input = button
    }
    this.handleInput(input);
  }
  handleKey(e){
    this.handleInput(e.key.toLowerCase());
  }
  handleInput(key){
    if(!this.state.isGameOver && key === 'backspace'){
      let currGuesses = this.state.guesses;
      currGuesses[this.state.numberOfGuess].word = currGuesses[this.state.numberOfGuess].word.slice(0, -1);
      this.setState({
        guesses: currGuesses
      })
    }
    else if(!this.state.isGameOver && key === 'enter' && this.state.guesses[this.state.numberOfGuess].word.length === 5){
      let correctness = [];
      for(let i = 0; i < 5; i++){
        if(this.state.guesses[this.state.numberOfGuess].word[i].toLowerCase() === this.state.answer[i]){
          correctness.push(3);
        }else if (this.state.answer.includes(this.state.guesses[this.state.numberOfGuess].word[i].toLowerCase())){
          correctness.push(2);
        }else{
          correctness.push(1);
        }
      }
      let currGuesses = this.state.guesses;
      currGuesses[this.state.numberOfGuess].correctness = correctness;
      const isOver = (JSON.stringify(correctness)===JSON.stringify([3, 3, 3, 3, 3])) || (this.state.numberOfGuess === 5);
      if(isOver){
        window.removeEventListener("keydown", this.handleKey)
      }
      this.setState({
        guesses: currGuesses,
        isGameOver: isOver,
        numberOfGuess: this.state.numberOfGuess + 1
      })
    }
    else if(!this.state.isGameOver && key.match(/^[A-Za-z]$/) !== null && this.state.guesses[this.state.numberOfGuess].word.length < 5) {
      let currGuesses = this.state.guesses;
      currGuesses[this.state.numberOfGuess].word = currGuesses[this.state.numberOfGuess].word + key;
      this.setState({
        guesses: currGuesses
      })
    }
  }

  componentDidMount() {
    console.log(this.state.answer)
    window.addEventListener("keydown", this.handleKey)
  }
  render() {
    const board = this.state.guesses.map((wordObj, idx) => (
        <RowComponent key={idx} word={wordObj.word} correctness={wordObj.correctness}/>
    ))
    return (
        <div>
          <div className="board">
            {board}

          </div>
          <div className="keyboard">
            <Keyboard
                onKeyPress={this.onKeyPress}
                layout={keyboardLayout}
                display={keyboardDisplay}
            />
          </div>
        </div>


    );
  }
}

export default App;