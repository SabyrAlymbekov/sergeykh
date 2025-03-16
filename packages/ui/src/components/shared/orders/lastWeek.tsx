"use client";

import * as React from "react";
import { OrdersDataTable } from "./(beta-orders)/OrdersTable";
import { columns, ordersData } from "@workspace/ui/components/shared/constants/orders";

export default function LastWeek() {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const filtered = ordersData.filter((order) => {
        const orderDate = new Date(order.date);
        return order.status === "В работе" && orderDate >= weekAgo;
    });

    return (
        <div>
            <OrdersDataTable data={filtered} columns={columns} />
        </div>
    );
}