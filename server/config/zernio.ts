import { Zernio } from "@zernio/node";

const zernioApiKey = process.env.ZERNIO_API_KEY;

if (!zernioApiKey) {
  throw new Error(
    "Missing ZERNIO_API_KEY environment variable."
  );
}

const zernio = new Zernio({
    apiKey: zernioApiKey,
    baseURL: 'https://zernio.com/api'
});

export default zernio;