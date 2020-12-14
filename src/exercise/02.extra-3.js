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

function useSafeDispatch(dispatch) {
  const mountedRef = React.useRef(false);

  React.useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
    }
  }, [])

  return React.useCallback((...args) => {
    if (mountedRef.current) {
      dispatch(...args);
    }
  }, [dispatch])
}

function useAsync(initialState) {
  const [state, unsafeDispatch] = React.useReducer(asyncReducer, {
    status: 'idle',
    data: null,
    error: null,
    ...initialState,
  })

  const { data, status, error } = state;

  const dispatch = useSafeDispatch(unsafeDispatch)

  const run = React.useCallback(promise => {
    dispatch({ type: 'pending' })
    promise.then(
      data => dispatch({ type: 'resolved', data }),
      error => dispatch({ type: 'rejected', error }),
    )
  }, [dispatch])

  return {
    data,
    status,
    error,
    run,
  }
}

function PokemonInfo({ pokemonName }) {
  const { data, status, error, run } = useAsync(
    { status: pokemonName ? 'pending' : 'idle' },
  )

  React.useEffect(() => {
    if (!pokemonName) return;
    run(fetchPokemon(pokemonName))
  }, [pokemonName, run])

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
