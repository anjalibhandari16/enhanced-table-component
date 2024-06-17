import React, { useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import {
    Modal, Box, Button
} from '@mui/material';
import { CSVLink } from 'react-csv';
import GetAppIcon from '@mui/icons-material/GetApp';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function DownloadData({filteredData={},columns={}}) {
    const [openDownload, setOpenDownload] = useState(false)

    const handleCloseModal = () => {
        setOpenDownload(false);
    };

    const handleOpenModal = () => {
        setOpenDownload(true);
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, 'table_data.xlsx');
      };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
          head: [columns.map(col => col.label)],
          body: filteredData.map(row => columns.map(col => row[col.id] || '')),
        });
        doc.save('table_data.pdf');
      };

    const getCSVData = (data) => {
        return data.map(row => {
          const newRow = {};
          columns.forEach(col => {
            newRow[col.label] = row[col.id] || '';
          });
          return newRow;
        });
      };


    return (
        <div>
            <DownloadIcon onClick={handleOpenModal}></DownloadIcon>

            {openDownload ?
                <Modal open={openDownload}
                    onClose={handleCloseModal}
                    aria-labelledby="filter-modal-title"
                    aria-describedby="filter-modal-description">

                    <Box sx={{ ...modalStyle, width: 400 }}>
                        <Box>
                            <Button variant="contained" onClick={exportToExcel} startIcon={<GetAppIcon />}>Export Excel</Button>
                            <Button variant="contained" onClick={exportToPDF} startIcon={<GetAppIcon />}>Export PDF</Button>
                            <CSVLink data={getCSVData(filteredData)} headers={columns.map(col => ({ label: col.label, key: col.label }))} filename="table_data.csv">
                                <Button variant="contained" startIcon={<GetAppIcon />}>Export CSV</Button>
                            </CSVLink>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'right', marginTop: '16px' }}>
                            <Button variant="outlined" onClick={handleCloseModal}>Cancel</Button>
                        </Box>
                    </Box>
                </Modal>
                : null}
        </div>
    )
}

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default DownloadData