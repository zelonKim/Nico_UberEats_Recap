import { gql, useApolloClient, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Restaurant } from "../../components/restaurant";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { myRestaurants } from "../../__generated__/myRestaurants";

export const MY_RESTAURANTS_QUERY = gql`
  query myRestaurants {
    myRestaurants {
      ok
      error
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const MyRestaurants = () => {
  const { data } = useQuery<myRestaurants>(MY_RESTAURANTS_QUERY);
  return (
    <div className="flex justify-center">
      <Helmet>
        <title>My Restaurants | Uber Eats</title>
      </Helmet>
      <div
        style={{ backgroundImage: `url(/uberLogin.jpeg)` }}
        className=" w-full h-screen mb-16  p-12 bg-cover"
      >
        <h2 className=" text-4xl font-medium mb-10">나의 레스토랑</h2>

        {data?.myRestaurants.ok &&
        data.myRestaurants.restaurants.length === 0 ? (
          <>
            <h4 className="text-lg mb-5 ">등록된 레스토랑이 없습니다.</h4>
            <Link
              className="hover:underline text-lime-600 font-bold text-lg"
              to="/add-restaurant"
            >
              등록하러 가기 &rarr;
            </Link>
          </>
        ) : (
          <>
            <Link
              className=" hover:underline text-lime-600 font-bold text-lg"
              to="/add-restaurant"
            >
              등록하러 가기 &rarr;
            </Link>

            <div className=" grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
              {data?.myRestaurants.restaurants.map((restaurant) => (
                <Restaurant
                  key={restaurant.id}
                  id={restaurant.id + ""}
                  coverImg={restaurant.coverImg}
                  name={restaurant.name}
                  categoryName={restaurant.category?.name}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
