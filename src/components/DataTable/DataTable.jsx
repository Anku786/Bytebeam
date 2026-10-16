import { Alert } from "../../features/fleet/Alert";

export function DataTable({ columns, rows, onRowClick, empty = 'No rows' }) {
    return (
        <div className="table-wrap">
            <table className="data-table">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column.key}>{column.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="empty">
                                {empty}
                            </td>
                        </tr>
                    ) : (
                        rows.map((row) => (
                            <tr
                                key={row.id}
                                className={onRowClick ? 'clickable' : undefined}
                                onClick={() => onRowClick?.(row)}
                            >
                                {columns.map((column) => (
                                    <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <Alert />
        </div>
    )
}