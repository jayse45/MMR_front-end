import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function SimpleTable({itemIndex=[], titles=itemIndex, rows = []}) {
	return (
		<TableContainer component={Paper}>
			<Table size="small" sx={{ minWidth: 200 }} aria-label="simple table">
				<TableHead>
					<TableRow>
						{titles.map((row) => (<TableCell key={Math.random(100)} align="right">{row}</TableCell>) )}
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((row) => (
						<TableRow
							key={row._id}
							sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
						>
							{itemIndex.map((index) => (<TableCell key={Math.random(100)} align="right">{row[index]}</TableCell>))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
