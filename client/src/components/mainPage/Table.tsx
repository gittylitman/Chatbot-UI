import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataGrid, GridColDef, GridRowId, GridRowSelectionModel } from '@mui/x-data-grid';
import React from 'react';

interface TableProps {
    rows: Array<any>;
    onSelectionChange?: (selectedRows: Array<any>) => void;
}

const extractIds = (value: any): Array<GridRowId> => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (value instanceof Set) return Array.from(value);
    if (typeof value === 'object') return Object.keys(value);
    return [];
};

const resolveSelection = (selection: any, allRows: Array<any>): Array<GridRowId> => {
    const allIds = allRows.map(r => r.id);

    if (selection?.type !== 'exclude') {
        return extractIds(selection?.ids);
    }
    const excluded = new Set(extractIds(selection?.ids));
    return allIds.filter(id => !excluded.has(id));
};

export const Table: React.FC<TableProps> = ({ rows, onSelectionChange }) => {
    const [selectedRows, setSelectedRows] = React.useState<Array<any>>([]);

    const rowsWithId = React.useMemo(
        () => rows.map((row, index) => ({ id: index, ...row })),
        [rows]
    );

    const columns: Array<GridColDef> = [
        { field: 'conceptId', headerName: 'Concept ID', width: 120 },
        { field: 'conceptCode', headerName: 'Concept Code', width: 140 },
        { field: 'conceptName', headerName: 'Concept Name', width: 300 },
        { field: 'classId', headerName: 'Class ID', width: 150 },
        { field: 'domainId', headerName: 'Domain ID', width: 150 },
        { field: 'vocabularyId', headerName: 'Vocabulary ID', width: 150 },
        { field: 'invalidReason', headerName: 'Invalid Reason', width: 120 },
        { field: 'domainName', headerName: 'Domain Name', width: 150 },
        { field: 'vocabularyName', headerName: 'Vocabulary Name', width: 150 },
        { field: 'validStartDate', headerName: 'Valid Start', width: 120 },
        { field: 'validEndDate', headerName: 'Valid End', width: 120 },
    ];

    return (
        <Box>
            <Box className="w-full max-w-5xl rounded-lg overflow-hidden border border-[#00385B]">
                <DataGrid
                    autoHeight
                    rows={rowsWithId}
                    columns={columns}
                    checkboxSelection
                    disableColumnMenu
                    onRowSelectionModelChange={(selection: GridRowSelectionModel) => {
                        const ids = resolveSelection(selection, rowsWithId);

                        const selected = ids
                            .map(id => rowsWithId.find(r => r.id === id))
                            .filter(Boolean);

                        setSelectedRows(selected);
                        onSelectionChange?.(selected);
                    }}
                    getRowClassName={params =>
                        params.indexRelativeToCurrentPage % 2 === 0 ? 'bg-gray-50' : ''
                    }
                />
            </Box>

            <Box className="w-full max-w-5xl flex justify-center mt-2">
                <Button
                    disabled={selectedRows.length === 0}
                    className={`px-4 py-2 !rounded-lg !text-white !transition
                        ${selectedRows.length === 0
                            ? '!bg-gray-300 cursor-not-allowed'
                            : '!bg-[#00385B] hover:!bg-[#005174]'
                        }`}
                >
                    Send selected rows
                </Button>
            </Box>
        </Box>
    );
};

export default Table;
