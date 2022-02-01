import React, { useContext } from 'react';
//import { useRouter } from 'next/router';
//import data from '../../utils/data';
import Layout from '../../components/Layout';
import NextLink from 'next/link';
import {
  Grid,
  Link,
  List,
  ListItem,
  Typography,
  Card,
  Button,
} from '@material-ui/core';
import useStyles from '../../utils/style';
import Image from 'next/image';
import db from '../../utils/db';
import Product from '../../models/Product';
import axios from 'axios';
import { Store } from '../../utils/Store';
import { useRouter } from 'next/router';

export default function ProductScreen(props) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { product } = props;
  const classes = useStyles();
  //const router = useRouter();
  //const { slug } = router.query;
  //const product = data.products.find((a) => a.slug === slug);
  if (!product) {
    return <div>محصول مورد نظر پیدا نشد </div>;
  }
  const addToCartHandler = async () => {
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
    <Layout title={product.name} description={product.description}>
      <div className={classes.section}>
        <NextLink href="/" passHref>
          <Link>
            <Typography>بازگشت به محصولات</Typography>
          </Link>
        </NextLink>
      </div>
      <Grid container spacing={1}>
        <Grid item md={6} xs={12}>
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
          ></Image>
        </Grid>
        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Typography component="h1" variant="h1">
                {product.name}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>دسته بندی : {product.category}</Typography>
            </ListItem>
            <ListItem>
              <Typography>برند : {product.brand}</Typography>
            </ListItem>
            <ListItem>
              <Typography>
                امتیاز : {product.rating} ستاره ({product.numReviews} بازدید)
              </Typography>
            </ListItem>
            <ListItem>
              توضیحات :<Typography>{product.description}</Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <ListItem className={classes.state}>
                <Grid container>
                  <Grid item xs={1}>
                    <Typography>قیمت</Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Typography>{product.price} تومن</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem className={classes.state}>
                <Grid container>
                  <Grid item xs={1}>
                    <Typography>وضعیت</Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Typography>
                      {product.countInStock > 0 ? 'موجود' : 'ناموجود'}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={addToCartHandler}
                >
                  افزودن به سبد خرید
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: db.convertDocToObj(product),
    },
  };
}
