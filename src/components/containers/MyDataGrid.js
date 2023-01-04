import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import {
  Chip, FormControl, MenuItem, Select,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faCross, faPencil } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

function getChipProps(params: GridRenderCellParams): ChipProps {
  if (params.value === 'RED') {
    return {
      icon: <FontAwesomeIcon icon={faCheck} />,
      label: params.value,
      color: 'primary',
    };
  } else if (params.value === 'BLUE') {
    return {
      icon: <FontAwesomeIcon icon={faCross} />,
      label: params.value,
      color: 'secondary',
    };
  }

  return {
    label: 'Unknown',
  };
}

function renderEditChip(params: GridEditCellPropsParams) {
  const { api, id, field } = params;
  // const {
  //   id, value, api, field,
  // } = params;

  const handleChange = (event) => {
    console.log(event.target.value);
    api.setEditCellValue({ id, field, value: event.target.value }, event);
    api.commitCellChange({ id, field });
    api.setCellMode(id, field, 'view');
  };

  // const handleRef = (element) => {
  //   if (element) {
  //     element.querySelector(`input[value="${value}"]`).focus();
  //   }
  // };

  return (
    <FormControl
      className='myselect-container'
      sx={{
        width: '100%',
        height: '100%',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >

      <Select
        className='myselect'
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={params.value}
        onChange={handleChange}
        sx={{
          width: '80%',
          height: '80%',
          border: 'none',
        }}
      >
        <MenuItem value="RED">Red</MenuItem>
        <MenuItem value="BLUE">BLUE</MenuItem>
      </Select>
    </FormControl>
  );
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'status',
    headerName: 'Status',
    renderCell: (params) => <Chip {...getChipProps(params)} />,
    width: 120,
    editable: true,
    renderEditCell: renderEditChip,
    cellClassName: (/* params: GridCellParams<number> */) => classNames('datagrid-cell'),
  },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
    editable: true,
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 250,
    editable: true,
  },
  {
    field: 'ORCID',
    headerName: 'ORCID',
    width: 250,
    editable: true,
  },
  {
    field: 'registeredOn',
    headerName: 'Registered on',
    width: 250,
    editable: true,
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 250,
    renderCell: () => (
      <div>
        <FontAwesomeIcon icon={faPencil} />
        <FontAwesomeIcon icon={faSave} />
      </div>
    ),
  },
];

const rows = [
  {
    id: 1, status: 'RED', firstName: 'Jon', email: 'jon@gmail.com', ORCID: '123456789', registeredOn: '2021-01-01',
  },
  {
    id: 2, status: 'RED', firstName: 'Jon', email: 'jon@gmail.com', ORCID: '123456789', registeredOn: '2021-01-01',
  },
  {
    id: 3, status: 'RED', firstName: 'Jon', email: 'jon@gmail.com', ORCID: '123456789', registeredOn: '2021-01-01',
  },
  {
    id: 4, status: 'RED', firstName: 'Jon', email: 'jon@gmail.com', ORCID: '123456789', registeredOn: '2021-01-01',
  },
  {
    id: 5, status: 'RED', firstName: 'Jon', email: 'jon@gmail.com', ORCID: '123456789', registeredOn: '2021-01-01',
  },
  {
    id: 6, status: 'RED', firstName: 'Jon', email: 'jon@gmail.com', ORCID: '123456789', registeredOn: '2021-01-01',
  },
  {
    id: 7, status: 'RED', firstName: 'Jon', email: 'jon@gmail.com', ORCID: '123456789', registeredOn: '2021-01-01',
  },
  {
    id: 8, status: 'RED', firstName: 'Jon', email: 'jon@gmail.com', ORCID: '123456789', registeredOn: '2021-01-01',
  },
  {
    id: 9, status: 'RED', firstName: 'Jon', email: 'jon@gmail.com', ORCID: '123456789', registeredOn: '2021-01-01',
  },
];

export default function DataGridDemo() {
  return (
    <Box
      sx={{
        height: 500,
        width: '90%',
        border: '1px solid black',
        borderRadius: '18px',
        padding: '20px',
        margin: '10px',
      }}
    >
      <DataGrid
        sx={{
          border: 'none',

        }}
        rows={rows}
        columns={columns}
        pageSize={5}
        components={{
          Toolbar: GridToolbar,
        }}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        onStateChange={(state) => console.log(state)}
      />
    </Box>
  );
}
