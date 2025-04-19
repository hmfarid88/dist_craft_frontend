"use client";
import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ImFileExcel } from 'react-icons/im';

type Props = {
    tableRef: React.RefObject<HTMLDivElement>;
    fileName?: string;
    label?: string;
    className?: string;
};

const ExcelExportButton: React.FC<Props> = ({
    tableRef,
    fileName = 'Exported_Table',
  }) => {

    const exportTableToExcel = () => {
        const table = tableRef.current;
        if (!table) return;

        const worksheet = XLSX.utils.table_to_sheet(table);

        // Optional enhancements like column width, formatting can go here
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(file, `${fileName}_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    return (
        <button onClick={exportTableToExcel} className="btn btn-ghost btn-square">
            <ImFileExcel size={30} />
        </button>
    );
};

export default ExcelExportButton;
