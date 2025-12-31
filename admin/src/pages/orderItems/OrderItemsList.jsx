import DataTable from '@/components/UI/Tables/DataTable'
import React from 'react'

const OrderItemsList = ({orderItems = [], order, loading, refreshData, draft = true}) => {
    const headers = [
        { label: 'ID', field: '_id', type: 'string' },
        { label: 'Product', field: 'product', type: 'link', link: 'products' },
        { label: 'Price', field: 'price', type: 'string' },
        { label: 'Quantity', field: 'quantity', type: 'string' },
    ];

    return (
        <div>
            <DataTable
                tableName='Order Items'
                type='OrderItem'
                link='/orders/items'
                createLink={`/orders/${order._id}/items/create`}
                headers={headers}
                data={orderItems}
                loading={loading}
                refreshData={refreshData}
                actions={['delete', 'edit']}
                customize={{ 
                    showPagination: false, 
                    showSearch: false, 
                    showTableName: true, 
                    showSelect: false,
                    showActions: draft
                }}
            />
        </div>
    )
}

export default OrderItemsList