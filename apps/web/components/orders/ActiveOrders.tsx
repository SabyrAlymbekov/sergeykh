"use client";

import * as React from "react";
import { OrdersDataTable } from "./OrdersTable";
import { columns, ordersData } from "@/constants/orders";

export default function ActiveOrders() {
  const filtered = ordersData.filter((order) => order.status === "В процессе");
  return (
    <div>
        <OrdersDataTable data={filtered} columns={columns} />
    </div>
  );
}