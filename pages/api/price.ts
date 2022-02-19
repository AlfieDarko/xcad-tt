/**
 * Query Prices
 * https://api.coingecko.com/api/v3/simple/price?ids=xcad-network&vs_currencies=usd
 *
 * Use the API above to query the current price for the "xcad-network" token.
 * This price value will need to be displayed on the client-side.
 *
 * Example Response: { 'xcad-network': { usd: 4.78 } }
 */

import type { NextApiRequest, NextApiResponse } from "next";

import fetch from "node-fetch";

type ResponseData = {
  price?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  let xcadPrice;

  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=xcad-network&vs_currencies=usd"
    );
    const responseJson = await response.json();

    const result: ResponseData = { price: responseJson["xcad-network"]["usd"] };

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Error revalidating" });
  }
}
