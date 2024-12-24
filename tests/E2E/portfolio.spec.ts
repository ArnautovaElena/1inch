import { test, expect } from "@playwright/test";
import { convertBalanceToNumber } from "./utils";

test.describe("1inch Portfolio Wallet Management", () => {
  const PORTFOLIO_URL = "https://portfolio.1inch.io/";
  const ENS_LOOKUP_URL = "https://domains.1inch.io/v2.0/lookup";
  const PORTFOLIO_API_URL =
    "https://portfolio-api.1inch.io/portfolio/v4/general/current_value";
  const walletAddress = "vitalik.eth";
  const expectedWalletData = {
    protocol: "ENS",
    address: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
    checkUrl: "https://app.ens.domains/vitalik.eth",
  };

  let savedUsdValue: number;

  test.beforeEach(async ({ page }) => {
    await page.goto(PORTFOLIO_URL);

    // Dismiss satisfaction popup
    await page.locator('app-satisfaction svg[class*="close-button"]').click();
  });

  test("Connect wallet to portfolio", async ({ page }) => {
    // Step 1: Open the portfolio website (already done in beforeEach)

    // Step 2: Click on "Connect wallet" in the header
    await page
      .locator("app-account-button")
      .getByRole("button", { name: "Connect wallet" })
      .click();

    // Step 3: Type ENS wallet address in the opened form
    await page.getByPlaceholder("Add address or domain").fill(walletAddress);

    // Step 4: Press the "+" button to add the wallet
    await page
      .locator("app-add-wallet")
      .locator('button[class="add-button"]')
      .click();

    // Step 5: Validate ENS lookup API request and response
    const responseENSLookup = await page.waitForResponse(
      (res) =>
        res.url().includes(`${ENS_LOOKUP_URL}?name=${walletAddress}`) &&
        res.status() === 200
    );

    const responseENSLookupBody = await responseENSLookup.json();

    // Perform assertions
    expect(responseENSLookupBody.result).toContainEqual(expectedWalletData);

    // Step 6: Validate portfolio API request and save value_usd field
    const responsePortfolioAPI = await page.waitForResponse(
      (res) =>
        res
          .url()
          .includes(
            `${PORTFOLIO_API_URL}?addresses=${expectedWalletData.address}&use_cache=true`
          ) && res.status() === 200
    );

    const responsePortfolioAPIBody = await responsePortfolioAPI.json();

    // Perform assertions
    expect(responsePortfolioAPIBody.result[0]).toHaveProperty("value_usd");
    savedUsdValue = responsePortfolioAPIBody.result[0].value_usd;

    // Step 7: Check wallet was added successfully in header
    const walletHeader = page.getByRole("button", { name: walletAddress });
    await expect(walletHeader).toBeVisible();

    // Step 8: Press dropdown button
    const dropdownButton = walletHeader.locator("svg");
    await dropdownButton.click();

    // Step 9: Check wallet in the wallets list and validate balance
    const walletList = page.locator("app-account-info");
    await expect(walletList).toBeAttached();
    const walletItem = walletList.locator(`text=${walletAddress}`);
    await expect(walletItem).toBeVisible();

    const balanceUsd = await page
      .locator('small[class*="account-option-value"]')
      .textContent();

    // Use the utility function to convert and validate the balance
    const numericBalance = convertBalanceToNumber(balanceUsd);
    expect(numericBalance).toBeCloseTo(savedUsdValue, 0);
  });

  test("Validate search results for a valid query", async ({ page }) => {
    // Step 1: Locate the search field and enter the query
    await page.getByPlaceholder("Search address or domain").fill(walletAddress);
    await page
      .locator("app-address-search")
      .locator('button[type="submit"]')
      .click();

    // Step 2: Validate the API call
    // TO DO: get endpoint to fetch all networks USD value

    // Step 3: Validate that the results are displayed in the UI
    await expect(
      page.locator("app-address-preview").getByText(walletAddress)
    ).toBeVisible();
    // Validate USD value is equal to API data
  });
});
