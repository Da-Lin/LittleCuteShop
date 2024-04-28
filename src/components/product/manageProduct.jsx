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
    IconButton,
    TextField,
    Tooltip,
} from '@mui/material';
import { MRT_Localization_ZH_HANS } from 'material-react-table/locales/zh-Hans';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import { addProduct, addProductCategories, deleteProduct, deleteProductCategories, getProductCategories, getProducts, productCategoryExist, productNameExist, productNameExistForUpdate, updateProduct } from '../../firebase/firestore/product';
import ImageUpload from './imageUpload';
import ProdictImageList from './imageList';
import ManageProductImage from './manageProductImage';
import { useAuth } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';

const Example = () => {
    const { isAdminUser } = useAuth()

    const [validationErrors, setValidationErrors] = useState({});
    const [categoryText, setCategoryText] = useState('');
    const [manageCategoryIsLoading, setManageCategoryIsLoading] = useState(false);
    const [manageCategoryMessage, setManageCategoryMessage] = useState('');
    const [manageCategoryErrorMessage, setManageCategoryErrorMessage] = useState('');
    const [removeCategoryOpen, setRemoveCategorOpen] = useState(false);
    const [categories, setCategories] = useState([])
    const [products, setProducts] = useState([])
    const [isCreatingProduct, setIsCreatingProduct] = useState(false)

    const [isUpdatingProduct, setIsUpdatingProduct] = useState(false)
    const [isDeletingProduct, setIsDeletingProduct] = useState(false)
    const [isLoadingProducts, setIsLoadingProducts] = useState(false)
    const [isLoadingProductsError, setIsLoadingProductsError] = useState(false)

    const [imgList, setImgList] = useState([])
    const [existingImgNames, setExistingImgNames] = useState([])

    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate()

    useEffect(() => {
        if (!isAdminUser) {
            navigate('/home')
        }

        setErrorMessage('')
        setImgList([])

        async function getAndSetCategories() {
            setCategories(await getProductCategories())
        }
        getAndSetCategories()

        async function getAndSetProducts() {
            setIsLoadingProductsError(false)
            setIsLoadingProducts(true)
            await getProducts().then((ps) => {
                setIsLoadingProducts(false)
                setProducts(ps)
            }).catch((error) => {
                setIsLoadingProducts(false)
                setIsLoadingProductsError(true)
                console.log(error)
            })
        }
        getAndSetProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [manageCategoryMessage, manageCategoryErrorMessage, isCreatingProduct, isUpdatingProduct, isDeletingProduct])

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
            setManageCategoryErrorMessage(`产品分类: ${categoryText}不存在`)
            setManageCategoryMessage('')
        } else {
            deleteProductCategories(categoryText).then(() => {
                setManageCategoryIsLoading(false)
                setManageCategoryErrorMessage('')
                setManageCategoryMessage(`成功删除产品分类: ${categoryText}`)
            }).catch((error) => {
                setManageCategoryIsLoading(false)
                setManageCategoryErrorMessage(`删除产品分类: ${categoryText}失败了`)
                setManageCategoryMessage('')
            })
        }
        setRemoveCategorOpen(false)
    }

    const resetState = () => {
        setErrorMessage('')
        setImgList([])
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
            setManageCategoryErrorMessage('该产品分类已经存在')
            setManageCategoryMessage('')
        } else {
            addProductCategories(categoryText).then(() => {
                setManageCategoryIsLoading(false)
                setManageCategoryErrorMessage('')
                setManageCategoryMessage(`成功添加产品分类: ${categoryText}`)
            }).catch((error) => {
                setManageCategoryIsLoading(false)
                setManageCategoryErrorMessage(`产品分类: ${categoryText}添加失败`)
                setManageCategoryMessage('')
            })
        }
    }

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: '名称',
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
                }
            },
            {
                accessorKey: 'description',
                header: '描述',
                muiEditTextFieldProps: {
                    multiline: true,
                    required: true,
                    error: !!validationErrors?.description,
                    helperText: validationErrors?.description,
                    //remove any previous validation errors when user focuses on the input
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            description: undefined,
                        }),
                },
            },
            {
                accessorKey: 'price',
                header: '价格',
                muiEditTextFieldProps: {
                    type: 'number',
                    required: true,
                    error: !!validationErrors?.price,
                    helperText: validationErrors?.price,
                    //remove any previous validation errors when user focuses on the input
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            price: undefined,
                        }),
                },
                Cell: ({ cell, column }) => (
                    <>
                        {`$${parseFloat(cell.getValue()).toLocaleString('USD')}`}
                    </>
                ),
            },
            {
                accessorKey: 'category',
                header: '分类',
                editVariant: 'select',
                editSelectOptions: categories,
                muiEditTextFieldProps: {
                    required: true,
                    select: true,
                    error: !!validationErrors?.category,
                    helperText: validationErrors?.category,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            category: undefined,
                        }),
                },
            }
        ],
        [categories, validationErrors],
    );

    //CREATE action
    const handleCreateProduct = async ({ values, table }) => {
        const newValidationErrors = validateProduct(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setIsCreatingProduct(true)

        if (await productNameExist(values)) {
            setValidationErrors({ name: "该产品名称已经存在" })
            setIsCreatingProduct(false)
            return;
        }

        setValidationErrors({});
        values = { ...values, imgList: imgList }
        await addProduct(values).catch((error) => {
            console.log(error)
            setErrorMessage('添加产品失败')
        });
        setIsCreatingProduct(false)
        table.setCreatingRow(null); //exit creating mode
    };

    //UPDATE action
    const handleSaveProduct = async ({ values, table, row }) => {
        values["id"] = row.original.id

        const newValidationErrors = validateProduct(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }

        setIsUpdatingProduct(true)
        if (await productNameExistForUpdate(values)) {
            setValidationErrors({ name: "新产品名称已经存在" })
            setIsUpdatingProduct(false)
            return;
        }

        setValidationErrors({});
        values = { ...values, imgList: imgList, imgPaths: row.original.imgPaths, imgUrls: row.original.imgUrls, imgNamesToDelete: row.original.imgNamesToDelete }
        await updateProduct(values).catch((error) => {
            console.log(error)
            setErrorMessage('更新产品失败')
        })
        setIsUpdatingProduct(false)
        table.setEditingRow(null); //exit editing mode
    };

    //DELETE action
    const openDeleteConfirmModal = async (row) => {
        if (window.confirm(`确定删除产品:${row.original.name}?`)) {
            setIsDeletingProduct(true)
            await deleteProduct(row.original).catch((error) => {
                console.log(error)
                setErrorMessage('删除产品失败')
            })
            setIsDeletingProduct(false)
        }
    };
    const table = useMaterialReactTable({
        columns,
        data: products,
        createDisplayMode: 'modal', //default ('row', and 'custom' are also available)
        editDisplayMode: 'modal', //default ('row', 'cell', 'table', and 'custom' are also available)
        enableEditing: true,
        getRowId: (row) => row.id,
        muiToolbarAlertBannerProps: isLoadingProductsError
            ? {
                color: 'error',
                children: '读取产品失败',
            }
            : undefined,
        muiTableContainerProps: {
            sx: {
                minHeight: '500px',
            },
        },
        localization: MRT_Localization_ZH_HANS,
        onCreatingRowCancel: resetState,
        onCreatingRowSave: handleCreateProduct,
        onEditingRowCancel: resetState,
        onEditingRowSave: handleSaveProduct,
        //optionally customize modal content
        renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
            <>
                <DialogTitle>添加产品</DialogTitle>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    {internalEditComponents} {/* or render custom edit components here */}
                </DialogContent>
                <ImageUpload imgList={imgList} setImgList={setImgList} />
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="manage-category"
                        id="managecategory"
                    >
                        管理所有产品分类
                    </AccordionSummary>
                    <AccordionDetails>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="category"
                            label="分类"
                            id="category"
                            onChange={handleCategorySelectChange}
                        />
                    </AccordionDetails>
                    <AccordionActions>
                        <Button onClick={handleAddProductCategory} disabled={categoryText === ''}>添加</Button>
                        <Button onClick={handleRemoveCategoryOpen} disabled={categoryText === ''}>删除</Button>
                        <Dialog
                            open={removeCategoryOpen}
                            onClose={handleRemoveCategoryClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                                {"删除产品分类"}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    {`确定删除产品分类: ${categoryText}?`}
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleRemoveCategoryClose}>取消</Button>
                                <Button onClick={handleRemoveCategory} autoFocus>
                                    确认
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
                <DialogTitle >编辑产品</DialogTitle>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                >
                    {internalEditComponents} {/* or render custom edit components here */}
                </DialogContent>
                <ManageProductImage rowData={row.original} imgList={imgList} setImgList={setImgList} existingImgNames={existingImgNames} setExistingImgNames={setExistingImgNames} />
                <DialogActions>
                    <MRT_EditActionButtons variant="text" table={table} row={row} />
                </DialogActions>
            </>
        ),
        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
                <Tooltip title="编辑">
                    <IconButton onClick={() => table.setEditingRow(row)}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="删除">
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
                添加产品或管理分类
            </Button>
        ),
        enableExpandAll: false, //disable expand all button
        // muiDetailPanelProps: () => ({
        //     sx: (theme) => ({
        //         backgroundColor:
        //             theme.palette.mode === 'dark'
        //                 ? 'rgba(255,210,244,0.1)'
        //                 : 'white',
        //     }),
        // }),
        //custom expand button rotation
        muiExpandButtonProps: ({ row, table }) => ({
            onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }), //only 1 detail panel open at a time
            sx: {
                transform: row.getIsExpanded() ? 'rotate(180deg)' : 'rotate(-90deg)',
                transition: 'transform 0.2s',
            },
        }),
        //conditionally render detail panel
        renderDetailPanel: ({ row }) =>
            row.original.imgPaths ? <ProdictImageList rowData={row.original} /> : null,
        state: {
            isLoading: isLoadingProducts,
            isSaving: isCreatingProduct || isUpdatingProduct || isDeletingProduct,
            showAlertBanner: isLoadingProductsError,
            showProgressBars: isLoadingProducts,
        },
    });

    return (
        <>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            <MaterialReactTable table={table} />
        </>
    );
};

const ExampleWithProviders = () => (
    <>

        <Example />
    </>
);

export default ExampleWithProviders;

const validateRequired = (value) => !!value.length;

function validateProduct(product) {
    return {
        name: !validateRequired(product.name)
            ? '请输入产品名称'
            : '',
        description: !validateRequired(product.description)
            ? '请输入产品描述'
            : '',
        price: !validateRequired(product.price)
            ? '请输入产品价格'
            : '',
        category: !validateRequired(product.category)
            ? '请输入产品分类'
            : ''
    };
}
