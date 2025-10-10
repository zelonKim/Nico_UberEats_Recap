import { gql } from "@apollo/client";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { RESTAURANT_FRAGMENT } from "../../fragments";

const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalRestuls
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

  searchRestaurant,
  const [callQuery, { loading, data, called }] = useLazyQuery<
    searchRestaurantVariables
  >(SEARCH_RESTAURANT);

  useEffect(() => {
    const [_, query] = location.search.split("?term=");
    if (!query) {
      return history.replace("/"); // (뒤로가기 불가)
    }
    callQuery({
      variables: {
        input: {
          page: 1,
          query,
        },
      },
    });
  }, [history, location]);

  console.log(loading, data, called);

  return <h1>Search Page</h1>;
};
