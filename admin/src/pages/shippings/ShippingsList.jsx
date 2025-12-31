import DataTable from '@/components/UI/Tables/DataTable'
import React from 'react'

const ShippingList = ({shippings = [], user, loading, refreshData}) => {
    const headers = [
        { label: 'ZIP', field: 'zip', type: 'string' },
        { label: 'City', field: 'city', type: 'string' },
        { label: 'Country', field: 'country', type: 'string' },
        { label: 'Default', field: 'isDefault', type: 'bool' },
    ];

    return (
        <div>
            <DataTable
                tableName='Shippings'
                type='Shipping'
                link='/users/shippings'
                createLink={`/users/${user._id}/shippings/create`}
                headers={headers}
                data={shippings}
                loading={loading}
                refreshData={refreshData}
                actions={['delete', 'edit', 'make-default']}
                customize={{ showPagination: false, showSearch: false, showTableName: true, showSelect: false }}
            />
        </div>
    )
}

export default ShippingList