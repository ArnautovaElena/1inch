import { test, expect } from "@playwright/test";
import { TokenApiHelper } from "./apiHelper.ts";

let tokenApiHelper: TokenApiHelper;

// Initialize the API helper before each test
test.beforeEach(async ({ request }) => {
  tokenApiHelper = new TokenApiHelper(request);
});

// Define test parameters for token validation
const testParams = [
  {
    chainId: 1,
    tokenAddress: "0x111111111117dc0aa78b770fa6a738034120c302", // Token address from Step 1 of the task
    expected: {
      // Expected response properties from Step 2
      symbol: "1INCH",
      name: "1INCH Token",
      decimals: 18,
      logoURI:
        "https://tokens.1inch.io/0x111111111117dc0aa78b770fa6a738034120c302.png",
      address: "0x111111111117dc0aa78b770fa6a738034120c302",
      chainId: 1,
    },
  },
];

// Loop through test parameters to validate multiple tokens (scalable for future tests)
testParams.forEach(({ chainId, tokenAddress, expected }) => {
  test(`Fetch and validate details of single token`, async ({ request }) => {
    // Step 1: Fetch token details from the API
    const fetchResponse = await tokenApiHelper.fetchTokenDetails(
      chainId,
      tokenAddress
    );

    // Step 2: Ensure the API request was successful (HTTP 200 status code)
    expect(fetchResponse.status()).toBe(200);

    // Parse the response body as JSON
    const responseData = await fetchResponse.json();

    // Step 2: Validate response properties
    expect(responseData.symbol).toBe(expected.symbol); // Symbol should match
    expect(responseData.name).toBe(expected.name); // Name should match
    expect(responseData.address).toBe(expected.address); // Address should match
    expect(responseData.chainId).toBe(expected.chainId); // Chain ID should match
    expect(responseData.decimals).toBe(expected.decimals); // Decimals should match
    expect(responseData.logoURI).toMatch(/^https?:\/\/.+/); // Logo URI should be a valid URL

    // Step 2: Check if the logo image is available (via an additional HTTP GET request)
    const logoResponse = await request.get(responseData.logoURI);

    // Ensure the logo request was successful (HTTP 200 status code)
    expect(logoResponse.status()).toBe(200);

    // Validate that the logo content type is an image
    expect(logoResponse.headers()["content-type"]?.startsWith("image/")).toBe(
      true
    );
  });
});

// Negative test case: Validate behavior for an invalid token address
test("Fetch token details with invalid address should return 404", async () => {
  const chainId = 1;
  const invalidTokenAddress = "0x211111111117dc0aa78b770fa6a738034120c302"; // Invalid token address

  // Step 1: Attempt to fetch details for an invalid token
  const fetchResponse = await tokenApiHelper.fetchTokenDetails(
    chainId,
    invalidTokenAddress
  );

  // Step 2: Validate the response status is 404 (not found)
  expect(fetchResponse.status()).toBe(404);
});
