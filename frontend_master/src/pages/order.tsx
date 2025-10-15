import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useHistory, useParams } from "react-router-dom";
import { FULL_ORDER_FRAGMENT } from "../fragments";
import { useMe } from "../hooks/useMe";
import { editOrder, editOrderVariables } from "../__generated__/editOrder";
import { getOrder, getOrderVariables } from "../__generated__/getOrder";
import { OrderStatus, UserRole } from "../__generated__/globalTypes";
import {
  orderUpdates,
  orderUpdatesVariables,
} from "../__generated__/orderUpdates";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faHome } from "@fortawesome/free-solid-svg-icons";

const GET_ORDER = gql`
  query getOrder($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        ...FullOrderParts
      }
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const ORDER_SUBSCRIPTION = gql`
  subscription orderUpdates($input: OrderUpdatesInput!) {
    orderUpdates(input: $input) {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const EDIT_ORDER = gql`
  mutation editOrder($input: EditOrderInput!) {
    editOrder(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  id: string;
}

export const Order = () => {
  const params = useParams<IParams>();

  const { data: userData } = useMe();
  const [editOrderMutation] = useMutation<editOrder, editOrderVariables>(
    EDIT_ORDER
  );
  const { data, subscribeToMore } = useQuery<getOrder, getOrderVariables>(
    GET_ORDER,
    {
      variables: {
        input: {
          id: +params.id,
        },
      },
    }
  );
  useEffect(() => {
    if (data?.getOrder.ok) {
      subscribeToMore({
        document: ORDER_SUBSCRIPTION,
        variables: {
          input: {
            id: +params.id,
          },
        },
        updateQuery: (
          prev,
          {
            subscriptionData: { data },
          }: { subscriptionData: { data: orderUpdates } }
        ) => {
          if (!data) return prev;
          return {
            getOrder: {
              ...prev.getOrder,
              order: {
                ...data.orderUpdates,
              },
            },
          };
        },
      });
    }
  }, [data]);
  const onButtonClick = (newStatus: OrderStatus) => {
    editOrderMutation({
      variables: {
        input: {
          id: +params.id,
          status: newStatus,
        },
      },
    });
  };
  return (
    <div className=" mt-32 container flex justify-center">
      <Helmet>
        <title>주문 요청 {params.id} | Uber Eats</title>
      </Helmet>
      <div className=" mb-32 border border-gray-800 w-full max-w-screen-sm flex flex-col justify-center">
        <h4 className="bg-lime-600 w-full py-5 text-white text-center text-xl">
          주문 요청 {params.id}
        </h4>
        <h5 className="p-5 pt-10 text-3xl text-center ">
          총 주문 금액: {data?.getOrder.order?.total} ₩
        </h5>
        <div className="p-5 text-xl grid gap-6">
          <div className="border-t pt-5 border-gray-700">
            {"  "}- 상호명:{" "}
            <span className="font-medium">
              {data?.getOrder.order?.restaurant?.name}
            </span>
          </div>
          <div className="border-t pt-5 border-gray-700 ">
            {"  "}- 주문 요청자:{" "}
            <span className="font-medium">
              {data?.getOrder.order?.customer?.email}
            </span>
          </div>
          <div className="border-t border-b py-5 border-gray-700">
            {"  "}- 라이더:{" "}
            <span className="font-medium">
              {data?.getOrder.order?.driver?.email || "미배정"}
            </span>
          </div>
          {userData?.me.role === "Client" && (
            <span className=" text-center mt-5 mb-3  text-2xl text-lime-600">
              진행 상황:{" "}
              {data?.getOrder.order?.status === "Pending"
                ? "승인 대기중"
                : data?.getOrder.order?.status === "Cooking"
                ? "조리중"
                : data?.getOrder.order?.status === "Cooked"
                ? "조리 완료"
                : data?.getOrder.order?.status === "PickedUp"
                ? "픽업 완료"
                : data?.getOrder.order?.status === "Delivered"
                ? "배달 완료"
                : ""}
            </span>
          )}

          {userData?.me.role === UserRole.Owner && (
            <>
              {data?.getOrder.order?.status === OrderStatus.Pending && (
                <button
                  onClick={() => onButtonClick(OrderStatus.Cooking)}
                  className="btn w-1/2 ml-36  rounded-md bg-yellow-500 hover:bg-yellow-600 text-lg"
                >
                  주문 승인하기
                </button>
              )}
              {data?.getOrder.order?.status === OrderStatus.Cooking && (
                <button
                  onClick={() => onButtonClick(OrderStatus.Cooked)}
                  className="btn btn w-1/2 ml-36  rounded-md bg-red-500 hover:bg-red-600"
                >
                  조리 완료
                </button>
              )}

              {data?.getOrder.order?.status !== OrderStatus.Cooking &&
                data?.getOrder.order?.status !== OrderStatus.Pending && (
                  <span className=" text-center mt-5 mb-3  text-2xl text-lime-600">
                    진행 상황:{" "}
                    {data?.getOrder.order?.status === "Cooked"
                      ? "조리 완료"
                      : data?.getOrder.order?.status === "PickedUp"
                      ? "픽업 완료"
                      : data?.getOrder.order?.status === "Delivered"
                      ? "배달 완료"
                      : ""}
                  </span>
                )}
            </>
          )}
          {userData?.me.role === UserRole.Delivery && (
            <>
              {data?.getOrder.order?.status === OrderStatus.Cooked && (
                <button
                  onClick={() => onButtonClick(OrderStatus.PickedUp)}
                  className="btn ml-36 w-1/2 rounded-md"
                >
                  메뉴 픽업 완료
                </button>
              )}
              {data?.getOrder.order?.status === OrderStatus.PickedUp && (
                <button
                  onClick={() => onButtonClick(OrderStatus.Delivered)}
                  className="btn ml-36 w-1/2 rounded-md"
                >
                  배달 완료
                </button>
              )}
            </>
          )}
          {data?.getOrder.order?.status === OrderStatus.Delivered && (
            <>
              <span className=" text-center mt-5 mb-3  text-2xl text-lime-600">
                우버이츠를 이용해주셔서 감사합니다.{" "}
                <Link to={"/"}>
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="ml-1 hover:text-lime-700"
                  />
                </Link>
              </span>
              <div></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
