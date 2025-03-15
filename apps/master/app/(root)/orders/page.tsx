// import NewOrders from '@/components/orders/(beta-orders)/newOrders'
import React from 'react'
import OrdersTab from "@/components/orders/OrdersTab";
// import ActiveOrders from "@/components/orders/ActiveOrders";

const Orders = () => {
  return (
    <div>
      {/*<NewOrders></NewOrders>*/}
      {/*  <ActiveOrders/>*/}
        <OrdersTab></OrdersTab>
    </div>
  )
}

export default Orders