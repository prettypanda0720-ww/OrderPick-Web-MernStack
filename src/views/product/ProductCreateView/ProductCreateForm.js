import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  FormHelperText,
  Grid,
  Paper,
  TextField,
  Typography,
  makeStyles,
  SvgIcon
} from '@material-ui/core';

import {
  Image as ImageIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowRight as ArrowRightIcon,
  Search as SearchIcon,
  Download as DownloadIcon
} from 'react-feather';
import { SelectionState } from 'draft-js';

const categories = [
  {
    id: 'hot_drinks',
    name: 'HOT DRINKS',
    name_su: 'مشـروبات ساخنة'
  },
  {
    id: 'cold_drinks',
    name: 'COLD DRINKS',
    name_su: 'مشـروبات باردة'
  },
  {
    id: 'crepe',
    name: 'CREPE',
    name_su: 'كريب'
  },
  {
    id: 'waffle',
    name: 'WAFFLE',
    name_su: 'وافل'
  },
  {
    id: 'desserts',
    name: 'DESSERTS',
    name_su: 'حلويات'
  }
];

const useStyles = makeStyles(theme => ({
  root: {},
  editor: {
    '& .ql-editor': {
      height: 400
    }
  },
  app: {
    height: 400
  },
  name_su: {
    marginTop: 20,
    marginBottom: 10
  },
  image: {
    width: 220,
    height: 220
  },
  avatarUpload: {
    position: 'relative',
    marginTop: 20,
    maxWidth: 205
  },
  avatarEdit: {
    position: 'absolute',
    zIndex: 1,
    top: -15,
    right: -5
  },
  avatarPreview: {
    width: 192,
    height: 192,
    position: 'relative',
    borderRadius: 10,
    border: '6 solid #F8F8F8',
    boxShadow: '0 2 4 0 rgba(0, 0, 0, 0.1)',
    backgroundColor: '#d3d3d3'
  },
  label: {
    display: 'inline-block',
    width: 34,
    height: 34,
    marginBottom: 0,
    borderRadius: '100%',
    background: 'gray',
    border: '1 solid transparent',
    boxShadow: '0 2 4 0 rgba(0, 0, 0, 0.12)',
    cursor: 'pointer',
    fontWeight: 'normal',
    transition: 'all .2s ease-in-out',
    textAlign: 'center',
    paddingTop: 3,
    '&:hover': {
      background: '#f1f1f1',
      borderColor: '#d6d6d6'
    },
    '&:after': {
      content: '\f040',
      fontFamily: 'FontAwesome',
      color: '#757575',
      position: 'absolute',
      top: -10,
      left: 0,
      right: -10,
      textAlign: 'center',
      margin: 'auto'
    }
  }
}));

const ProductCreateForm = ({ className, ...rest }) => {
  const classes = useStyles();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  /* */
  const [status, setStatus] = useState('Drop Here');
  const [percentage, setPercentage] = useState(0);
  // const [preview, setPreview] = useState('/static/public/upload.svg');
  const [selCategory, setSelCategory] = useState(categories[0].name);
  const [base64, setBase64] = useState('');

  const handleChangeTest = event => {
    event.preventDefault();
    console.log('selected index', event.target.value);
    var index = categories.findIndex(node => node.id === event.target.value);
    console.log('selected index', index);
    setSelCategory(categories[index].name);
    console.log('changed category', selCategory);
  };

  const handleChangedImage = event => {
    let file = event.currentTarget.files[0];
    console.log('inputed file', file);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setBase64(reader.result);
    };
  };

  return (
    <Formik
      initialValues={{
        // category: '',
        description: '',
        // includesTaxes: false,
        // isTaxable: false,
        image: '',
        name: '',
        name_su: '',
        price: '',
        category: selCategory,
        // productCode: '',
        // productSku: '',
        // salePrice: '',
        image: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        // category: Yup.string().max(255),
        description: Yup.string().max(5000),
        // includesTaxes: Yup.bool().required(),
        // isTaxable: Yup.bool().required(),
        name: Yup.string()
          .max(255)
          .required(),
        name_su: Yup.string()
          .max(255)
          .required(),
        price: Yup.number()
          .min(0)
          .required(),
        image: Yup.string()
        // productCode: Yup.string().max(255),
        // productSku: Yup.string().max(255),
        // salePrice: Yup.number().min(0)
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        values.image = base64;
        try {
          // NOTE: Make API request
          axios
            .post('http://localhost:4000/api/product', values)
            .then(result => {
              console.log('product create success!');
              setStatus({ success: true });
              setSubmitting(false);
              enqueueSnackbar('Product Created', {
                variant: 'success'
              });
              history.push('/');
            });
        } catch (err) {
          console.error(err);
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        touched,
        values
      }) => (
        <form
          onSubmit={handleSubmit}
          className={clsx(classes.root, className)}
          {...rest}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Card>
                <CardContent>
                  <TextField
                    error={Boolean(touched.name && errors.name)}
                    fullWidth
                    helperText={touched.name && errors.name}
                    label="Product Name"
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    variant="outlined"
                  />
                  <Box mt={3} mb={1}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Product Name (Saudi Arabia)
                    </Typography>
                  </Box>
                  <TextField
                    error={Boolean(touched.name_su && errors.name_su)}
                    fullWidth
                    helperText={touched.name_su && errors.name_su}
                    label="Product Name (Saudi Arabia)"
                    name="name_su"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name_su}
                    variant="outlined"
                  />
                  <Box mt={3} mb={1}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Description
                    </Typography>
                  </Box>
                  <TextField
                    error={Boolean(touched.description && errors.description)}
                    fullWidth
                    helperText={touched.description && errors.description}
                    label="Description"
                    name="description"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.description}
                    variant="outlined"
                  />
                  {touched.description && errors.description && (
                    <Box mt={2}>
                      <FormHelperText error>
                        {errors.description}
                      </FormHelperText>
                    </Box>
                  )}
                </CardContent>
              </Card>
              <Box mt={3}>
                <Card>
                  <CardHeader title="Upload Images" />
                  <Divider />
                  <CardContent>
                    {/* <FilesDropzone /> */}
                    {/* <div className="input-group mb-3">
                      <div className="custom-file">
                        <img
                          alt="Select file"
                          className={classes.image}
                          src="/static/images/undraw_add_file2_gvbb.svg"
                          htmlFor="file"
                        >
                          <input
                            id="file"
                            name="productfile"
                            type="file"
                            onChange={handleChangedImage}
                            hidden
                          />
                        </img>
                      </div>
                    </div> */}
                    <div className={classes.avatarUpload}>
                      <div className={classes.avatarEdit}>
                        <input
                          type="file"
                          id="imageUpload"
                          onChange={handleChangedImage}
                          style={{ display: 'none' }}
                        />
                        <label htmlFor="imageUpload" className={classes.label}>
                          <EditIcon />
                        </label>
                      </div>
                      {base64 ? (
                        <img className={classes.avatarPreview} src={base64} />
                      ) : (
                        <ImageIcon className={classes.image}/>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Box>
              <Box mt={3}>
                <Card>
                  <CardHeader title="Prices" />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={12}>
                        <TextField
                          error={Boolean(touched.price && errors.price)}
                          fullWidth
                          // helperText={touched.price && errors.price
                          //   ? errors.price
                          //   : 'If you have a sale price this will be shown as old price'}
                          label="Price"
                          name="price"
                          type="number"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.price}
                          variant="outlined"
                        />
                      </Grid>
                      {/* <Grid item xs={12} md={6}>
                        <TextField
                          error={Boolean(touched.salePrice && errors.salePrice)}
                          fullWidth
                          helperText={touched.salePrice && errors.salePrice}
                          label="Sale price"
                          name="salePrice"
                          type="number"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.salePrice}
                          variant="outlined"
                        />
                      </Grid> */}
                    </Grid>
                    {/* <Box mt={2}>
                      <FormControlLabel
                        control={(
                          <Checkbox
                            checked={values.isTaxable}
                            onChange={handleChange}
                            value={values.isTaxable}
                            name="isTaxable"
                          />
                        )}
                        label="Product is taxable"
                      />
                    </Box> */}
                    {/* <Box mt={2}>
                      <FormControlLabel
                        control={(
                          <Checkbox
                            checked={values.includesTaxes}
                            onChange={handleChange}
                            value={values.includesTaxes}
                            name="includesTaxes"
                          />
                        )}
                        label="Price includes taxes"
                      />
                    </Box> */}
                  </CardContent>
                </Card>
              </Box>
            </Grid>
            {/* <Grid item xs={12} lg={4}>
              <Card>
                <CardHeader title="Product Category" />
                <Divider />
                <CardContent>
                  <TextField
                    fullWidth
                    label="Category"
                    name="category"
                    onChange={handleChangeTest}
                    select
                    SelectProps={{ native: true }}
                    value={values.category}
                    variant="outlined"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </TextField>
                </CardContent>
              </Card>
            </Grid> */}
          </Grid>
          {errors.submit && (
            <Box mt={3}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}
          <Box mt={2}>
            <Button
              color="secondary"
              variant="contained"
              type="submit"
              disabled={isSubmitting}
            >
              Create product
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

ProductCreateForm.propTypes = {
  className: PropTypes.string
};

export default ProductCreateForm;
