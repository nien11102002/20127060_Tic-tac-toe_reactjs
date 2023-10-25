import { useEffect, useState } from 'react';

function Square({ value, onSquareClick,isWinning }) {
  var className="square"
  if(isWinning)
    className+=" winning"
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares,i);
  }

  const winnerInfo = calculateWinner(squares);
  let status;
if (winnerInfo && winnerInfo.winner !== 'draw') {
  status = 'Winner: ' + winnerInfo.winner;
} else if (winnerInfo && winnerInfo.winner === 'draw') {
  status = 'Draw';
} else {
  status = 'Next player: ' + (xIsNext ? 'X' : 'O');
}

  const generateSquare = (i) => {
    const isWinSquare= winnerInfo && winnerInfo.line && winnerInfo.line.includes(i)
    return(
      <Square
        key={i} 
        value={squares[i]} 
        onSquareClick={() => handleClick(i)}
        isWinning={isWinSquare} />
    )
  }

  const generateBoard = () => {
    var board=[]  
    for (let i = 0;i<3;i++){
      var rowSquares=[]
      for (let j = 0;j<3;j++)
      {
        rowSquares.push(generateSquare(i*3+j))
      }
      board.push(
        <div className='board-row' key={i}>
          {rowSquares}
        </div>
      )
    }

    return board
      
  }
  return (
    <>
      <div className="status">{status}</div>
      {generateBoard()}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscendingMoves,setAscendingMoves]=useState(1)
  const [historyIndex,setHistoryIndex]=useState([])
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function calculateRowCol(index) {
    const row = Math.floor(index / 3) +1;
    const col = index % 3 +1; 
    return { row, col };
  }

  function handlePlay(nextSquares, index) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    const nextHistoryIndex = [...historyIndex.slice(0, currentMove), calculateRowCol(index)];
    setHistoryIndex(nextHistoryIndex);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      const { row, col } = historyIndex[move - 1];
      description = `Go to move #${move} (${row}, ${col})`;
    } else {
      description = 'Go to game start';
    }
    if (move === currentMove) {
      return (
        <li key={move}>
          <div>You are at move #{move}</div>
        </li>
      );
    } else {
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
    }
  });

  function sortMove(){
    setAscendingMoves(!isAscendingMoves)
  }
  
  const sortMoveButton = () => {
      let movesOrder='Ascending'
      if(!isAscendingMoves)
        movesOrder='Descending'
      return(
        <button onClick={()=>sortMove()}>{movesOrder}</button>
      )
  }

  const sortedMoves = () => {
    if(!isAscendingMoves)
    return moves.slice().reverse();
    else return moves;
  }
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{sortedMoves()}</ol>
      </div>
      <div className='moves-sort'>
        {sortMoveButton()}
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner:squares[a],
        line: lines[i]
      }
    }
  }

  if (squares.every(square => square !== null)) {
    return {
      winner: 'draw',
      line: null
    };
  }

  return null;
}


 

