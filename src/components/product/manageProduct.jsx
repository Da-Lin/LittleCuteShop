import { useEffect, useMemo, useState } from 'react';
import {
    MRT_EditActionButtons,
    MaterialReactTable,
    // createRow,
    useMaterialReactTable,
} from 'material-react-table';
import {
    Accordion,
    AccordionActions,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Tooltip,
} from '@mui/material';

import { fakeData } from './makeData';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import { addProductCategories, deleteProductCategories, getProductCategories, productCategoryExist } from '../../firebase/firestore/product';

const Example = () => {
    const [validationErrors, setValidationErrors] = useState({});
    const [categoryText, setCategoryText] = useState('');
    const [manageCategoryIsLoading, setManageCategoryIsLoading] = useState(false);
    const [manageCategoryMessage, setManageCategoryMessage] = useState('');
    const [manageCategoryErrorMessage, setManageCategoryErrorMessage] = useState('');
    const [removeCategoryOpen, setRemoveCategorOpen] = useState(false);
    const [categories, setCategories] = useState([])

    useEffect(() => {
        async function getAndSetCategories() {
            setCategories(await getProductCategories())
        }
        getAndSetCategories()
    }, [manageCategoryMessage, manageCategoryErrorMessage])

    const handleRemoveCategoryOpen = () => {
        setRemoveCategorOpen(true)
    }

    const handleRemoveCategoryClose = () => {
        setRemoveCategorOpen(false)
    }

    const handleRemoveCategory = async () => {
        setManageCategoryIsLoading(true)
        setManageCategoryMessage('')
        setManageCategoryErrorMessage('')
        if (!await productCategoryExist(categoryText)) {
            setManageCategoryIsLoading(false)
            setManageCategoryErrorMessage(`Product category: ${categoryText} does not exist`)
            setManageCategoryMessage('')
        } else {
            deleteProductCategories(categoryText).then(() => {
                setManageCategoryIsLoading(false)
                setManageCategoryErrorMessage('')
                setManageCategoryMessage(`Successfully removed product category: ${categoryText}`)
            }).catch((error) => {
                setManageCategoryIsLoading(false)
                setManageCategoryErrorMessage(`Failed to remove product category: ${categoryText}`)
                setManageCategoryMessage('')
            })
        }
        setRemoveCategorOpen(false)
    }

    const resetMessage = () => {
        setValidationErrors({})
        setRemoveCategorOpen(false)
        setCategoryText('')
        setManageCategoryIsLoading(false)
        setManageCategoryMessage('')
        setManageCategoryErrorMessage('')
    }

    const handleCategorySelectChange = (e) => {
        setCategoryText(e.target.value)
        setManageCategoryMessage('')
        setManageCategoryErrorMessage('')
    }

    const handleAddProductCategory = async (e) => {
        setManageCategoryIsLoading(true)
        setManageCategoryMessage('')
        setManageCategoryErrorMessage('')
        if (await productCategoryExist(categoryText)) {
            setManageCategoryIsLoading(false)
            setManageCategoryErrorMessage('Product categorya already exists')
            setManageCategoryMessage('')
        } else {
            addProductCategories(categoryText).then(() => {
                setManageCategoryIsLoading(false)
                setManageCategoryErrorMessage('')
                setManageCategoryMessage(`Successfully added product category: ${categoryText}`)
            }).catch((error) => {
                setManageCategoryIsLoading(false)
                setManageCategoryErrorMessage(`Failed to add product category: ${categoryText}`)
                setManageCategoryMessage('')
            })
        }
    }

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.name,
                    helperText: validationErrors?.name,
                    //remove any previous validation errors when user focuses on the input
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            name: undefined,
                        }),
                    //optionally add validation checking for onBlur or onChange
                },
            },
            {
                accessorKey: 'description',
                header: 'Description',
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.category,
                    helperText: validationErrors?.category,
                    //remove any previous validation errors when user focuses on the input
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            category: undefined,
                        }),
                },
            },
            {
                accessorKey: 'category',
                header: 'Category',
                editVariant: 'select',
                editSelectOptions: categories,
                muiEditTextFieldProps: {
                    required: true,
                    select: true,
                    error: !!validationErrors?.state,
                    helperText: validationErrors?.state,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            category: undefined,
                        }),
                },
            },
        ],
        [validationErrors],
    );

    //call CREATE hook
    const { mutateAsync: createUser, isPending: isCreatingUser } =
        useCreateProduct();
    //call READ hook
    const {
        data: fetchedProducts = [],
        isError: isLoadingUsersError,
        isFetching: isFetchingUsers,
        isLoading: isLoadingUsers,
    } = useGetUsers();
    //call UPDATE hook
    const { mutateAsync: updateUser, isPending: isUpdatingUser } =
        useUpdateUser();
    //call DELETE hook
    const { mutateAsync: deleteUser, isPending: isDeletingUser } =
        useDeleteUser();

    //CREATE action
    const handleCreateProduct = async ({ values, table }) => {
        const newValidationErrors = validateUser(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});
        await createUser(values);
        table.setCreatingRow(null); //exit creating mode
    };

    //UPDATE action
    const handleSaveUser = async ({ values, table }) => {
        const newValidationErrors = validateUser(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});
        await updateUser(values);
        table.setEditingRow(null); //exit editing mode
    };

    //DELETE action
    const openDeleteConfirmModal = (row) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            deleteUser(row.original.id);
        }
    };

    const table = useMaterialReactTable({
        columns,
        data: fetchedProducts,
        createDisplayMode: 'modal', //default ('row', and 'custom' are also available)
        editDisplayMode: 'modal', //default ('row', 'cell', 'table', and 'custom' are also available)
        enableEditing: true,
        getRowId: (row) => row.id,
        muiToolbarAlertBannerProps: isLoadingUsersError
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
        onCreatingRowCancel: resetMessage,
        onCreatingRowSave: handleCreateProduct,
        onEditingRowCancel: resetMessage,
        onEditingRowSave: handleSaveUser,
        //optionally customize modal content
        renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
            <>
                <DialogTitle>Create New Product</DialogTitle>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    {internalEditComponents} {/* or render custom edit components here */}
                </DialogContent>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="manage-category"
                        id="managecategory"
                    >
                        Manage Category
                    </AccordionSummary>
                    <AccordionDetails>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="category"
                            label="Category"
                            id="category"
                            onChange={handleCategorySelectChange}
                        />
                    </AccordionDetails>
                    <AccordionActions>
                        <Button onClick={handleAddProductCategory} disabled={categoryText === ''}>Add</Button>
                        <Button onClick={handleRemoveCategoryOpen} disabled={categoryText === ''}>Remove</Button>
                        <Dialog
                            open={removeCategoryOpen}
                            onClose={handleRemoveCategoryClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                                {"Remove Product Category"}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    {`Are your sure you want to remove product category: ${categoryText}?`}
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleRemoveCategoryClose}>Cancel</Button>
                                <Button onClick={handleRemoveCategory} autoFocus>
                                    Yes
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </AccordionActions>
                    {manageCategoryIsLoading && <CircularProgress />}
                    {manageCategoryMessage && <Alert >{manageCategoryMessage}</Alert>}
                    {manageCategoryErrorMessage && <Alert severity="error">{manageCategoryErrorMessage}</Alert>}
                </Accordion>
                <DialogActions>
                    <MRT_EditActionButtons variant="text" table={table} row={row} />
                </DialogActions>
            </>
        ),
        //optionally customize modal content
        renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
            <>
                <DialogTitle variant="h3">Edit User</DialogTitle>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                >
                    {internalEditComponents} {/* or render custom edit components here */}
                </DialogContent>
                <DialogActions>
                    <MRT_EditActionButtons variant="text" table={table} row={row} />
                </DialogActions>
            </>
        ),
        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
                <Tooltip title="Edit">
                    <IconButton onClick={() => table.setEditingRow(row)}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        ),
        renderTopToolbarCustomActions: ({ table }) => (
            <Button
                variant="contained"
                onClick={() => {
                    table.setCreatingRow(true); //simplest way to open the create row modal with no default values
                    //or you can pass in a row object to set default values with the `createRow` helper function
                    // table.setCreatingRow(
                    //   createRow(table, {
                    //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
                    //   }),
                    // );
                }}
            >
                Create New Product
            </Button>
        ),
        state: {
            isLoading: isLoadingUsers,
            isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
            showAlertBanner: isLoadingUsersError,
            showProgressBars: isFetchingUsers,
        },
    });

    return <MaterialReactTable table={table} />;
};

//CREATE hook (post new user to api)
function useCreateProduct() {
    return { data: fakeData };
}

//READ hook (get users from api)
function useGetUsers() {
    return { data: fakeData };
}

//UPDATE hook (put user in api)
function useUpdateUser() {
    return Promise.resolve(fakeData);
}

//DELETE hook (delete user in api)
function useDeleteUser() {
    return Promise.resolve(fakeData);
}


const ExampleWithProviders = () => (
    //Put this with your other react-query providers near root of your app
    <Example />
);

export default ExampleWithProviders;

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
    !!email.length &&
    email
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );

function validateUser(user) {
    return {
        firstName: !validateRequired(user.firstName)
            ? 'First Name is Required'
            : '',
        lastName: !validateRequired(user.lastName) ? 'Last Name is Required' : '',
        email: !validateEmail(user.email) ? 'Incorrect Email Format' : '',
    };
}
