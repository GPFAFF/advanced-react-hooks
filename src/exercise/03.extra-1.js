// useContext: simple Counter
// http://localhost:3000/isolated/exercise/03.js

import * as React from 'react'

const useCount = () => {
  const CountContext = React.createContext({});
  const [count, setCount] = React.useState();

  const CountProvider = (props) => {
    const value = [count, setCount];

    return (
      <CountContext.Provider value={value} {...props} />
    )
  }

  return {
    count, setCount, CountProvider
  }
}

function CountDisplay() {
  // 🐨 get the count from useContext with the CountContext
  const { count } = useCount();
  return <div>{`The current count is ${count}`}</div>
}

function Counter() {
  // 🐨 get the setCount from useContext with the CountContext
  const { setCount } = useCount();
  const increment = () => setCount(c => c + 1)
  return <button onClick={increment}>Increment count</button>
}

function App() {
  const { CountProvider } = useCount();
  return (
    <div>
      <CountProvider>
        <CountDisplay />
        <Counter />
      </CountProvider>
    </div>
  )
}

export default App
