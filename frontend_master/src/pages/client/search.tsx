import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useHistory, useLocation } from "react-router-dom";
import { Restaurant } from "../../components/restaurant";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import {
  searchRestaurant,
  searchRestaurantVariables,
} from "../../__generated__/searchRestaurant";

const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const Search = () => {
  const location = useLocation();
  const history = useHistory();
  const [page, setPage] = useState(1);

  const [callQuery, { loading, data, called }] = useLazyQuery<
    searchRestaurant,
    searchRestaurantVariables
  >(SEARCH_RESTAURANT);

  const queryTerm = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("term") ?? "";
  }, [location.search]);

  useEffect(() => {
    if (!queryTerm) {
      return history.replace("/");
    }

    callQuery({
      variables: {
        input: {
          page: 1,
          query: queryTerm,
        },
      },
    });
    setPage(1);
  }, [history, queryTerm, callQuery]);

  const onNextPageClick = () => {
    const next = page + 1;
    setPage(next);

    callQuery({
      variables: {
        input: {
          page: next,
          query: queryTerm,
        },
      },
    });
  };

  const onPrevPageClick = () => {
    const prev = page - 1;
    setPage(prev);
    callQuery({
      variables: {
        input: {
          page: prev,
          query: queryTerm,
        },
      },
    });
  };

  return (
    <div>
      <Helmet>
        <title>Search | Uber Eats</title>
      </Helmet>
      {called && !loading && (
        <div className="max-w-screen-2xl pb-8 mx-auto mt-8 px-6">
          <h2 className="text-xl font-semibold">"{queryTerm}" 검색 결과</h2>

          <div className="grid mt-8 md:grid-cols-3 gap-x-5 gap-y-10">
            {data?.searchRestaurant.restaurants?.map((restaurant) => (
              <Restaurant
                key={restaurant.id}
                id={restaurant.id + ""}
                coverImg={restaurant.coverImg}
                name={restaurant.name}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>
          {data?.searchRestaurant.totalPages &&
          data.searchRestaurant.totalPages > 0 ? (
            <div className="grid grid-cols-3 text-center max-w-md items-center mx-auto mt-36">
              {page > 1 ? (
                <button
                  onClick={onPrevPageClick}
                  className="focus:outline-none font-medium text-2xl"
                >
                  &larr;
                </button>
              ) : (
                <div></div>
              )}

              <span>
                {page} / {data?.searchRestaurant.totalPages}
              </span>
              {page !== data?.searchRestaurant.totalPages ? (
                <button
                  onClick={onNextPageClick}
                  className="focus:outline-none font-medium text-2xl"
                >
                  &rarr;
                </button>
              ) : (
                <div></div>
              )}
            </div>
          ) : (
            <div>검색어에 해당되는 레스토랑이 없습니다.</div>
          )}
        </div>
      )}
    </div>
  );
};
