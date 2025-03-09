"use client";

import * as React from "react";
import { OrdersDataTable } from "./OrdersTable";
import { columns, ordersData } from "@/constants/orders";

export default function AllOrders() {
  const filtered = ordersData;
  return (
    <div>
      <OrdersDataTable data={filtered} columns={columns} />
    </div>
  );
}