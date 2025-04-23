// apps/master/components/orders-taken/ordersTakenPage.tsx
"use client";

import * as React from "react";

import {columns} from "@workspace/ui/components/shared/constants/orders";
import {OrdersTakenDataTable} from "@shared/orders/orders-taken/OrdersTakenTable"; // Используем единый источник типа






export default function OrdersTakenPage() {
  return (
      <div className="w-full">
        <OrdersTakenDataTable data={ordersData} columns={columns} />

      </div>
  );
}