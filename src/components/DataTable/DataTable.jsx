import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box } from '@mui/material';

export default function DataTable({ title, rows, columns, pageSize = 10, height = "80vh", expandableRows=false, handleRowClick=()=>{}, handleMenuClick=() => {} }) {
	rows = rows.map(row => {
		row.id = row._id;
		return row;
	})
	const handleClickedRow = (params, e, details) => {
		handleRowClick();
	}

	return (
		<Box style={{height, width: '100%', background: "#fff" }}>
			<DataGrid
				rows={rows}
				expandableRows
				disableColumnMenu={false}
				MoreActionsIcon={<MoreVertIcon />}
				pageSize={pageSize}
				rowsPerPageOptions={[10, 25, 50, 100]}
				checkboxSelection={false}
				onRowClick={handleClickedRow}
				columns={columns}
				components={{
					Toolbar: GridToolbar,
				}}
			/>
		</Box>
	);
}
