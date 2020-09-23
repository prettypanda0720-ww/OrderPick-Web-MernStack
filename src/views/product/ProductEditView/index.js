import React, {
  useState,
  useEffect,
  useCallback
} from 'react';
import { Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import ProductEditForm from './ProductEditForm';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import axios from 'axios';
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: 100
  }
}));

const ProductEditView = (props) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [product, setProduct] = useState({});
  const product_id = props.match.params[0];

  const getProduct = useCallback(async () => {
    try {
      axios.get('http://localhost:4000/api/product/' + product_id)
      .then(res => {
        if (isMountedRef.current) {
          console.log('res.data', res.data);
          setProduct(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getProduct();
  }, [getProduct]);

  console.log('index.js', product.image);
  
  return (
    <Page
      className={classes.root}
      title="Product Create"
    >
      <Container maxWidth="lg">
        <Header />
        <ProductEditForm product = {product} />
      </Container>
    </Page>
  );
};

export default ProductEditView;
