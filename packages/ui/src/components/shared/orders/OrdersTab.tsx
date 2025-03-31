"use client"

import React from 'react'
import ContentLayout from './ContentLayout'
import { ContentLayoutBg } from '@workspace/ui/components/shared/constants/orders'
import { Button } from '@workspace/ui/components/button'
import Last4hours from "@shared/orders/last4hours"
import LastDay from "@shared/orders/lastDay"
import NonActiveOrders from "@shared/orders/NonActiveOrders"
import ActiveOrders from "@shared/orders/ActiveOrders"
import AllOrders from "@shared/orders/AllOrders"

type OrdersTypeT = 'all' | '4hours' | 'lastday' | 'non-active' | 'active'
type UserStatusT = 'curator' | 'master'
type AccessStatusT = 'pro' | 'max' | 'none'

interface OrdersTabProps {
    status: UserStatusT
    accessStatus?: AccessStatusT
}

const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1)

const OrdersTab: React.FC<OrdersTabProps> = ({ status, accessStatus = 'none' }) => {
    if (!accessStatus || accessStatus === 'none') {
        return <div className="flex flex-col items-center justify-center min-h-full text-center">
            <h1 className="text-xl">
                У вас нет доступа к этой странице
            </h1>
        </div> // ❌ ничего не рендерим
    }

    const getAccessTab = (): OrdersTypeT =>
        accessStatus === 'pro' ? '4hours' : 'lastday'

    const defaultTab = getAccessTab()

    const availableTabs: OrdersTypeT[] =
        status === 'curator'
            ? ['all', defaultTab, 'non-active', 'active']
            : [defaultTab]

    const [ordersType, setOrdersType] = React.useState<OrdersTypeT>(defaultTab)

    const handleClick = (type: OrdersTypeT) => setOrdersType(type)

    const renderContent = () => {
        switch (ordersType) {
            case 'all':
                return <AllOrders />
            case '4hours':
                return <Last4hours />
            case 'lastday':
                return <LastDay />
            case 'non-active':
                return <NonActiveOrders />
            case 'active':
                return <ActiveOrders isActiveEdit={false} onSelectedChange={() => {}} />
            default:
                return null
        }
    }

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
                                ? "4 Hours"
                                : tab === 'lastday'
                                    ? "24 Hours"
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
    )
}

export default OrdersTab
