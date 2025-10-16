
export const PymeTableSkeleton = () => {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200 animate-pulse">
      <table className="min-w-max border-collapse w-full">
        <thead className="text-gray-400 text-left">
          <tr className="border-b-2 border-gray-200">
            {[...Array(5)].map((_, i) => (
              <th key={i} className="p-3 min-w-40">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, rowIndex) => (
            <tr key={rowIndex} className="border-b border-gray-200">
              {[...Array(5)].map((_, colIndex) => (
                <td key={colIndex} className="p-3">
                  <div className="h-5 w-full bg-gray-200 rounded"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
