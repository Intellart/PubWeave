import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import {
  Chip, FormControl, MenuItem, Select,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-regular-svg-icons';
import {
  faCheck, faPencil, faRotateRight, faXmark,
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { filter, includes, map } from 'lodash';
// import { toast } from 'react-toastify';

const statuses = [
  {
    value: 'Published',
    label: 'Published',
    color: 'primary',
    icon: <FontAwesomeIcon icon={faCheck} />,
  },
  {
    value: 'Requested',
    label: 'Requested',
    color: 'warning',
    icon: <FontAwesomeIcon icon={faRotateRight} />,
  },
  {
    value: 'Rejected',
    label: 'Rejected',
    color: 'error',
    icon: <FontAwesomeIcon icon={faXmark} />,
  },
];

function getChipProps(params: GridRenderCellParams): ChipProps {
  const res = filter(statuses, (status) => status.value === params.value);

  if (res.length > 0) {
    return {
      label: res[0].label,
      color: res[0].color,
      icon: res[0].icon,
    };
  }

  return {
    label: 'Unknown',
  };
}

function renderEditChip(params: GridEditCellPropsParams) {
  const { api, id, field } = params;

  const handleChange = (event) => {
    api.setEditCellValue({ id, field, value: event.target.value }, event);
  };

  const handleRef = (element) => {
    if (element) {
      element.focus();
    }
  };

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
        ref={handleRef}
      >
        {map(statuses, (status, index) => (
          <MenuItem key={index} value={status.value}>{status.label}</MenuItem>
        ))}

      </Select>
    </FormControl>
  );
}

const randStatus = () => statuses[Math.floor(Math.random() * statuses.length)].value;

export default function DataGridDemo() {
  const [selectedIds, setSelectedIds] = useState([]);
  const [rows, setRows] = useState([
    {
      id: 1, status: randStatus(), firstName: 'Jon', email: 'jon@gmail.com', ORCID: '123456789', registeredOn: '2023-01-25T16:57',
    },
    {
      id: 2, status: randStatus(), firstName: 'Jon', email: 'jon@gmail.com', ORCID: '123456789', registeredOn: '2023-01-25T16:57',
    },
    {
      id: 3, status: randStatus(), firstName: 'Jon', email: 'jon@gmail.com', ORCID: '123456789', registeredOn: '2023-01-25T16:57',
    },
    {
      id: 4, status: randStatus(), firstName: 'Jon', email: 'jon@gmail.com', ORCID: '123456789', registeredOn: '2023-01-25T16:57',
    },
    {
      id: 5, status: randStatus(), firstName: 'Jon', email: 'jon@gmail.com', ORCID: '123456789', registeredOn: '2023-01-25T16:57',
    },
    {
      id: 6, status: randStatus(), firstName: 'Jon', email: 'jon@gmail.com', ORCID: '123456789', registeredOn: '2023-01-25T16:57',
    },
    {
      id: 7, status: randStatus(), firstName: 'Jon', email: 'jon@gmail.com', ORCID: '123456789', registeredOn: '2023-01-25T16:57',
    },
    {
      id: 8, status: randStatus(), firstName: 'Jon', email: 'jon@gmail.com', ORCID: '123456789', registeredOn: '2023-01-25T16:57',
    },
    {
      id: 9, status: randStatus(), firstName: 'Jon', email: 'jon@gmail.com', ORCID: '123456789', registeredOn: '2023-01-25T16:57',
    },
  ]);

  const handleDelete = () => {
    console.log('delete', selectedIds);
    setRows(filter(rows, (row) => !includes(selectedIds, row.id)));
  };
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'status',
      headerName: 'Status',
      renderCell: (params) => <Chip {...getChipProps(params)} />,
      width: 175,
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
      width: 300,
      editable: true,
      renderCell: (params) => {
        const date = new Date(params.value);

        return (
          <div className='datagrid-cell datagrid-cell-date'>
            <span className='datagrid-cell-date-date'>{date.toLocaleDateString()}</span>
            <span className='datagrid-cell-date-time'>{date.toLocaleTimeString()}</span>
          </div>
        );
      },
      renderEditCell: (params) => (
        <div className='datagrid-cell datagrid-cell-date'>
          <input
            className='datagrid-cell-date-input'
            type='datetime-local'
            value={params.value}
            onChange={(event) => {
              params.api.setEditCellValue({ id: params.id, field: params.field, value: event.target.value }, event);
            }}
          />
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <div className='datagrid-cell datagrid-cell-actions'>
          <FontAwesomeIcon
            className='datagrid-cell-actions-icon'
            icon={faPencil}
            onClick={() => console.log('edit', params.row)}
          />
          <FontAwesomeIcon
            className='datagrid-cell-actions-icon'
            icon={faSave}
            onClick={() => console.log('save', params.row)}
          />
        </div>
      ),
    },
  ];

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
        // onStateChange={(state) => console.log(state)}
        onSelectionModelChange={(newSelection) => setSelectedIds(newSelection)}
      />
      {selectedIds.length > 0 && (
      <button
        className='datagrid-selected-rows-delete'
        type='button'
        onClick={() => handleDelete()}
      >
        Delete
      </button>
      )}
    </Box>
  );
}
