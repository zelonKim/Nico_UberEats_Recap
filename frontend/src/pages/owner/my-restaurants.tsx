import { gql } from "@apollo/client";
import React, { useEffect } from "react";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { Restaurant } from "../client/restaurant";

export const MY_RESTAURANTS_QUERY = gql`
  query myRestaurants {
    ok
    error
    restuarants {
      ...RestaurantParts
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const MyRestaurants = () => {
  const { data } = useQuery<MyRestaurants>(MY_RESTAURANTS_QUERY);
  const client = useApolloClient();

  useEffect(() => {
    setTimeout(() => {
      const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY });

      client.writeQuery({
        query: MY_RESTAURANTS_QUERY,
        data: {
          myRestaurants: {
            ...queryResult.myRestaurants,
            restaurants: [
              { name: "blah blah" },
              ...queryResult.myRestaurants.restaurants,
            ],
          },
        },
      });
    }, 8000);
  }, []);

  return (
    <div>
      <Helmet>
        <title>My Restaurants | Uber Eats </title>
      </Helmet>
      <div className="max-w-screen-2xl mx-auto mt-32">
        <h2 className="text-4xl font-medium mb-10">My Restaurants</h2>
        {data?.myRestaurants.ok &&
        data.myRestaurants.restaurants.length === 0 ? (
          <>
            <h4 className="text-xl mb-5">You have no restaurants.</h4>
            <Link
              className="text-lime-600 hover:underline"
              to="/add-restaurant"
            >
              Create one &rarr;
            </Link>
          </>
        ) : (
          <div className="grid mt-16 grid-cols-3 gap-x-5 gap-y-10">
            {data?.myRestaurants.restaurants.map((restaurant) => (
              <Restaurant
                id={restaurant.id + ""}
                coverImg={restaurant.coverImg}
                name={restaurant.name}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
