import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { Restaurant } from "../../components/restaurant";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { category, categoryVariables } from "../../__generated__/category";

const CATEGORY_QUERY = gql`
  query category($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

interface ICategoryParams {
  slug: string;
}

export const Category = () => {
  const params = useParams<ICategoryParams>();
  const [page, setPage] = useState(1);

  const { data, loading } = useQuery<category, categoryVariables>(
    CATEGORY_QUERY,
    {
      variables: {
        input: {
          page,
          slug: params.slug,
        },
      },
    }
  );

  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);

  return (
    <div>
      <Helmet>
        <title>{data?.category.category?.name || "Category"} | Uber Eats</title>
      </Helmet>

      {!loading && (
        <div className="max-w-screen-2xl pb-8 mx-auto px-6">
          {/* 카테고리 헤더 */}
          <div className="flex items-center justify-center mt-8 mb-8">
            <div className="flex flex-col items-center">
              <div
                className="w-20 h-20 bg-cover rounded-full mb-4 bg-gray-100"
                style={{
                  backgroundImage: `url(${data?.category.category?.coverImg})`,
                }}
              ></div>
              <h1 className="text-3xl font-bold text-gray-800">
                {data?.category.category?.name}
              </h1>
              <p className="text-gray-600 mt-2">
                총 {data?.category.restaurants?.length}개의 음식점
              </p>
            </div>
          </div>

          {/* 레스토랑 목록 */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10">
            {data?.category.restaurants?.map((restaurant) => (
              <Restaurant
                key={restaurant.id}
                id={restaurant.id + ""}
                coverImg={restaurant.coverImg}
                name={restaurant.name}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>

          {/* 페이지네이션 */}
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
              {page} / {data?.category.totalPages}
            </span>
            {page !== data?.category.totalPages ? (
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
