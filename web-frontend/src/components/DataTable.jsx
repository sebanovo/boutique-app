const Column = ({ column }) => {
  return (
    <th
      scope='col'
      className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'
    >
      {column.title}
    </th>
  );
};

const DataTable = ({
  columns,
  data,
  onEdit,
  onDelete,
  emptyMessage = 'No hay registros para mostrar',
}) => {
  return (
    <div className='overflow-hidden rounded-lg bg-white shadow'>
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              {columns.map((column) => (
                <Column key={column.key} column={column} />
              ))}
              {(onEdit || onDelete) && (
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'
                >
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 bg-white'>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={item.id || index} className='hover:bg-gray-50'>
                  {columns.map((column) => (
                    <td key={column.key} className='px-6 py-4 whitespace-nowrap'>
                      {column.render ? column.render(item) : item[column.key]}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className='px-6 py-4 text-sm font-medium whitespace-nowrap'>
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className='mr-3 cursor-pointer text-indigo-600 hover:text-indigo-900'
                        >
                          Editar
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item.id)}
                          className='cursor-pointer text-red-600 hover:text-red-900'
                        >
                          Eliminar
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                  className='px-6 py-4 text-center text-sm text-gray-500'
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
