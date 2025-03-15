"use client";

import * as React from "react";
import { OrdersDataTable } from "./(beta-orders)/OrdersTable";
import {columns, Order, ordersData} from "@/constants/orders";


export default function AllOrders() {
  const filtered : Order[] = ordersData;
  return (
    <div>

      <OrdersDataTable data={filtered} columns={columns} />

    </div>
  );
}