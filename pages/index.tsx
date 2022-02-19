import {
  AppBar,
  Box,
  Container,
  Grid,
  Input,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { fromBech32Address, toBech32Address } from "@zilliqa-js/crypto";
import { isAddress, isBech32 } from "@zilliqa-js/util/dist/validation";

import Head from "next/head";
import type { NextPage } from "next";
import axios from "axios";
import { useState } from "react";

/**
 * Use the '@zilliqa-js/crypto' package to convert a Bech32 address to a Base16 address.
 * Allow the user to enter a Bech32 address, displaying the converted Base16 address on-screen.
 *
 * Example:
 *    Bech32 Address: zil1tym3sy8sary2y3lqy56dx4ej9v7fsxku52gl6z
 *    Base16 Address: 0x59371810F0E8c8a247E02534D357322B3c981AdC
 *
 * Using the "price" API, display the current XCAD price on-screen.
 */

type ResponseData = {
  price: string;
};

interface Props {
  data: ResponseData;
}

const getXCADPriceData = async () => {
  const PRICE_API_URL = "http://localhost:3000/api/price";
  const response = await axios.get(PRICE_API_URL);
  return response;
};

const Home: NextPage<Props> = (props) => {
  const [bech32Address, setBech32Address] = useState("");
  const [hexAddress, setHexAddress] = useState("");
  const {
    data: { price },
  } = props;

  const inputHandler = (value: string) => {
    setBech32Address(value);
    if (isBech32(value)) {
      setHexAddress(fromBech32Address(value));
    }
  };

  const getHexAddress = (): string => {
    return isBech32(bech32Address) ? hexAddress : "";
  };

  return (
    <Box>
      <AppBar position="fixed">
        <Container>
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            <Typography variant="h6" component="div">
              {" "}
              Address Converter{" "}
            </Typography>
            <Typography>XCAD: {price}</Typography>
          </Toolbar>
        </Container>
      </AppBar>

      <Container>
        <Head>
          <title>Address Converter</title>
          <meta name="description" content="Zilliqa Address Converter" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Stack mt={16} alignItems="center">
          <Grid container maxWidth={600} spacing={3}>
            <Grid item xs={6}>
              <Input
                onChange={(e) => inputHandler(e.target.value)}
                fullWidth
                placeholder="Bech32 Address"
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                fullWidth
                placeholder="Hex Address"
                value={getHexAddress()}
              />
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
};

export async function getStaticProps() {
  const result = await getXCADPriceData();

  return {
    props: {
      data: result.data,
    },
    revalidate: 60,
  };
}

export default Home;
