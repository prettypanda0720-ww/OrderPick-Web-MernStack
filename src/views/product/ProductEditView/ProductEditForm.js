import React, { useState, useEffect } from 'react';
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
  InputLabel
} from '@material-ui/core';

import {
  Image as ImageIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowRight as ArrowRightIcon,
  Search as SearchIcon,
  Download as DownloadIcon
} from 'react-feather';

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

const useStyles = makeStyles(() => ({
  root: {},
  editor: {
    '& .ql-editor': {
      height: 400
    }
  },
  app: {
    height: 400
  },
  name: {
    marginBottom: 10
  },
  name_su: {
    marginBottom: 10,
    marginTop: 30
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
  image: {
    width: 220,
    height: 220
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

const ProductEditForm = ({ className, product, ...rest }) => {

  const classes = useStyles();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [base64, setBase64] = useState('');

  useEffect(() => {
    setBase64(product.image);
  }, [product]);
  
  const handleChangedImage = event => {
    let file = event.currentTarget.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setBase64(reader.result);
    };
  };

  return (
    <Formik
      initialValues={product}
      enableReinitialize={true}
      validationSchema={Yup.object().shape({
        description: Yup.string().max(5000),
        name: Yup.string()
          .max(255)
          .required(),
        price: Yup.number()
          .min(0)
          .required(),
        name_su: Yup.string()
          .max(255)
          .required(),
        image: Yup.string()
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        values.image = base64;
        console.log('product update', values);
        try {
          // NOTE: Make API request
          axios
            .put('http://localhost:4000/api/product/' + values._id, values)
            .then(result => {
              console.log('product update success!');
              setStatus({ success: true });
              setSubmitting(false);
              enqueueSnackbar('Product Updated', {
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
                  <InputLabel className={classes.name}>Product Name</InputLabel>
                  <TextField
                    error={Boolean(touched.name && errors.name)}
                    fullWidth
                    helperText={touched.name && errors.name}
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    variant="outlined"
                  />
                  <InputLabel className={classes.name_su}>
                    Product Name (Saudi Arabia)
                  </InputLabel>
                  <TextField
                    error={Boolean(touched.name_su && errors.name_su)}
                    fullWidth
                    helperText={touched.name_su && errors.name_su}
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
                  <CardHeader title="Price" />
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
                    onChange={handleChange}
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
              Save product
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

// ProductEditForm.propTypes = {
//   className: PropTypes.string,
//   product: PropTypes.object.isRequired
// };

// ProductEditForm.defaultProps = {
//   className: '',
//   product: {}
// };

export default ProductEditForm;
