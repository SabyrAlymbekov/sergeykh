"use client";

import * as React from "react";
import { OrdersDataTable } from "@shared/orders/(beta-orders)/OrdersTable";
import { columns, ordersData } from "@shared/constants/orders";

export default function ActiveOrders({
                                         isActiveEdit,
                                         onSelectedChange,
                                     }: {
    isActiveEdit: boolean;
    onSelectedChange: (selected: any[]) => void;
}) {
    // Фильтруем активные заказы (например, со статусом "В работе")
    const filtered = ordersData.filter((order) => order.status === "В работе");
    return (
        <div>
            <OrdersDataTable
                data={filtered}
                columns={columns}
                isEdit={isActiveEdit}
                onSelectedChange={onSelectedChange}
            />
        </div>
    );
}
