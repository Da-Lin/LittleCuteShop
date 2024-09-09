import { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable, } from 'material-react-table';
import { Box, Button, CircularProgress, Typography, } from '@mui/material';

import { getManageableOrders, MANAGEABLE_ORDER_STATUSES, updateOrder } from '../../firebase/firestore/order';
import { isNumber } from '../util/util';
import { useAuth } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';

export default function ManageOrder() {
  // const [validationErrors, setValidationErrors] = useState({});
  //keep track of rows that have been edited
  const [editedOrders, setEditedOrders] = useState({});
  const [orders, setOrders] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
  const [isLoadingOrderError, setIsLoadingOrderError] = useState(false);

  const { userInfo } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!userInfo.isAdmin) {
      navigate('/home')
    }

    async function getAndSetOrders() {
      setIsLoadingOrder(true)
      await getManageableOrders().then((os) => {
        setIsLoadingOrder(false)
        setOrders(os)
      }).catch((error) => {
        setIsLoadingOrder(false)
        setIsLoadingOrderError(true)
        console.log(error)
      })
    }
    getAndSetOrders()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDateFilter = (rowDate, id, filterValue) => {
    return new Date(filterValue).setHours(0, 0, 0, 0) === rowDate.toDate().setHours(0, 0, 0, 0)
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'orderId',
        header: 'Order Number',
        enableEditing: false,
        size: 50,
      },
      {
        accessorKey: 'userName',
        header: 'Name',
        enableEditing: false,
        size: 50,
      },
      {
        accessorKey: 'userEmail',
        header: 'email',
        enableEditing: false,
        size: 50,
      },
      {
        accessorFn: (row) => row.createdDate.toDate(),
        header: 'Order Date',
        sortingFn: 'datetime',
        filterVariant: 'date',
        enableEditing: false,
        size: 100,
        filterFn: (row, id, filterValue) => handleDateFilter(row.original.createdDate, id, filterValue),
        Cell: ({ cell }) => cell.getValue()?.toLocaleDateString(), //render Date as a string
      },
      {
        accessorFn: (row) => row.pickUpDate.toDate(),
        header: 'Pick Up Date',
        sortingFn: 'datetime',
        filterVariant: 'date',
        enableEditing: false,
        size: 100,
        filterFn: (row, id, filterValue) => handleDateFilter(row.original.pickUpDate, id, filterValue),
        Cell: ({ cell }) => cell.getValue()?.toLocaleDateString(), //render Date as a string
      },
      {
        accessorKey: 'status',
        header: 'Status',
        editVariant: 'select',
        editSelectOptions: MANAGEABLE_ORDER_STATUSES,
        muiEditTextFieldProps: ({ row }) => ({
          select: true,
          onChange: (event) =>
            setEditedOrders({
              ...editedOrders,
              [row.id]: { ...row.original, status: event.target.value },
            }),
        }),
      },
    ],
    [editedOrders],
  );

  //UPDATE action
  const handleSaveOrders = async () => {
    setIsUpdating(true)
    updateOrder(editedOrders).then(() => {
      setIsUpdating(false)
    }).catch(error => {
      setIsUpdating(false)
      console.log(error)
    })
    setEditedOrders({});
  };

  const table = useMaterialReactTable({
    columns,
    data: orders,
    createDisplayMode: 'row', // ('modal', and 'custom' are also available)
    editDisplayMode: 'cell', // ('modal', 'row', 'table', and 'custom' are also available)
    enableCellActions: true,
    enableClickToCopy: 'context-menu',
    enableColumnPinning: true,
    enableEditing: true,
    isMultiSortEvent: () => true,
    getRowId: (row) => row.documentId,
    muiDetailPanelProps: () => ({
      sx: (theme) => ({
        backgroundColor:
          theme.palette.mode === 'dark'
            ? 'rgba(255,210,244,0.1)'
            : 'rgba(0,0,0,0.1)',
      }),
    }),
    //custom expand button rotation
    muiExpandButtonProps: ({ row, table }) => ({
      sx: {
        transform: row.getIsExpanded() ? 'rotate(180deg)' : 'rotate(-90deg)',
        transition: 'transform 0.2s',
      },
    }),
    //conditionally render detail panel
    renderDetailPanel: ({ row }) => {
      const products = row.original.product
      return products ? Object.keys(products).map((name) =>
        <Box key={name}>
          <Typography >Product: {name}</Typography>
          <Box sx={{ display: 'grid', margin: 'auto', gridTemplateColumns: '1fr 1fr', width: '100%', }}>
            {Object.keys(products[name]).map((key) => {
              if (isNumber(key) && Number(products[name][key] !== 0)) {
                return <Typography key={key}>Box in {key}: {products[name][key]}</Typography>
              } else if (key === 'flavors') {
                const falvors = Object.keys(products[name][key])
                if (falvors.length !== 0) {
                  return falvors.map((flavor) =>
                    <Typography key={flavor}>{flavor}: {products[name][key][flavor]}</Typography>
                  )
                }
              }
              return null
            })}
          </Box>
        </Box>
      ) : null
    },

    renderBottomToolbarCustomActions: () => (
      <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Button
          color="success"
          variant="contained"
          onClick={handleSaveOrders}
          disabled={
            Object.keys(editedOrders).length === 0
            // || Object.values(validationErrors).some((error) => !!error)
          }
        >
          {isUpdating ? <CircularProgress size={25} /> : 'Save'}
        </Button>
        {/* {Object.values(validationErrors).some((error) => !!error) && (
          <Typography color="error">Fix errors before submitting</Typography>
        )} */}
      </Box>
    ),
    muiToolbarAlertBannerProps: isLoadingOrderError
      ? {
        color: 'error',
        children: 'Error loading data',
      }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    initialState: {
      columnPinning: {
        right: ['mrt-row-actions'],
      },
    },
    state: {
      isLoading: isLoadingOrder,
      // isSaving:  isUpdatingUsers || isDeletingUser,
      showAlertBanner: isLoadingOrderError,
      showProgressBars: isLoadingOrder,
    },
  });

  return <MaterialReactTable table={table} />;
};
