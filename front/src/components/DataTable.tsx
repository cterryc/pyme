import { StatusBadge } from './StatusBadge'

interface Column {
  key: string
  label: string
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (value: any, row: any) => React.ReactNode
}

interface DataTableProps {
  columns: Column[]
  data: any[]
  onRowClick?: (row: any) => void
}

export const DataTable = ({ columns, data, onRowClick }: DataTableProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR')
  }

  const renderCellValue = (column: Column, value: any, row: any) => {
    if (column.render) {
      return column.render(value, row)
    }

    // Auto-format based on column key
    if (column.key.toLowerCase().includes('fecha') || (column.key.toLowerCase().includes('createdat') && value)) {
      // console.log('key = ' + column.key, 'Fecha = ' + value, 'FormatedDate = ' + formatDate(value))
      return formatDate(value)
    }

    if (column.key.toLowerCase().includes('monto')) {
      return formatCurrency(value)
    }

    if (column.key.toLowerCase().includes('estado') || column.key.toLowerCase().includes('statuscredit')) {
      // console.log('key = ' + column.key, 'BADGE STATUS = ' + value)
      return <StatusBadge status={value} />
    }

    return value
  }

  // const getAlignmentClass = (align?: string) => {
  //   switch (align) {
  //     case 'center':
  //       return 'text-center'
  //     case 'right':
  //       return 'text-right'
  //     default:
  //       return 'text-left'
  //   }
  // }

  return (
    <div className='bg-white rounded-lg shadow overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider
                  ${column.key != 'acciones' && 'text-left'}
                    `}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {data.map((row, index) => (
              <tr key={index}>
                {columns.map((column, colIndex) => (
                  <td
                    key={column.key}
                    className={`px-6 py-4 whitespace-nowrap text-sm`}
                    onClick={() => {
                      if (colIndex === columns.length - 1) {
                        onRowClick?.(row)
                      }
                    }}
                  >
                    {renderCellValue(column, row[column.key], row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
