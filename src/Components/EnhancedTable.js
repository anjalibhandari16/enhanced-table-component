import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Paper, TablePagination,
  TextField, InputAdornment, IconButton, Modal, Box, Button, Typography, useMediaQuery, Card, CardContent, CardHeader
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import DownloadIcon from './DownloadData'
import 'jspdf-autotable';

const EnhancedTable = ({ data, columns }) => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({});
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [currentFilterColumn, setCurrentFilterColumn] = useState(null);
  const [currentFilterValue, setCurrentFilterValue] = useState('');

  const isMobile = useMediaQuery('(max-width:600px)');

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    setPage(0);
  };

  const handleFilterChange = (column, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [column]: value,
    }));
    setPage(0);
  };

  const handleClearFilters = () => {
    setFilters({});
    setPage(0);
  };

  const handleOpenFilterModal = (column) => {
    setCurrentFilterColumn(column);
    setCurrentFilterValue(filters[column] || '');
    setFilterModalOpen(true);
  };

  const handleCloseFilterModal = () => {
    setFilterModalOpen(false);
  };

  const applyFilter = () => {
    handleFilterChange(currentFilterColumn, currentFilterValue);
    handleCloseFilterModal();
  };

  const filteredData = data.filter((row) =>
    columns.some((column) =>
      (row[column.id] || '').toString().toLowerCase().includes(searchText.toLowerCase())
    ) && Object.entries(filters).every(([column, value]) =>
      (row[column] || '').toString().toLowerCase().includes(value.toLowerCase())
    )
  );

  const sortedData = filteredData.sort((a, b) => {
    if (orderBy) {
      if ((a[orderBy] || '') < (b[orderBy] || '')) return order === 'asc' ? -1 : 1;
      if ((a[orderBy] || '') > (b[orderBy] || '')) return order === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  useEffect(() => {
    if (filteredData.length <= rowsPerPage) {
      setPage(0);
    }
  }, [filteredData, rowsPerPage]);

  return (
    <Paper>
      <Box display="flex" justifyContent="space-between" alignItems="center" padding="16px" color="#00308F">
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search"
          value={searchText}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Box display="flex" justifyContent="space-between" alignItems="center" padding="16px">
        <IconButton onClick={handleClearFilters}  style={{display:"flex", flexDirection:"column"}}>
          <FilterAltOffIcon style={{fontSize:"22px", color:"#00308F"}}/>
          <div style={{fontSize:"10px", color:"#00308F"}}>Clear Filters</div>
        </IconButton >
        <DownloadIcon filteredData={filteredData} columns={columns}/>
        </Box>
        
      </Box>
      {isMobile ? (
        <Box>
          {paginatedData.map((row, index) => (
            <Card key={index} variant="outlined" style={{ margin: '16px'}}>
              <CardHeader title={`Row ${index + 1}`} />
              <CardContent>
                {columns.map((column) => (
                  <Typography key={column.id}><strong>{column.label}:</strong> {row[column.id]}</Typography>
                ))}
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} style={{color:"#00308F", fontWeight:"600" }}>
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                    <IconButton onClick={() => handleOpenFilterModal(column.id)}>
                      <FilterAltIcon />
                    </IconButton>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>{row[column.id]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Modal
        open={filterModalOpen}
        onClose={handleCloseFilterModal}
        aria-labelledby="filter-modal-title"
        aria-describedby="filter-modal-description"
      >
        <Box sx={{ ...modalStyle, width: 400 }}>
          <Typography id="filter-modal-title" variant="h6" component="h2">
            Set Filter for {currentFilterColumn}
          </Typography>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Filter value"
            value={currentFilterValue}
            onChange={(e) => setCurrentFilterValue(e.target.value)}
            style={{ marginTop: '16px', width: '100%' }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
            <Button variant="contained" onClick={applyFilter}>Apply</Button>
            <Button variant="outlined" onClick={handleCloseFilterModal}>Cancel</Button>
          </Box>
        </Box>
      </Modal>
    </Paper>
  );
};

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

export default EnhancedTable;







// npm install jspdf jspdf-autotable
// npm install react-csv xlsx jspdf jspdf-autotable
// npm install @mui/icons-material       