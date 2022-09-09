
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { App, calculateWinner, SquareValue } from './App';


test('Renders the game initial status', () => {
  render(<App />);

  const nextPlayerLabel = screen.getByText('Next player: X');
  expect(nextPlayerLabel).toBeInTheDocument();

  const goToGameStartButton = screen.getByRole((role, element) =>
    role === 'button' && element?.innerHTML === 'Go to game start');
  expect(goToGameStartButton).toBeInTheDocument();

  // Expect there to be 10 buttons: 9 board squares and 1 history button
  expect(screen.getAllByRole('button').length).toEqual(10);
});

test('Renders "X" and "O" when squares are clicked in turn', async () => {
  render(<App />);
  const squares = screen.getAllByRole((role, element) =>
    role === 'button' && element?.className === 'square');

  expect(squares.map(s => s.innerHTML)).toEqual(Array(9).fill(''));
  expect(screen.getByText('Next player: X')).toBeInTheDocument();

  const sq0 = squares[0];
  const sq1 = squares[1];
  await userEvent.click(sq0);
  expect(sq0.innerHTML).toEqual('X');
  expect(sq1.innerHTML).toEqual('');
  expect(screen.getByText('Next player: O')).toBeInTheDocument();

  await userEvent.click(sq1);
  expect(sq0.innerHTML).toEqual('X');
  expect(sq1.innerHTML).toEqual('O');
  expect(screen.getByText('Next player: X')).toBeInTheDocument();
});

test('Renders the winner and prevents further square clicks', async () => {
  render(<App />);
  const squares = screen.getAllByRole((role, element) =>
    role === 'button' && element?.className === 'square');

  expect(squares.map(s => s.innerHTML)).toEqual(Array(9).fill(''));
  expect(screen.getByText('Next player: X')).toBeInTheDocument();

  await userEvent.click(squares[0]);
  expect(screen.getByText('Next player: O')).toBeInTheDocument();
  expect(squares.map(s => s.innerHTML))
    .toEqual(['X', '', '', '', '', '', '', '', '']);

  await userEvent.click(squares[1]);
  expect(screen.getByText('Next player: X')).toBeInTheDocument();
  expect(squares.map(s => s.innerHTML))
    .toEqual(['X', 'O', '', '', '', '', '', '', '']);

  await userEvent.click(squares[4]);
  expect(screen.getByText('Next player: O')).toBeInTheDocument();
  expect(squares.map(s => s.innerHTML))
    .toEqual(['X', 'O', '', '', 'X', '', '', '', '']);

  await userEvent.click(squares[2]);
  expect(screen.getByText('Next player: X')).toBeInTheDocument();
  expect(squares.map(s => s.innerHTML))
    .toEqual(['X', 'O', 'O', '', 'X', '', '', '', '']);

  await userEvent.click(squares[8]);
  expect(screen.getByText('Winner: X')).toBeInTheDocument();
  expect(squares.map(s => s.innerHTML))
    .toEqual(['X', 'O', 'O', '', 'X', '', '', '', 'X']);

  await userEvent.click(squares[3]);
  expect(screen.getByText('Winner: X')).toBeInTheDocument();
  expect(squares.map(s => s.innerHTML))
    .toEqual(['X', 'O', 'O', '', 'X', '', '', '', 'X']);
});

test('Renders history buttons', async () => {
  render(<App />);

  const squares = screen.getAllByRole((role, element) =>
    role === 'button' && element?.className === 'square');

  expect(squares.length).toEqual(9);

  const sq0 = squares[0];
  const sq1 = squares[1];
  await userEvent.click(sq0);
  await userEvent.click(sq1);

  const historyButtons = screen.getAllByRole((role, element) =>
    role === 'button' && element?.className !== 'square');

  expect(historyButtons.map(b => b.innerHTML))
    .toEqual(['Go to game start', 'Go to move #1', 'Go to move #2']);

});

test('Renders previous game states when history buttons are clicked', async () => {
  render(<App />);

  const squares = screen.getAllByRole((role, element) =>
    role === 'button' && element?.className === 'square');

  expect(squares.length).toEqual(9);
  expect(screen.getByText('Next player: X')).toBeInTheDocument();

  const sq0 = squares[0];
  const sq1 = squares[1];
  await userEvent.click(sq0);
  await userEvent.click(sq1);
  expect(screen.getByText('Next player: X')).toBeInTheDocument();
  expect(squares.map(s => s.innerHTML))
    .toEqual(['X', 'O', '', '', '', '', '', '', '']);

  const gameStartButton = screen.getByText('Go to game start');
  const move1Button = screen.getByText('Go to move #1');
  const move2Button = screen.getByText('Go to move #2');

  await userEvent.click(move1Button);
  expect(screen.getByText('Next player: O')).toBeInTheDocument();
  expect(squares.map(s => s.innerHTML))
    .toEqual(['X', '', '', '', '', '', '', '', '']);

  await userEvent.click(gameStartButton);
  expect(screen.getByText('Next player: X')).toBeInTheDocument();
  expect(squares.map(s => s.innerHTML))
    .toEqual(['', '', '', '', '', '', '', '', '']);
  
  await userEvent.click(move2Button);
  expect(screen.getByText('Next player: X')).toBeInTheDocument();
  expect(squares.map(s => s.innerHTML))
    .toEqual(['X', 'O', '', '', '', '', '', '', '']);
});

test('Removes some history buttons when the history changes', async () => {
  render(<App />);

  const squares = screen.getAllByRole((role, element) =>
    role === 'button' && element?.className === 'square');

  expect(squares.length).toEqual(9);
  expect(screen.getByText('Next player: X')).toBeInTheDocument();

  const sq0 = squares[0];
  const sq1 = squares[1];
  await userEvent.click(sq0);
  await userEvent.click(sq1);

  const getHistoryButtons = () => screen.getAllByRole((role, element) =>
    role === 'button' && element?.className !== 'square');

  let historyButtons = getHistoryButtons();
  expect(historyButtons.length).toEqual(3);

  const gameStartButton = historyButtons[0];
  await userEvent.click(gameStartButton);
  expect(screen.getByText('Next player: X')).toBeInTheDocument();
  expect(squares.map(s => s.innerHTML))
    .toEqual(['', '', '', '', '', '', '', '', '']);

  await userEvent.click(sq1);
  expect(screen.getByText('Next player: O')).toBeInTheDocument();
  expect(squares.map(s => s.innerHTML))
    .toEqual(['', 'X', '', '', '', '', '', '', '']);

  expect(getHistoryButtons().length).toEqual(2);
});

test('Calculates the winner (calculateWinner() algorithm)', () => {
  const testBoards = getTestBoards();

  for (const board of testBoards) {
    const winner: SquareValue = calculateWinner(board.board);
    expect(winner).toEqual(board.winner);
  }

  function invertPlayer(player: SquareValue): SquareValue {
    return player === 'X' ? 'O' : (player === 'O' ? 'X' : player);
  }

  // Repeat the tests swapping 'X' and 'O' players
  for (const board of testBoards) {
    const Oboard = {
      board: board.board.map(v => invertPlayer(v)),
      winner: invertPlayer(board.winner),
    }
    const winner: SquareValue = calculateWinner(Oboard.board);
    expect(winner).toEqual(Oboard.winner);
  }
});

function getTestBoards(): Array<{ board: SquareValue[], winner: SquareValue }> {
  const winnerRowBoards = `
    | X X X | X X X | X X X | O O   |   O O | O     |     O |
    | O     |   O   |     O | X X X | X X X |   O   |   O   |
    | O     |   O   |     O |       |       | X X X | X X X |
  `;
  const winnerColumnBoards = `
    | X O O | X     | X     | O X   |   X O | O   X |     X |
    | X     | X O O | X     | O X   |   X O |   O X |   O X |
    | X     | X     | X O O |   X   |   X   |     X | O   X |
  `;
  const winnerDiagonalBoards = `
    | X O O | X     | X     | X   O | O O X |     X | O   X |     X |
    |   X   |   X   | O X   |   X O |   X   |   X   | O X   |   X O |
    |     X | O O X | O   X |     X | X     | X O O | X     | X   O |
  `;
  const noWinnerBoards = `
    | X O O | X O X | X     | X   O |       |
    | O X X | X X O |       |       |       |
    | X X O | O X O |       |       |       |
  `;

  /** Parse tic-tac-toe boards in the ASCII-art format above */
  function parseTicTacToeBoards(boardLines: string): SquareValue[][] {

    // Sample input: '| O O X | O   X |'
    // Sample output: [ ['O', 'O', 'X'], ['O', null, 'X'] ]
    function parseLine(line: string): SquareValue[][] {
      return (line.trim().split('|').filter(chunk => chunk)
        .map(chunk => [chunk[1], chunk[3], chunk[5]]
          .map(v => v === ' ' ? null : v) as SquareValue[])
      );
    }

    function mergeChunks(chunks: SquareValue[][], accumulator: SquareValue[][]) {
      if (accumulator.length === 0) {
        accumulator.push(...chunks);
      } else {
        chunks.forEach((chunk, i) => accumulator[i].push(...chunk));
      }
    }

    const boards: SquareValue[][] = [];
    boardLines.split('\n').forEach(line =>
      mergeChunks(parseLine(line), boards));
    return boards;
  }

  const testBoards: Array<{ board: SquareValue[], winner: SquareValue }> = [];

  const xWinnerBoards = [winnerRowBoards, winnerColumnBoards, winnerDiagonalBoards];
  xWinnerBoards.forEach(boards =>
    parseTicTacToeBoards(boards)
      .forEach(board => testBoards.push({ board, winner: 'X' }))
  );
  parseTicTacToeBoards(noWinnerBoards)
    .forEach(board => testBoards.push({ board, winner: null }));

  return testBoards;
}
