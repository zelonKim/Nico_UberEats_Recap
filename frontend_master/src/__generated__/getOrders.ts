/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GetOrdersInput, OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: getOrders
// ====================================================

export interface getOrders_getOrders_orders_restaurant {
  __typename: "Restaurant";
  name: string;
}

export interface getOrders_getOrders_orders {
  __typename: "Order";
  id: number;
  status: OrderStatus;
  total: number | null;
  createdAt: any;
  restaurant: getOrders_getOrders_orders_restaurant | null;
}

export interface getOrders_getOrders {
  __typename: "GetOrdersOutput";
  ok: boolean;
  error: string | null;
  orders: getOrders_getOrders_orders[] | null;
}

export interface getOrders {
  getOrders: getOrders_getOrders;
}

export interface getOrdersVariables {
  input: GetOrdersInput;
}
