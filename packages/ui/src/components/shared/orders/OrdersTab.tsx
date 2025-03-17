"use client"

import React from 'react'
import ContentLayout from './ContentLayout'
import { ContentLayoutBg } from '@workspace/ui/components/shared/constants/orders'
import { Button } from '@workspace/ui/components/button'
import Last4hours from "@shared/orders/last4hours";
import LastWeek from "@shared/orders/lastWeek";
import NonActiveOrders from "@shared/orders/NonActiveOrders";
import ActiveOrders from "@shared/orders/ActiveOrders";
import AllOrders from "@shared/orders/AllOrders";

type OrdersTypeT = 'all' | '4hours' | 'week' | 'non-active' | 'active';

interface OrdersTabProps {
    status: 'curator' | 'master';
}

// Вспомогательная функция для капитализации строки
const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const OrdersTab: React.FC<OrdersTabProps> = ({ status }) => {
    // Определяем список вкладок в зависимости от статуса
    const availableTabs: OrdersTypeT[] =
        status === 'curator'
            ? ['all', '4hours', 'week', 'non-active', 'active']
            : ['4hours', 'week'];

    // Гарантируем, что availableTabs[0] существует, используя !
    const [ordersType, setOrdersType] = React.useState<OrdersTypeT>(availableTabs[0]!);

    const handleClick = (type: OrdersTypeT) => {
        setOrdersType(type);
    };

    const renderContent = () => {
        switch (ordersType) {
            case 'all':
                return <AllOrders />;
            case '4hours':
                return <Last4hours />;
            case 'week':
                return <LastWeek />;
            case 'non-active':
                return <NonActiveOrders />;
            case 'active':
                return <ActiveOrders isActiveEdit={false} onSelectedChange={() => {}} />;
            default:
                return null;
        }
    };


    return (
        <ContentLayout
            title={
                <div className="flex flex-row gap-3">
                    {availableTabs.map((tab) => (
                        <Button
                            key={tab}
                            variant={ordersType === tab ? "default" : "outline"}
                            onClick={() => handleClick(tab)}
                        >
                            {tab === '4hours'
                                ? "4 hours"
                                : tab === 'week'
                                    ? "Week"
                                    : capitalize(tab)}
                        </Button>
                    ))}
                </div>
            }
            bg={
                typeof window !== 'undefined' && window.innerWidth < 768
                    ? ContentLayoutBg.Transperent
                    : ContentLayoutBg.Black
            }
        >
            {renderContent()}
        </ContentLayout>
    );
};

export default OrdersTab;
