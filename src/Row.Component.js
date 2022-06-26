import React, {Component} from 'react';


class RowComponent extends Component {




  render() {
    let tiles = [];
    for (let i = 0; i < 5; i++) {
      let correctness = '';
      switch (this.props.correctness[i]){
        case 1:
          correctness = 'incorrect';
        break;
        case 2:
          correctness = 'misplace';
        break;
        case 3:
          correctness = 'correct';
        break;
        default:
          correctness = '';
      }

      tiles.push(
          <div key={i} className={`tile ${correctness} ${this.props.shake? "shake": ""}`}>
            {this.props.word[i]? this.props.word[i].toUpperCase(): ''}
          </div>)
    }
    return (
        <div className="row">
          {tiles}
        </div>
    );
  }
}

export default RowComponent;