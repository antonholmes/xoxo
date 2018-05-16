import {Map} from 'immutable'
let board = Map()

//onst move = (turn, [row, col]) ACTION TYPE
const MOVE = 'MOVE'

// ACTION CREATOR
export const move = function (player, position) {

  return {type: MOVE, player, position}
}

export default function reducer(state = {
  board,
  turn: 'X'
}, action) {
  // TODO
  switch (action.type) {
    case MOVE:
      const board = state
        .board
        .setIn(action.position, action.player)
        const turn = state.turn === 'X'
        ? 'O'
        : 'X'
      return {turn, board}
    default:
      return state
  }

}