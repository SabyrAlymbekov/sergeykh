"use client";

import * as React from "react";
import { OrdersDataTable } from "./(beta-orders)/OrdersTable";
import { columns } from "@workspace/ui/components/shared/constants/orders";

export default function LastDay() {
    // const twentyfourHoursAgo = new Date();
    // twentyfourHoursAgo.setHours(twentyfourHoursAgo.getHours() - 24);
    //
    // const filtered = ordersData.filter((order) => {
    //     const orderDate = new Date(order.date);
    //     return order.status === "В работе" && orderDate >= twentyfourHoursAgo;
    // });

    return (
        <div>
            {/*<OrdersDataTable data={filtered} columns={columns} />*/}
        </div>
    );
}