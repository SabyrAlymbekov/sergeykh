// import NewOrders from '@/components/orders/(beta-orders)/newOrders'
import React from 'react'
import OrdersTab from "@workspace/ui/components/shared/orders/OrdersTab";
// import ActiveOrders from "@/components/orders/ActiveOrders";

const Orders = () => {
  return (
    <div>
      {/*<NewOrders></NewOrders>*/}
      {/*  <ActiveOrders/>*/}
        <OrdersTab status={'master'} accessStatus={'pro'}></OrdersTab>
    </div>
  )
}

export default Orders