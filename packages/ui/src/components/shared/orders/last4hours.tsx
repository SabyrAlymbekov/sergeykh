"use client";

import * as React from "react";
import { OrdersDataTable } from "./(beta-orders)/OrdersTable";
import { columns, ordersData } from "@workspace/ui/components/shared/constants/orders";

export default function Last4hours() {
    const fourHoursAgo = new Date();
    fourHoursAgo.setHours(fourHoursAgo.getHours() - 4);

    const filtered = ordersData.filter((order) => {
        const orderDate = new Date(order.date);
        return order.status === "В работе" && orderDate >= fourHoursAgo;
    });

    return (
        <div>
            <OrdersDataTable data={filtered} columns={columns} />
        </div>
    );
}