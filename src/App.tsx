
/**
 * This module is a Typescript port of the official React tutorial
 * (https://reactjs.org/tutorial/tutorial.html) - an implementation
 * of the tic-tac-toe game.
 */

import React from 'react';
import './App.css';

export type SquareValue = 'X' | 'O' | null;

interface SquareProps {
  onClick: () => void;
  value: SquareValue;
}

/**
 * React component representing each of the 9 squares in a tic-tac-toe board.
 * @param props Component properties
 * @returns React component
 */
function Square(props: SquareProps): JSX.Element {
  return (
    <button className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

interface BoardProps {
  onClick: (i: number) => void;
  squares: SquareValue[];
}

/**
 * React component representing a tic-tac-toe game board composed of 9
 * inner Square components arranged in a 3x3 matrix.
 */
class Board extends React.Component<BoardProps> {

  /**
   * Render a Square component in position `i`.
   * @param i Square number (0 to 8, total of 9 Squares)
   * @returns Square component
   */
  renderSquare(i: number): JSX.Element {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  /**
   * Render this React component (Board)
   * @returns React component
   */
  render(): JSX.Element {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

interface GameStep {
  squares: SquareValue[];
}

interface GameState {
  history: GameStep[];
  stepNumber: number;
  xIsNext: boolean;
}

/**
 * React component representing a tic-tac-toe game and containing the game's
 * state and history. The render() method renders a Board component.
 */
class Game extends React.Component<{}, GameState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      stepNumber: 0,
      xIsNext: true
    };
  }

  /**
   * onClick handler passed down to a Square component (HTML button).
   * Update the Game's state and history, and possibly declare a winner.
   * @param i Square index (0 to 8 - each of the 9 squares in a tic-tac-toe board)
   */
  handleClick(i: number) {
    const history: GameStep[] = this.state.history.slice(0, this.state.stepNumber + 1);
    const current: GameStep = history[history.length - 1];
    const squares: SquareValue[] = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{ squares }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  /**
   * Reset the Game's state to the given history step number. This method
   * calls this.setState() that re-render()s by default, visually updating
   * the Board component.
   */
  jumpTo(step: number) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  /**
   * Render this React component (Game) including a Board component.
   * @returns React component
   */
  render(): JSX.Element {
    const history: GameStep[] = this.state.history;
    const current: GameStep = history[this.state.stepNumber];
    const winner: SquareValue = calculateWinner(current.squares);

    const moves: JSX.Element[] = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status: string;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

/**
 * Given a tic-tac-toe board state (the values of each of the board's 9 squares),
 * determine whether the winner is player 'X', 'O' or neither.
 *
 * @param squares An array of 9 tic-tac-toe board square values: 'X', 'O', null
 * @returns The string 'X' or 'O' representing the winner, or null in case there
 * is not a winner.
 */
export function calculateWinner(squares: SquareValue[]): SquareValue {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export const App = Game;
