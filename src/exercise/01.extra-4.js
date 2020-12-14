// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'

function countReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: action.count
      }
    default:
      return state;
  }
}

function Counter({ initialCount = 4, step = 4 }) {
  const [state, dispatch] = React.useReducer(countReducer, {
    count: initialCount,
  });
  const { count } = state;
  const increment = () => dispatch({ type: 'INCREMENT', count: state.count + step });
  return <button onClick={increment}>{count}</button>
}

function App() {
  return <Counter />
}

export default App
