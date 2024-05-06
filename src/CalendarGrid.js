import React, { useMemo, useState, useEffect } from 'react';
import { useTable } from 'react-table';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

const CalendarGrid = () => {
    const [year, setYear] = useState(new Date().getFullYear());  // Defaults to the current year
    const [month, setMonth] = useState(new Date().getMonth() + 1); // Defaults to the current month (1-12)
    const [filterName, setFilterName] = useState('');
    const [people, setPeople] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/data.json');  // Adjust the path if your file is located elsewhere
                const data = await response.json();
                setPeople(data);
            } catch (error) {
                console.error('Failed to fetch data', error);
            }
        };

        fetchData();
    }, []);

    const days = useMemo(() => {
        const startDate = startOfMonth(new Date(year, month - 1));
        const endDate = endOfMonth(startDate);
        return eachDayOfInterval({ start: startDate, end: endDate });
    }, [year, month]);

    const data = useMemo(() => {
        return (filterName ? people.filter(person => person.name.toLowerCase().includes(filterName.toLowerCase())) : people)
            .map(person => ({
                ...person,
                ...days.reduce((acc, day, index) => ({
                    ...acc,
                    [format(day, 'yyyy-MM-dd')]: person['2024'] && person['2024'][month.toString()] ? 
                      (person['2024'][month.toString()][index] || 'Unknown') : 'Unknown'
                }), {})
            }));
    }, [people, days, filterName, month]);

    const columns = useMemo(() => [
        { Header: 'Name', accessor: 'name' },
        { Header: 'Remaining Holidays', accessor: 'remainingHolidays' },
        { Header: 'Available Time', accessor: 'availableTime' },
        ...days.map(day => ({
            Header: format(day, 'MMM d'),
            accessor: format(day, 'yyyy-MM-dd'),
            Cell: ({ value }) => <div style={{ color: value === 'Free' ? 'blue' : 'red', fontWeight: 'bold' }}>{value}</div>
        })),
    ], [days]);

    const tableInstance = useTable({ columns, data });

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Filter by name..."
                    value={filterName}
                    onChange={e => setFilterName(e.target.value)}
                    style={{ padding: '8px', marginRight: '10px' }}
                />
                <select 
                    value={month} 
                    onChange={e => setMonth(parseInt(e.target.value, 10))} 
                    style={{ padding: '8px', marginRight: '10px' }}
                >
                    {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{format(new Date(year, i), 'MMMM')}</option>
                    ))}
                </select>
                <input
                    type="number"
                    value={year}
                    onChange={e => setYear(parseInt(e.target.value, 10))}
                    style={{ padding: '8px', width: '80px' }}
                />
            </div>
            <table {...tableInstance.getTableProps()}>
                <thead>
                    {tableInstance.headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...tableInstance.getTableBodyProps()}>
                    {tableInstance.rows.map(row => {
                        tableInstance.prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default CalendarGrid;
