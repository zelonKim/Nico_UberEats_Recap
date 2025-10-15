import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { Restaurant } from "../../components/restaurant";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import {
  restaurantsPageQuery,
  restaurantsPageQueryVariables,
} from "../../__generated__/restaurantsPageQuery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        ...CategoryParts
      }
    }
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

interface IFormProps {
  searchTerm: string;
}

export const Restaurants = () => {
  const [page, setPage] = useState(1);

  const { data, loading } = useQuery<
    restaurantsPageQuery,
    restaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page,
      },
    },
  });

  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);

  const { register, handleSubmit, getValues } = useForm<IFormProps>();

  const history = useHistory();

  const onSearchSubmit = () => {
    const { searchTerm } = getValues();

    history.push({
      pathname: "/search",
      search: `?term=${searchTerm}`,
    });
  };

  return (
    <div>
      <Helmet>
        <title>Home | Uber Eats</title>
      </Helmet>

      <form
        onSubmit={handleSubmit(onSearchSubmit)}
        style={{
          backgroundImage: `url(/uberLogin.jpeg)`,
        }}
        className="bg-cover bg-center py-36 flex items-center justify-center "
      >
        <div className="relative w-3/4 sm:w-1/2 lg:w-1/3">
          <input
            ref={register({ required: true, min: 3 })}
            name="searchTerm"
            type="Search"
            className="input rounded-md w-full pr-12 focus:border-green-500"
            placeholder="원하는 레스토랑을 검색해보세요."
            aria-label="검색창"
          />

          <button
            type="submit"
            aria-label="검색 돋보기"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-green-600 focus:outline-none"
          >
            <FontAwesomeIcon
              icon={faSearch}
              className="text-lg"
            ></FontAwesomeIcon>
          </button>
        </div>
      </form>

      {!loading && (
        <div className="max-w-screen-2xl pb-8 mx-auto  px-6">
          <div className="flex justify-around max-w-sm mx-auto ">
            {data?.allCategories.categories?.map((category) => (
              <Link key={category.id} to={`/category/${category.slug}`}>
                <div className="flex flex-col group items-center cursor-pointer mt-6">
                  <div
                    className=" w-16 h-16 bg-cover group-hover:bg-gray-100 rounded-full"
                    style={{ backgroundImage: `url(${category.coverImg})` }}
                  ></div>
                  <span className="mt-1 text-sm text-center font-medium">
                    {category.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="grid mt-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10">
            {data?.restaurants.results?.map((restaurant) => (
              <Restaurant
                key={restaurant.id}
                id={restaurant.id + ""}
                coverImg={restaurant.coverImg}
                name={restaurant.name}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 text-center max-w-md items-center mx-auto mt-12">
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
              {page} / {data?.restaurants.totalPages}
            </span>
            {page !== data?.restaurants.totalPages ? (
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
        </div>
      )}
    </div>
  );
};
