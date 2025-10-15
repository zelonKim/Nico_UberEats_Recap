import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const GET_ORDERS = gql`
  query getOrders($input: GetOrdersInput!) {
    getOrders(input: $input) {
      ok
      error
      orders {
        id
        status
        total
        createdAt
        restaurant {
          name
        }
      }
    }
  }
`;

interface GetOrders_getOrders_orders_restaurant {
  __typename: "Restaurant";
  name: string;
}

interface GetOrders_getOrders_orders {
  __typename: "Order";
  id: number;
  status: string;
  total: number | null;
  createdAt: string;
  restaurant: GetOrders_getOrders_orders_restaurant | null;
}

interface GetOrders_getOrders {
  __typename: "GetOrdersOutput";
  ok: boolean;
  error: string | null;
  orders: GetOrders_getOrders_orders[] | null;
}

interface GetOrders {
  getOrders: GetOrders_getOrders;
}

interface GetOrdersVariables {
  input: Record<string, never>;
}

export const OrderList: React.FC = () => {
  const { data, loading } = useQuery<GetOrders, GetOrdersVariables>(
    GET_ORDERS,
    {
      variables: { input: {} },
      fetchPolicy: "cache-and-network",
    }
  );

  const orders = data?.getOrders.orders ?? [];

  return (
    <div className=" container mt-16 px-4">
      <Helmet>
        <title>주문 내역 | Uber Eats</title>
      </Helmet>
      <h2 className="text-2xl font-semibold mb-6">주문 내역</h2>
      {loading && <div className="py-10 text-center">불러오는 중...</div>}
      {!loading && orders.length === 0 && (
        <div className="py-10 text-center text-gray-500">
          주문 내역이 없습니다.
        </div>
      )}
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((order) => (
          <li
            key={order.id}
            className="border rounded-md p-4 shadow-sm  hover:border-green-500  hover:bg-gray-50 transition-colors"
          >
            <Link
              to={`/orders/${order.id}`}
              className="flex justify-between items-center"
            >
              <div className="flex flex-col">
                <span className="text-lg font-medium">주문 # {order.id}</span>
                <span className="text-sm text-gray-600 mt-1">
                  {order.restaurant?.name || "상호명 없음"}
                </span>
              </div>
              <div className="text-right">
                <span className="block text-md">
                  총 금액: {order.total || 0} ₩
                </span>
                <span className="block text-sm text-lime-600 font-medium mt-1">
                  {order.status === "Pending"
                    ? "승인 대기중"
                    : order.status === "Cooking"
                    ? "조리중"
                    : order.status === "Cooked"
                    ? "조리 완료"
                    : order.status === "PickedUp"
                    ? "픽업 완료"
                    : order.status === "Delivered"
                    ? "배달 완료"
                    : ""}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
