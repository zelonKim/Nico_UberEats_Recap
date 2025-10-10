import { gql } from "@apollo/client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import { MY_RESTAURANTS_QUERY } from "./my-restaurants";
import { useHistory } from "react-router-dom";

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: createRestaurantInput!) {
    createRestaurant(input: $input) {
      error
      ok
      restaurantId
    }
  }
`;

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
  file: FileList;
}

export const AddRestaurant = () => {
  const client = useApolloClient();

  const history = useHistory()

  const [imageUrl, setImageUrl] = useState("");

  const onCompleted = (data:createRestaurant) => {
    const {
      createRestaurant: {ok, restaurantId} }= data;
    if(ok) {
      const { file, name, categoryName, address } = getValues();
      setUploading(false)

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
                  __typename: "Cateogry",
                  
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
    })
    history.push("/")
  }
};

  const [createRestaurantMutation, { loading, data }] = useMutation<
    createRestaurant,
    createRestaurantVariables
  >(CREATE_RESTAURANT_MUTATION, {
    onCompleted,
    refetchQueries: [{query: MY_RESTAURANTS_QUERY}]
  });


  const { register, getValues, formState, errors, handleSubmit } =
    useForm<IFormProps>({
      mode: "onChange"
    });

    const [uploading ,setUploading] = useState(false)

  const onSubmit = async () => {
    try {
      setUploading(true)
        const {file, name, categoryName, address} = getValues()
        const actualFile = file[0]
        const formBody = new FormData();
        formBody.append("file", actualFile)

        const {url: coverImg} = await ( await fetch("http://localhost:4000/uploads/", {
          method: "POST",
          body: formBody,
        })
      ).json()

      setImageUrl(coverImg);

      createRestaurantMutation({
        variables: {
          input: {
            name,
            categoryName,
            address,
            coverImg
          }
        }
      })
    } catch(err) {

    }
};
  
  return (
    <div>
      <h1>레스토랑 추가</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" name="name" ref={register({ required: "Name is Required." })} />
        <input type="text" name="address" ref={register({ required: "Address is Required." })} />
        <input type="text" name="categoryName"  ref={register({ required: "Category Name is Required." })} />
        <div>
          <input type="file" name="file" accept="image/*" ref={register({required: true})} />
        </div>
        <Button loading={uploading} canClick={formState.isValid} actionText="Create Restaurants"></button>
        {data?.createRestaurant?.error && <FormError errorMessage={data.createRestaurant.error} />}
      </form>
    </div>
  );
};
