import { useTable } from 'react-table';
import { CommisionCols as CommCol } from '../../../Tables/Commission/columns'
import { useMemo } from 'react';
import { useEffect } from 'react';
import { COMMISSION_DATA } from '../../../constants/constants';

const Acad_Commission = () => {

    useEffect(() => {
        let next = document.querySelector('.tutor-next')

        if (next && next.hasAttribute('id')) {
            next?.removeAttribute('id');
        }
    }, [])

    const data = COMMISSION_DATA

    const columns = useMemo(() => CommCol, []);
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });
    return (
        <>
            <div className="rate-table">
                <table {...getTableProps()}>
                    <thead>
                        {
                            headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {
                                        headerGroup.headers.map((column) => (
                                            <th {...column.getHeaderProps()}>
                                                {column.render('Header')}
                                            </th>
                                        ))
                                    }
                                </tr>
                            ))
                        }
                    </thead>

                    <tbody {...getTableBodyProps()}>
                        {rows.map((row) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell) => {
                                        return (
                                            <td {...cell.getCellProps()}>
                                                {cell.render('Cell')}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

        </>
    );
}

export default Acad_Commission;