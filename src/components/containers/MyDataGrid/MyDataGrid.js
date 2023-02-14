import React, {
  useState,
} from 'react';
import Box from '@mui/material/Box';
import {
  DataGrid, GridColDef, GridToolbar,
  GridCellModes,
  // GridCellEditStopReasons,
} from '@mui/x-data-grid';
import {
  Chip, FormControl, MenuItem, Select,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import {
  faLink,
  faPen,
  faPencil,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import {
  map, get, find,
} from 'lodash';
import { Link } from 'react-router-dom';
import { statuses } from '../../pages/Dashboard';
import { useScreenSize } from '../../../utils/hooks';
// import { toast } from 'react-toastify';

type Props = {
  onDelete: Function,
  onChangeStatus: Function,
  onChangeTextField: Function,
  onChangeCategory: Function,
  onDeleteArticle: Function,
  categories: { key: Object },
  setStar(id: number, star: boolean): void,
  rows: any[],
};

export default function MyDataGrid(props: Props) {
  const [selectionModel, setSelectionModel] = useState([]);

  const [cellModesModel, setCellModesModel] = useState({});

  const categories = map(props.categories, (c) => ({
    value: c.id,
    label: c.category_name,
    color: 'primary',
  }));

  const handleCellClick = React.useCallback((params: GridCellParams) => {
    if (params.field === '__check__') {
      return;
    }
    if (!params.colDef.editable) {
      return;
    }

    setCellModesModel((prevModel) => ({
      // Revert the mode of the other cells from other rows
      ...Object.keys(prevModel).reduce(
        (acc, id) => ({
          ...acc,
          [id]: Object.keys(prevModel[id]).reduce(
            (acc2, field) => ({
              ...acc2,
              [field]: { mode: GridCellModes.View },
            }),
            {},
          ),
        }),
        {},
      ),
      [params.id]: {
        // Revert the mode of other cells in the same row
        ...Object.keys(prevModel[params.id] || {}).reduce(
          (acc, field) => ({ ...acc, [field]: { mode: GridCellModes.View } }),
          {},
        ),
        [params.field]: { mode: GridCellModes.Edit },
      },
    }));
  }, []);

  // function CheckboxSelectionCustom(params) {
  //   const handleChange = (event) => {
  //     const id = get(params, 'id');
  //     if (event.target.checked) {
  //       setSelectedIds((prevIds) => [...prevIds, id]);
  //     } else {
  //       setSelectedIds((prevIds) => prevIds.filter((prevId) => prevId !== id));
  //     }
  //   };

  //   return (
  //     <Checkbox
  //       checked={selectedIds.indexOf(params.id) !== -1}
  //       onChange={handleChange}
  //     />
  //   );
  // }

  const handleCellModesModelChange = React.useCallback((newModel) => {
    setCellModesModel(newModel);
  }, []);

  function renderTextField(params: GridEditCellPropsParams) {
    // eslint-disable-next-line no-unused-vars
    const { api, id, field } = params;

    const handleChange = (event) => {
      api.setEditCellValue({ id, field, value: event.target.value }, event);
    };

    const handleBlur = (event) => {
      props.onChangeTextField(id, field, event.target.value);

      setCellModesModel((prevModel) => ({
        ...prevModel,
        [id]: {
          ...prevModel[id],
          [field]: { mode: GridCellModes.View },
        },
      }));
    };

    const handleRef = (element) => {
      if (element) {
        element.focus();
      }
    };

    return (
      <div
        className='datagrid-textfield-container'
      >
        <input
          value={params.value}
          onBlur={handleBlur}
          onChange={handleChange}
          ref={handleRef}
          className='datagrid-textfield'
        />
      </div>

    );
  }

  function renderEditChip(params: GridEditCellPropsParams) {
    // eslint-disable-next-line no-unused-vars
    const { api, id, field } = params;

    const handleChange = (event) => {
      // api.setEditCellValue({ id, field, value: event.target.value }, event);
      props.onChangeStatus(id, event.target.value);

      setCellModesModel((prevModel) => ({
        ...prevModel,
        [id]: {
          ...prevModel[id],
          [field]: { mode: GridCellModes.View },
        },
      }));
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
          value={params.value.value}
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

  function renderEditCategory(params: GridEditCellPropsParams) {
    // eslint-disable-next-line no-unused-vars
    const { api, id, field } = params;

    const handleChange = (event) => {
      props.onChangeCategory(id, event.target.value);

      setCellModesModel((prevModel) => ({
        ...prevModel,
        [id]: {
          ...prevModel[id],
          [field]: { mode: GridCellModes.View },
        },
      }));
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
          value={find(categories, { label: params.value })?.value}
          onChange={handleChange}
          sx={{
            width: '80%',
            height: '80%',
            border: 'none',
          }}
          ref={handleRef}
        >
          {map(categories, (status, index) => (
            <MenuItem key={index} value={status.value}>{status.label}</MenuItem>
          ))}

        </Select>
      </FormControl>
    );
  }

  function getChipProps(params: GridRenderCellParams): ChipProps {
    const sx = { gap: '10px', padding: '10px' };
    const res = get(statuses, params.value.value, { label: 'Unknown', color: 'default', icon: faPencil });

    return {
      label: res.label,
      icon: <FontAwesomeIcon icon={res.icon} />,
      color: res.color,
      sx,
    };
  }

  function renderStatusCell(params) {
    return (<Chip {...getChipProps(params)} />);
  }

  function renderCategoryCell(params) {
    const sx = { gap: '10px', padding: '10px' };
    const res = find(categories, (c) => c.label === params.value) || { label: 'Unknown', color: 'default' };

    return (
      <Chip
        label={res.label}
        color={res.color}
        sx={sx}
      />
    );
  }

  const handleDelete = () => {
    // eslint-disable-next-line
    console.log('delete', selectionModel);

    // eslint-disable-next-line no-alert, no-restricted-globals
    if (confirm(`Are you sure you want to delete articles with id's ${selectionModel.join(', ')}?`)) {
      map(selectionModel, (id) => {
        props.onDeleteArticle(id);
      });
    }

    setSelectionModel([]);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 30 },
    {
      field: 'published_link',
      headerName: 'Link',
      width: 30,
      editable: false,
      renderCell: (params) => {
        // console.log(params);
        if (get(params, 'row.status.value') === 'published') {
          return (
            <Link
              to={`/singleblog/${params.row.id}`}
            >
              <FontAwesomeIcon icon={faLink} />
            </Link>
          );
        }

        return (
          <Link
            to={`/submit-work/${params.row.id}`}
          >
            <FontAwesomeIcon icon={faPen} />
          </Link>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 175,
      editable: true,
      renderEditCell: renderEditChip,
      renderCell: (params) => renderStatusCell(params),
      cellClassName: (/* params: GridCellParams<number> */) => classNames('datagrid-cell'),
    },
    {
      field: 'star',
      headerName: 'Star',
      width: 30,
      editable: false,
      renderCell: (params) => {
        const onClick = () => {
          props.setStar(params.row.id, !get(params, 'row.star'));
        };

        return (
          <div
            onClick={onClick}
            className='datagrid-cell star'
          >
            {get(params, 'row.star') && <FontAwesomeIcon className='star-icon' icon={faStar} /> }
            {!get(params, 'row.star') && <FontAwesomeIcon className='star-icon' icon={faStarRegular} /> }
          </div>
        );
      },
    },
    {
      field: 'title',
      headerName: 'Article title',
      width: 250,
      editable: true,
      renderEditCell: renderTextField,

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
      field: 'category',
      headerName: 'Category',
      width: 250,
      editable: true,
      renderEditCell: renderEditCategory,
      renderCell: (params) => renderCategoryCell(params),
      cellClassName: (/* params: GridCellParams<number> */) => classNames('datagrid-cell'),
    },
    {
      field: 'ORCID',
      headerName: 'ORCID',
      width: 250,
      editable: false,
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
            // eslint-disable-next-line
            onClick={() => console.log('edit', params.row)}
          />
          <FontAwesomeIcon
            className='datagrid-cell-actions-icon'
            icon={faSave}
            // eslint-disable-next-line
            onClick={() => console.log('save', params.row)}
          />
        </div>
      ),
    },
  ];

  const { isMobile } = useScreenSize();

  return (
    <Box
      sx={{
        height: 500,
        width: '90%',
        borderRadius: '18px',
        boxShadow: '0px 0px 12px 0px rgba(0,0,0,0.25)',
        border: '1px solid #e0e0e0',
        padding: isMobile ? '0px' : '20px',
        margin: isMobile ? '0px' : '10px',
      }}
    >
      <DataGrid
        sx={{
          border: 'none',

        }}
        rows={props.rows}
        columns={columns}
        pageSize={5}
        components={{
          Toolbar: GridToolbar,
        }}
        // onStateChange={(state) => console.log(state)}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        // used for one click edit
        cellModesModel={cellModesModel}
        // used for one click edit
        onCellClick={handleCellClick}
        // used for one click edit
        onCellModesModelChange={handleCellModesModelChange}
        // used for checkbox selection
        onSelectionModelChange={(newSelection) => setSelectionModel(newSelection)}
        // used for all text fields
        selectionModel={selectionModel}
      />
      {selectionModel.length > 0 && (
      <div className='datagrid-selected-rows-actions'>
        <button
          className='datagrid-selected-rows-delete'
          type='button'
          onClick={() => handleDelete()}
        >
          Delete
        </button>
        {/* <Select
          className='datagrid-selected-rows-select-status'
          labelId="demo-simple-select-label"
        >
          {map(statuses, (status, index) => (
            <MenuItem key={index} value={status.value}>{status.label}</MenuItem>
          ))}

        </Select> */}
      </div>

      )}
    </Box>
  );
}
