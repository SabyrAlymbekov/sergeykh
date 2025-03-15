"use client"

import React from 'react'
import ContentLayout from './ContentLayout'
import { ContentLayoutBg } from '@/constants/orders'
import { Button } from '@workspace/ui/components/button'
import AllOrders from './AllOrders'
import ActiveOrders from './ActiveOrders'
import NewOrders from './(beta-orders)/newOrders'

type OrdersTypeT = 'all' | 'active' | 'new' 

const OrdersTab = () => {
    const [ordersType, setOrdersType] = React.useState<OrdersTypeT>('all')

    const handleClick = (type: OrdersTypeT) => {
        setOrdersType(type)
    }

    return (
        <ContentLayout title={
                <div className='flex flex-row gap-3'>
                    <Button variant={ordersType=="all"?"default":"outline"} onClick={()=>{
                        handleClick("all")
                    }}>Все</Button>
                    <Button variant={ordersType=="active"?"default":"outline"} onClick={()=>{
                        handleClick("active")
                    }}>Активные</Button>
                    <Button variant={ordersType=="new"?"default":"outline"} onClick={()=>{
                        handleClick("new")
                    }}>Новые</Button>
                </div>

        } bg={typeof window !== 'undefined' && window.innerWidth < 768 ? ContentLayoutBg.Transperent : ContentLayoutBg.Black}>
            {
            ordersType === 'all' ? (
                    <AllOrders />
            ) : ordersType === 'active' ? (
                    <ActiveOrders></ActiveOrders>
                ) : (
                    <NewOrders></NewOrders>
                )
            }
        </ContentLayout>
    )
}

export default OrdersTab