import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import { MY_RESTAURANTS_QUERY } from "./my-restaurants";
import {
  createRestaurant,
  createRestaurantVariables,
} from "../../__generated__/createRestaurant";
import { useHistory } from "react-router-dom";

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
  file: FileList;
}

const ALL_CATEGORIES_QUERY = gql`
  query allCategories {
    allCategories {
      ok
      error
      categories {
        name
      }
    }
  }
`;

export const useCategories = () => {
  return useQuery(ALL_CATEGORIES_QUERY);
};

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      error
      ok
      restaurantId
    }
  }
`;

export const AddRestaurant = () => {
  const client = useApolloClient();
  const history = useHistory();
  const [imageUrl, setImageUrl] = useState("");
  const { data: categoriesData } = useCategories();

  const onCompleted = (data: createRestaurant) => {
    const {
      createRestaurant: { ok, restaurantId },
    } = data;

    if (ok) {
      const { name, categoryName, address } = getValues();

      setUploading(false);

      history.push("/");

      const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY });

      client.writeQuery({
        query: MY_RESTAURANTS_QUERY,
        data: {
          myRestaurants: {
            ...queryResult.myRestaurants,
            restaurants: [
              {
                address,
                category: {
                  name: categoryName,
                  __typename: "Category",
                },
                coverImg: imageUrl,
                id: restaurantId,
                isPromoted: false,
                name,
                __typename: "Restaurant",
              },
              ...queryResult.myRestaurants.restaurants,
            ],
          },
        },
      });
    }
  };

  const [createRestaurantMutation, { data }] = useMutation<
    createRestaurant,
    createRestaurantVariables
  >(CREATE_RESTAURANT_MUTATION, {
    onCompleted,
  });

  const { register, getValues, formState, handleSubmit, errors } =
    useForm<IFormProps>({
      mode: "onChange",
    });

  const [uploading, setUploading] = useState(false);

  const onSubmit = async () => {
    try {
      setUploading(true);

      const { file, name, categoryName, address } = getValues();

      if (!file || file.length === 0) {
        alert("이미지 파일을 선택해주세요.");
        setUploading(false);
        return;
      }

      const formBody = new FormData();
      const actualFile = file[0];
      formBody.append("file", actualFile);

      console.log("Uploading file:", actualFile.name);

      const response = await fetch("http://localhost:4000/uploads", {
        method: "POST",
        body: formBody,
      });

      if (!response.ok) {
        throw new Error(
          `업로드 실패: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();

      if (!result.url) {
        throw new Error("No URL returned from upload");
      }

      const { url: coverImg } = result;

      setImageUrl(coverImg);

      createRestaurantMutation({
        variables: {
          input: {
            name,
            categoryName,
            address,
            coverImg,
          },
        },
      });
    } catch (e) {
      console.error("Upload error:", e);
      const errorMessage =
        e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.";
      alert(`업로드 실패: ${errorMessage}`);
      setUploading(false);
    }
  };

  return (
    <div className="container flex flex-col items-center mt-24">
      <Helmet>
        <title>Add Restaurant | Uber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">가게 등록</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5 "
      >
        <input
          className="input  focus:border-green-500 rounded-md w-4/5 ml-16"
          type="text"
          name="name"
          placeholder="상호명"
          ref={register({ required: "상호명을 입력해주세요." })}
        />
        {errors.name?.message && (
          <FormError errorMessage={errors.name?.message} />
        )}

        <input
          className="input  focus:border-green-500 rounded-md w-4/5 ml-16"
          type="text"
          name="address"
          placeholder="주소"
          ref={register({ required: "주소를 입력해주세요." })}
        />
        {errors.address?.message && (
          <FormError errorMessage={errors.address?.message} />
        )}

        <select
          className="bg-white input focus:border-green-500 rounded-md w-4/5 ml-16"
          name="categoryName"
          ref={register({ required: "카테고리를 선택해주세요." })}
        >
          <option value="">카테고리</option>
          {categoriesData?.allCategories?.categories?.map((category: any) => (
            <option key={category.name} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>

        {errors.categoryName?.message && (
          <FormError errorMessage={errors.categoryName?.message} />
        )}

        <div>
          <input
            className="input focus:border-green-500 rounded-md w-4/5 ml-16"
            type="file"
            name="file"
            accept="image/*"
            ref={register({ required: "가게 사진을 첨부해주세요." })}
          />
        </div>
        {errors.file?.message && (
          <FormError errorMessage={errors.file.message} />
        )}

        <Button
          loading={uploading}
          canClick={formState.isValid}
          actionText="등록하기"
        />
        {data?.createRestaurant?.error && (
          <FormError errorMessage={data.createRestaurant.error} />
        )}
      </form>
    </div>
  );
};
