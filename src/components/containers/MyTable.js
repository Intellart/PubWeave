// @flow
import { faker } from '@faker-js/faker';
import React from 'react';
// import { makeStyles } from 'material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit } from '@fortawesome/free-brands-svg-icons';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const USERS = [];
const STATUSES = ['Published', 'Request', 'Declined'];

for (let i = 0; i < 14; i++) {
  USERS[i] = {
    name: faker.name.findName(),
    text: faker.lorem.paragraph(5),
    id: faker.datatype.uuid(),
    status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
  };
}

// console.log(USERS);

// function createData(
//   name: string,
//   calories: number,
//   fat: number,
//   carbs: number,
//   protein: number,
// ) {
//   return {
//     name, calories, fat, carbs, protein,
//   };
// }

// const rows = [
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Gingerbread', 356, 16.0, 49, 3.9),
// ];

function MyTable(): Node {
  const handleEdit = (rowid) => {
    console.log(rowid);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">STATUS</TableCell>
            <TableCell align="right">NAME</TableCell>
            <TableCell align="right">ORCID ID</TableCell>
            <TableCell align="right">REGISTERED ON</TableCell>
            <TableCell align="right" />
          </TableRow>
        </TableHead>
        <TableBody>
          {USERS.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                className="status"
                // sx={{
                //   borderRadius: 10,
                //   color: 'blue',
                //   border: '1px solid red',
                //   mar: 10,
                // }}
              >
                <Chip label={row.status} />
              </TableCell>
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">{row.id}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
              <TableCell align="right"><FontAwesomeIcon onClick={() => handleEdit(row.id)} icon={faEdit} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default MyTable;
