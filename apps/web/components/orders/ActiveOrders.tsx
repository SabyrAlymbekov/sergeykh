import React from 'react'
import ContentLayout from './ContentLayout'
import { DataTableDemo } from './ActiveOrdersTable'

const ActiveOrders = () => {
  return (
    <ContentLayout title="Мои заказы" footer={<div>Footer</div>}>
        <DataTableDemo></DataTableDemo>
    </ContentLayout>
  )
}

export default ActiveOrders