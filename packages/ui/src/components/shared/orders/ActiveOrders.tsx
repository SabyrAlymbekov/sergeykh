"use client";

import * as React from "react";
import { OrdersDataTable } from "@shared/orders/(beta-orders)/OrdersTable";
import { columns, ordersData } from "@shared/constants/orders";

export default function ActiveOrders() {
  const filtered = ordersData.filter((order) => order.status === "В работе");
  return (
    <div>
        <OrdersDataTable data={filtered} columns={columns} />
    </div>
  );
}