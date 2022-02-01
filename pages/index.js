import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@material-ui/core';
import Layout from '../components/Layout';
//import data from '../utils/data';
import useStyles from '../utils/style';
import NextLink from 'next/link';
import db from '../utils/db';
import Product from '../models/Product';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';

//import dynamic from 'next/dynamic';

export default function Home(props) {
  const { products } = props;
  const classes = useStyles();
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      window.alert('متاسفم ، مقدار مورد نظر بیشتر از موجودی ما است');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    router.push('/cart');
  };
  return (
    <Layout>
      <h1>محصولات</h1>
      <Grid container spacing={5}>
        {products.map((product) => (
          <Grid item md={3} key={product.name}>
            <Card>
              <NextLink href={`/product/${product.slug}`} passHref>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    image={product.image}
                    title={product.name}
                  ></CardMedia>
                  <CardContent>
                    <Typography>{product.name}</Typography>
                  </CardContent>
                </CardActionArea>
              </NextLink>
              <CardActions className={classes.card}>
                <Typography>{product.price} تومن</Typography>
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  onClick={() => addToCartHandler(product)}
                >
                  خرید
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find({}).lean();
  await db.disconnect();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}

//export default dynamic(() => Promise.resolve(Home), { ssr: false });
