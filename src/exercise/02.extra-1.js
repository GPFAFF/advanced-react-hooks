// useCallback: custom hooks
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from '../pokemon'

function asyncReducer(state, action) {
  switch (action.type) {
    case 'pending': {
      return {
        status: 'pending',
        data: null,
        error: null
      }
    }
    case 'resolved': {
      return {
        status: 'resolved',
        data: action.data,
        error: null
      }
    }
    case 'rejected': {
      return {
        status: 'rejected',
        data: null,
        error: action.error
      }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function useAsync(callback, initialState, dependencies) {
  const [state, dispatch] = React.useReducer(asyncReducer, {
    status: 'idle',
    data: null,
    error: null,
    ...initialState,
  })

  const { data, status, error } = state;

  React.useEffect(() => {
    const promise = callback();

    if (!promise) return;

    dispatch({ type: 'pending' })
    promise.then(
      data => dispatch({ type: 'resolved', data }),
      error => dispatch({ type: 'rejected', error }),
    )
  }, [callback])

  return {
    data,
    status,
    error,
  }
}

function PokemonInfo({ pokemonName }) {
  const asyncCallback = React.useCallback(
    () => {
      if (!pokemonName) return;
      return fetchPokemon(pokemonName)
    },
    [pokemonName],
  )

  const { data, status, error } = useAsync(
    asyncCallback,
    { status: pokemonName ? 'pending' : 'idle' },
  )

  if (status === 'idle' || !pokemonName) {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected') {
    throw error
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={data} />
  }

  throw new Error('This should be impossible')
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonErrorBoundary onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

export default App
