import { useQuery } from '@apollo/client';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import ErrorWrangler from '../common/ErrorWrangler';

const SearchContext = createContext(null);

export const usePrevious = (value: any) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value; //assign the value of ref to the argument
  }, [value]); //this code will run when the value of 'value' changes
  return ref.current; //in the end, return the current ref value.
};

export const useSearch = () => useContext(SearchContext);

const getFirstPagePaginationVariables = (itemsPerPage: number) => ({
  first: itemsPerPage,
  after: undefined,
  before: undefined,
  last: undefined,
  skip: undefined,
});

export const SearchProvider = ({
  query,
  dataFormatter,
  initialSearchState,
  children,
}: any) => {
  const [searchState, setSearchState] = useState(initialSearchState || null);

  // needed to check wether we are paginating forward or backward
  const prevPage = usePrevious(searchState.currentPage);

  const updateSearchState = (newState: any) => {
    setSearchState((prevState: any) => ({
      ...prevState,
      ...newState,
    }));
  };

  const getPaginationState = (
    targetPage: any,
    itemsPerPage: number,
    data: any,
  ) => {
    const _data = dataFormatter(data);
    const startCursor = _data?.pageInfo.startCursor;
    const endCursor = _data?.pageInfo.endCursor;

    let paginationState = {};

    if (targetPage === 1) {
      paginationState = getFirstPagePaginationVariables(itemsPerPage);
      return paginationState;
    }

    // @ts-ignore
    if (targetPage > prevPage) {
      // @ts-ignore
      paginationState.skip = itemsPerPage * (targetPage - 1 - prevPage);
      // Paginate forward
      // @ts-ignore
      paginationState.first = itemsPerPage;
      // @ts-ignore
      paginationState.after = endCursor;

      // @ts-ignore
      paginationState.last = undefined;
      // @ts-ignore
      paginationState.before = undefined;
      // @ts-ignore
    } else if (targetPage < prevPage) {
      // @ts-ignore
      paginationState.skip = itemsPerPage * (prevPage - (targetPage + 1));

      // Paginate backward
      // @ts-ignore
      paginationState.after = undefined;
      // @ts-ignore
      paginationState.first = undefined;

      // @ts-ignore
      paginationState.last = itemsPerPage;
      // @ts-ignore
      paginationState.before = startCursor;
    }

    return paginationState;
  };

  const { itemsPerPage } = searchState;

  const { loading, error, data, refetch } = useQuery(query, {
    fetchPolicy: 'cache-and-network',
    variables: {
      ...getFirstPagePaginationVariables(itemsPerPage),
      orderBy: {
        direction: initialSearchState.orderBy.direction,
        field: initialSearchState.orderBy.field,
      },
      query: '',
    },
  });

  useEffect(() => {
    const {
      currentPage,
      itemsPerPage: listLength,
      status,
      orderBy,
      filterTagSelection,
      searchQuery,
    } = searchState;

    const paginationState = getPaginationState(currentPage, listLength, data);

    const queryVariables = {
      ...paginationState,
      query: searchQuery,
      status,
      tags: filterTagSelection.length > 0 ? filterTagSelection : undefined,
      orderBy: {
        direction: orderBy?.direction,
        field: orderBy?.field,
      },
    };

    refetch(queryVariables);
  }, [searchState]);

  const loadFirstPage = () => {
    updateSearchState({
      currentPage: 1,
    });
  };

  const hits = dataFormatter(data);

  return (
    <SearchContext.Provider
      // @ts-ignore
      value={{ searchState, loadFirstPage, updateSearchState, hits, loading }}
    >
      <ErrorWrangler error={error} />
      {/* <Debug values={{ searchState }} />
      <Debug values={{ queryVariables }} /> */}
      {children}
    </SearchContext.Provider>
  );
};
