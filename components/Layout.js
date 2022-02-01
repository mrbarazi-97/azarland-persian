import {
  AppBar,
  Container,
  CssBaseline,
  Link,
  ThemeProvider,
  Toolbar,
  Typography,
  Switch,
  Badge,
} from '@material-ui/core';
import { createTheme } from '@material-ui/core/styles';
import Head from 'next/head';
import useStyles from '../utils/style';
import NextLink from 'next/link';
import Image from 'next/image';
import { Store } from '../utils/Store';
import Cookies from 'js-cookie';
import React, { useContext } from 'react';
//import Iran from './fonts/Iran.woff2';

export default function Layout({ description, title, children }) {
  const { state, dispatch } = useContext(Store);
  const { darkMode, cart } = state;
  const theme = createTheme({
    typography: {
      fontFamily: 'Vazir',
      h1: {
        fontSize: '1.6rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          @font-face {
            font-family: 'Vazir';
            font-style: normal;
            font-display: swap;
            font-weight: 400;
            src: local('Vazir'), local('Vazir'), url('./fonts/Vazir-Medium.woff2') format('woff2');
            unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
          }
        `,
      },
    },
    palette: {
      type: darkMode ? 'dark' : 'light',
      light: {
        main: '#ffffff',
      },
      primary: {
        main: '#8b0000',
      },
      secondary: {
        main: '#208080',
      },
    },
  });
  const classes = useStyles();
  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
    const newDarkMode = !darkMode;
    Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
  };
  return (
    <div>
      <Head>
        <title>{title ? `${title} - آذرلند ` : ` آذرلند`}</title>
        {description && <meta name="description" content={description}></meta>}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar dir="rtl" position="static" className={classes.navbar}>
          <Toolbar className={classes.Htoolbar}>
            <NextLink href="/" passHref>
              <Link>
                <Image
                  className={classes.logo}
                  src="/Azarland Logo.png"
                  alt="azarland logo"
                  width={125}
                  height={75}
                />
              </Link>
            </NextLink>
            <Switch
              checked={darkMode}
              onChange={darkModeChangeHandler}
            ></Switch>
            <div dir="ltr">
              <NextLink href="/login" passHref>
                <Link>ورود</Link>
              </NextLink>
              <NextLink href="/card" passHref>
                <Link>
                  {cart.cartItems.length > 0 ? (
                    <Badge
                      color="secondary"
                      badgeContent={cart.cartItems.length}
                    >
                      سبد خرید
                    </Badge>
                  ) : (
                    'سبد خرید'
                  )}
                </Link>
              </NextLink>
            </div>
          </Toolbar>
        </AppBar>
        <Container dir="rtl" className={classes.main}>
          {children}
        </Container>
        <footer className={classes.footer}>
          <Typography>Created by Baraz.one | 2022</Typography>
        </footer>
      </ThemeProvider>
    </div>
  );
}
