import React from 'react'

const Order = async ({
    params,
  }: {
    params: Promise<{ id: string }>
  }) => {
    const id = (await params).id;
    return (
        <div>Order #{id}</div>
    )
}

export default Order