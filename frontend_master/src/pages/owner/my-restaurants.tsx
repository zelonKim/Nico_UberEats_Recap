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
    <div
      style={{ backgroundImage: `url(/uberLogin.jpeg)` }}
      className="flex justify-center  bg-cover bg-fixed "
    >
      <Helmet>
        <title>My Restaurants | Uber Eats</title>
      </Helmet>
      <div className=" w-full h-screen   p-12 ">
        <h2 className=" text-4xl font-medium mb-8">나의 가게</h2>

        {data?.myRestaurants.ok &&
        data.myRestaurants.restaurants.length === 0 ? (
          <>
            <h4 className="text-lg mb-5 ">등록된 레스토랑이 없습니다.</h4>
            <Link to="/add-restaurant">
              <button className="text-lime-600 font-bold text-lg p-2 border-gray-50 pl-3 w-36 border-2 hover:border-lime-600  bg-white rounded-md shadow-sm hover:shadow-md ml-4">
                등록하러 가기 &rarr;
              </button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/add-restaurant">
              <button className="text-lime-600 font-bold text-lg p-2 border-gray-50 pl-3 w-36 border-2 hover:border-lime-600  bg-white rounded-md shadow-sm hover:shadow-md ml-4">
                등록하러 가기 &rarr;
              </button>
            </Link>

            <div className=" grid mt-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10">
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
