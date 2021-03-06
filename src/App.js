import './App.css';
import {getWords} from "./words";
import React, {Component} from 'react';
import RowComponent from "./Row.Component";
import {cyrb53} from "./cyrb53Hash";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfGuess: 0,
      isGameOver: false,
      answer: getWords[cyrb53(new Date().toISOString().slice(0, 10))%getWords.length],
      guesses: Array(6).fill(null).map(() => Object.create({word: '', correctness: Array(5).fill(0)})),
      input: "",
      shake: false

    }
    // this.handleInput = this.handleInput.bind(this);
    // this.handleKey = this.handleKey.bind(this);
    // this.onKeyPress = this.onKeyPress.bind(this);
    this.keepFocus = this.keepFocus.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {

    let currGuesses = this.state.guesses;
    if (this.state.numberOfGuess <= 5 && !this.state.isGameOver && currGuesses[this.state.numberOfGuess].word.length <= 5) {
      console.log(e.target.value.match(/^[a-zA-Z]{0,5}$/) !== null)
      if (e.target.value.match(/^[a-zA-Z]{0,5}$/)) {
        currGuesses[this.state.numberOfGuess].word = e.target.value;
        this.setState({
          guesses: currGuesses
        })
      } else {
        e.target.value = currGuesses[this.state.numberOfGuess].word.toLowerCase();
      }
    }
  }
  onSubmit(e) {
      e.preventDefault();
      if(!(this.state.numberOfGuess === 6) && this.state.guesses[this.state.numberOfGuess].word.length === 5){
        if(!getWords.includes(this.state.guesses[this.state.numberOfGuess].word.toLowerCase())){
          this.setState({shake: true});
          setTimeout(() => this.setState({shake: false}), 800);
          return;
        }
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
        const isOver = (JSON.stringify(correctness)===JSON.stringify([3, 3, 3, 3, 3])) || (this.state.numberOfGuess === 6);
        document.getElementById('input').value = '';
        this.setState({
          guesses: currGuesses,
          isGameOver: isOver,
          numberOfGuess: this.state.numberOfGuess + 1
        })
      }
  }
  // onKeyPress = (button) => {
  //   console.log(button)
  //   let input;
  //   switch (button){
  //     case '{enter}':
  //       input = 'enter'
  //     break;
  //     case '{bksp}':
  //       input = 'backspace'
  //     break;
  //     default:
  //       input = button
  //   }
  //   this.handleInput(input);
  // }
  // handleKey(e){
  //   this.handleInput(e.key.toLowerCase());
  // }
  // handleInput(key){
  //   if(!this.state.isGameOver && key === 'backspace'){
  //     let currGuesses = this.state.guesses;
  //     currGuesses[this.state.numberOfGuess].word = currGuesses[this.state.numberOfGuess].word.slice(0, -1);
  //     this.setState({
  //       guesses: currGuesses
  //     })
  //   }
  //   else if(!this.state.isGameOver && key === 'enter' && this.state.guesses[this.state.numberOfGuess].word.length === 5){
  //     let correctness = [];
  //     for(let i = 0; i < 5; i++){
  //       if(this.state.guesses[this.state.numberOfGuess].word[i].toLowerCase() === this.state.answer[i]){
  //         correctness.push(3);
  //       }else if (this.state.answer.includes(this.state.guesses[this.state.numberOfGuess].word[i].toLowerCase())){
  //         correctness.push(2);
  //       }else{
  //         correctness.push(1);
  //       }
  //     }
  //     let currGuesses = this.state.guesses;
  //     currGuesses[this.state.numberOfGuess].correctness = correctness;
  //     const isOver = (JSON.stringify(correctness)===JSON.stringify([3, 3, 3, 3, 3])) || (this.state.numberOfGuess === 5);
  //     if(isOver){
  //       window.removeEventListener("keydown", this.handleKey)
  //     }
  //     this.setState({
  //       guesses: currGuesses,
  //       isGameOver: isOver,
  //       numberOfGuess: this.state.numberOfGuess + 1
  //     })
  //   }
  //   else if(!this.state.isGameOver && key.match(/^[A-Za-z]$/) !== null && this.state.guesses[this.state.numberOfGuess].word.length < 5) {
  //     let currGuesses = this.state.guesses;
  //     currGuesses[this.state.numberOfGuess].word = currGuesses[this.state.numberOfGuess].word + key;
  //     this.setState({
  //       guesses: currGuesses
  //     })
  //   }
  // }
  keepFocus(){
    document.getElementById("input").focus();
  }
  componentDidMount() {
    console.log(this.state.answer)
    this.keepFocus();
    // window.addEventListener("keydown", this.handleKey)
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.state.numberOfGuess === 6){
      document.getElementById("myModal").style.display = "block";
    }
  }

  render() {
    const board = this.state.guesses.map((wordObj, idx) => (
        <RowComponent shake={!!(this.state.shake && idx === this.state.numberOfGuess)} key={idx} word={wordObj.word} correctness={wordObj.correctness}/>
    ))
    return (
        <div>
          {
            <div id="myModal" className="modal">
              <div className="modal-content">
                <p>Answer is {this.state.answer.toUpperCase()}</p>
              </div>
            </div>
          }
          <div className="board">
            {board}

          </div>
          <form onSubmit={this.onSubmit}>
            <input id="input" autoFocus={true}  onBlur={this.keepFocus} onChange={this.onChange} maxLength={5}/>
          </form>
        </div>
    );
  }
}

export default App;