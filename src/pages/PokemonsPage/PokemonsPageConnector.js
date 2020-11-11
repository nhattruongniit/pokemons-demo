import React, { useEffect, useState } from 'react';
import PokemonsPage from "./PokemonsPage";
import axios from 'axios';
import usePagePagination from '../../shared/helpers/usePagePagination/usePagePagination';

const CancelToken = axios.CancelToken;

const PokemonsPageConnector = () => {
  const [pokemons, setPokemons] = useState([]);
  const [pokemonsCount, setPokemonsCount] = useState(0);
  const [isLoadingPokemons, setIsLoadingPokemons] = useState(true);
  const pagePagination = usePagePagination(pokemonsCount);
  const { page, perPage } = pagePagination;

  useEffect(() => {
    let cancelRequest = null;
    let delay = null;
    let didCancel = false;
    setIsLoadingPokemons(true);

    axios({
      method: 'GET',
      url: 'https://pokeapi.co/api/v2/pokemon',
      params: {
        limit: perPage,
        offset: (page - 1) * perPage
      },
      cancelToken: new CancelToken(c => {
        cancelRequest = c;
      })
    })
      .then(response => {
      const { count, results } = response.data;
      delay = setTimeout(() => {
        setIsLoadingPokemons(false);
        setPokemonsCount(count);
        setPokemons(results);
      }, 1500)
    }).catch(err => {
      if(!didCancel) {
        setIsLoadingPokemons(false);
      }
      console.error(err);
    })

    /* clear all effects */
    return () => {
      didCancel = true;
      cancelRequest();
      if (delay) {
        clearTimeout(delay);
      }
    }
  }, [page, perPage]);

  return (
    <PokemonsPage
      key={ page }
      pagePagination={ pagePagination }
      pokemons={ pokemons }
      isLoadingPokemons={ isLoadingPokemons }
    />
  );
};

export default PokemonsPageConnector;
