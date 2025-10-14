import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "../../components/button";
import {
  createDish,
  createDishVariables,
} from "../../__generated__/createDish";
import { MY_RESTAURANT_QUERY } from "./my-restaurant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faTrashAlt,
  faTrashRestore,
} from "@fortawesome/free-solid-svg-icons";

interface IParams {
  restaurantId: string;
}

interface IForm {
  name: string;
  price: string;
  description: string;
  file: FileList;
  [key: string]: string | FileList;
}

const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

export const AddDish = () => {
  const { restaurantId } = useParams<IParams>();
  const history = useHistory();

  const [createDishMutation, { loading }] = useMutation<
    createDish,
    createDishVariables
  >(CREATE_DISH_MUTATION, {
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: {
          input: {
            id: +restaurantId,
          },
        },
      },
    ],
  });

  const { register, handleSubmit, formState, getValues, setValue } =
    useForm<IForm>({
      mode: "onChange",
    });

  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const onSubmit = async () => {
    try {
      setUploading(true);

      const { name, price, description, file, ...rest } = getValues();

      const optionObjects = optionsNumber.map((theId) => ({
        name: rest[`${theId}-optionName`] as string,
        extra: +(rest[`${theId}-optionExtra`] as string),
      }));

      let photo: string | undefined = undefined;

      if (file && file.length > 0) {
        const formBody = new FormData();
        const actualFile = file[0];
        formBody.append("file", actualFile);

        const response = await fetch("http://localhost:4000/uploads", {
          method: "POST",
          body: formBody,
        });

        if (!response.ok) {
          throw new Error(
            `Upload failed: ${response.status} ${response.statusText}`
          );
        }

        const result = await response.json();

        if (!result.url) {
          throw new Error("No URL returned from upload");
        }

        photo = result.url;

        if (photo) {
          setImageUrl(photo);
        }
      }

      await createDishMutation({
        variables: {
          input: {
            name,
            price: +price,
            description,
            restaurantId: +restaurantId,
            options: optionObjects,
            ...(photo ? { photo } : {}),
          },
        },
      });

      setUploading(false);

      history.goBack();
    } catch (e) {
      console.error("Dish upload/create error:", e);
      const errorMessage =
        e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.";
      alert(`업로드 실패: ${errorMessage}`);
      setUploading(false);
    }
  };

  const [optionsNumber, setOptionsNumber] = useState<number[]>([]);

  const onAddOptionClick = () => {
    setOptionsNumber((current) => [Date.now(), ...current]);
  };

  const onDeleteClick = (idToDelete: number) => {
    setOptionsNumber((current) => current.filter((id) => id !== idToDelete));
    setValue(`${idToDelete}-optionName`, "");
    setValue(`${idToDelete}-optionExtra`, "");
  };

  return (
    <div className="container flex flex-col items-center py-24">
      <Helmet>
        <title>Add Dish | Nuber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">메뉴 등록</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
      >
        <input
          className="input focus:border-green-500 rounded-md w-4/5 ml-16"
          type="text"
          name="name"
          placeholder="메뉴 이름"
          ref={register({ required: "이름을 입력해주세요." })}
        />
        <input
          className="input focus:border-green-500 rounded-md w-4/5 ml-16"
          type="number"
          name="price"
          min={0}
          placeholder="메뉴 가격"
          ref={register({ required: "가격을 입력해주세요." })}
        />
        <input
          className="input focus:border-green-500 rounded-md w-4/5 ml-16 py-12"
          type="text"
          name="description"
          placeholder="메뉴에 대한 설명"
          ref={register({ required: "설명을 입력해주세요." })}
        />

        <div>
          <input
            className="input focus:border-green-500 rounded-md w-4/5 ml-16"
            type="file"
            name="file"
            accept="image/*"
            ref={register}
          />
        </div>

        <div className="my-4 w-4/5 ml-16">
          <span
            onClick={onAddOptionClick}
            className="cursor-pointer text-white rounded-md bg-lime-600 hover:bg-lime-700 py-1 px-2 mt-5 "
          >
            + 메뉴 옵션
          </span>

          {optionsNumber.length !== 0 &&
            optionsNumber.map((id) => (
              <div key={id} className="mt-5 flex h-12">
                <input
                  ref={register}
                  name={`${id}-optionName`}
                  className="py-2 px-4 focus:border-green-500 rounded-md w-4/5 focus:outline-none mr-3 border-2"
                  type="text"
                  placeholder="메뉴 옵션 이름"
                />
                <input
                  ref={register}
                  name={`${id}-optionExtra`}
                  className="py-2 px-4 focus:outline-none focus:border-green-500 rounded-md w-4/5 border-2"
                  type="number"
                  min={0}
                  placeholder="메뉴 옵션 가격"
                />
                <span
                  className="cursor-pointer text-white bg-red-500 hover:bg-red-600 ml-2 p-3 rounded-sm"
                  onClick={() => onDeleteClick(id)}
                >
                  <FontAwesomeIcon icon={faTrashAlt} className="text-xl" />
                </span>
              </div>
            ))}
        </div>
        <Button
          loading={uploading || loading}
          canClick={formState.isValid}
          actionText="등록하기"
        />
      </form>
    </div>
  );
};
