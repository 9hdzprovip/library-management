import './Table.css';

function Table({ columns = [], data = [], renderActions }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
            {renderActions && <th className="table__actions-header">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr key={row.id ?? index}>
                {columns.map((column) => (
                  <td key={column.key}>{row[column.key]}</td>
                ))}
                {renderActions && <td className="table__actions">{renderActions(row)}</td>}
              </tr>
            ))
          ) : (
            <tr>
              <td className="table__empty" colSpan={columns.length + (renderActions ? 1 : 0)}>
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
