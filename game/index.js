import {Map} from 'immutable'
let board = Map()

export const MOVE = 'MOVE'

// ACTION CREATOR
export const move = (player, coord) => ({
   type: MOVE,
   player,
   coord
})

function turnReducer(turn='X', action) {
  if (action.type === MOVE)
    return turn === 'X' ? 'O' : 'X'
  return turn
}

function boardReducer(board=Map(), action) {
  if (action.type === MOVE)
    return board.setIn(action.coord, action.player)
  return board
}

function streak(board, firstCoord, ...remainingCoords) {
  const player = board.getIn(firstCoord)
  if(!player) return null
  for(let rest of remainingCoords){
    if(board.getIn(rest) !== player) return null
  }
  return player
}

export function winner(board) {
  // Vertical
  for (let i = 3; i >= 0; i--)  {
    let row = streak(board, [0, i], [1, i], [2, i])
    if (row) return row
    let col = streak(board, [i, 0], [i, 1], [i, 2])
    if (col) return col
  }
  // Diagonal
    let diag1 = streak(board, [0, 0], [1, 1, [2, 2]])
    if (diag1) return diag1
    let diag2 = streak(board, [2, 0], [1, 1, [0, 2]])
    if (diag2) return diag2

  // ongoing
  for (let r = 3; r >= 0; r--) {
    for (let c = 3; c >= 0; c--) {
      if(!board.hasIn([r, c])) return null
    }
  }
  // draw
  return 'draw'
}

export const bad = ({turnReducer, boardReducer}, {type, player, coord}) => {
  if (type !== MOVE) return
  if (player !== turnReducer) return `It's not ${player}'s turn`
  if (coord.length !== 2) return `Specify row, column`
  const [row, col] = coord
  if (!Number.isInteger(row) || row < 0 || row > 2) return `Invalid row (must be 0-2): ${row}`
  if (!Number.isInteger(col) || col < 0 || col > 2) return `Invalid column (must be 0-2): ${col}`
  if (boardReducer.hasIn(coord)) return `Square ${coord} is already taken`
}

export default function reducer(game={}, action) {
  const nextBoard = boardReducer(game.board, action)
  // const winnerState = winner(nextBoard)
  return {
    board: nextBoard,
    turn: turnReducer(game.turn, action),
    winner: winner(nextBoard)
  }
}
