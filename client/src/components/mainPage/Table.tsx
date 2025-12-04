import * as React from "react";
import { DataGrid, GridColDef, GridRowSelectionModel, GridRowId } from "@mui/x-data-grid";
import { Box } from "@mui/material";

interface CustomTableProps {
    rows: any[];
    onSelectionChange?: (selectedRows: any[]) => void;
}

const normalizeSelection = (selection: GridRowSelectionModel): GridRowId[] => {
    if (selection == null) return [];

    if (Array.isArray(selection)) return selection as GridRowId[];

    if (selection instanceof Set) return Array.from(selection) as GridRowId[];

    if (typeof selection === "object") {
        try {
            const keys = Object.keys(selection);
            if (keys.length > 0) return keys as GridRowId[];
        } catch (e) {
        }
    }

    return [selection as GridRowId];
};

export const CustomTable: React.FC<CustomTableProps> = ({ rows, onSelectionChange }) => {
    const [selectedRows, setSelectedRows] = React.useState<any[]>([]);
    const rowsWithId = React.useMemo(() => rows.map((row, index) => ({ id: index, ...row })), [rows]);

    const columns: GridColDef[] = [
        { field: "conceptId", headerName: "Concept ID", width: 120 },
        { field: "conceptCode", headerName: "Concept Code", width: 140 },
        { field: "conceptName", headerName: "Concept Name", width: 300 },
        { field: "classId", headerName: "Class ID", width: 150 },
        { field: "domainId", headerName: "Domain ID", width: 150 },
        { field: "vocabularyId", headerName: "Vocabulary ID", width: 150 },
        { field: "invalidReason", headerName: "Invalid Reason", width: 120 },
        { field: "domainName", headerName: "Domain Name", width: 150 },
        { field: "vocabularyName", headerName: "Vocabulary Name", width: 150 },
        { field: "validStartDate", headerName: "Valid Start", width: 120 },
        { field: "validEndDate", headerName: "Valid End", width: 120 },
    ];
    console.log(selectedRows);

    return (
        <Box>
            <div className="w-full max-w-5xl rounded-lg overflow-hidden border border-[#00385B]">
                <DataGrid
                    autoHeight
                    rows={rowsWithId}
                    columns={columns}
                    checkboxSelection
                    disableColumnMenu
                    onRowSelectionModelChange={(selection: GridRowSelectionModel) => {
                        const ids = normalizeSelection(selection);

                        const selected = ids
                            .map(id => rowsWithId.find(r => String(r.id) === String(id)))
                            .filter(Boolean) as any[];

                        setSelectedRows(selected);
                        if (onSelectionChange) onSelectionChange(selected);
                    }}
                    getRowClassName={(params) =>
                        params.indexRelativeToCurrentPage % 2 === 0 ? "bg-gray-50" : ""
                    }
                />
            </div>
            <button
                disabled={selectedRows.length === 0}
                className={`px-4 py-2 rounded-lg text-white transition
                    ${selectedRows.length === 0
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-[#00385B] hover:bg-[#005174]"
                    }`}
            >
                Send selected rows
            </button>

        </Box>
    );
};

export default CustomTable;
