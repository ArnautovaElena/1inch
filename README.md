# 🦄 TypeScript + Playwright Tests with Allure Reporting

This repository contains automated e2e and API tests using the Playwright framework, Typescript and enhanced with Allure Reports for test reporting.

---

## Prerequisites

Before running the tests, ensure you have the following installed:

1. **Git**: [Download and install Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
2. **Node.js and npm**: [Download and install Node.js](https://nodejs.org/)
   - Recommended version: Node.js 16.x or higher.
3. **Allure Commandline Tool**: [Download and install Allure](https://docs.qameta.io/allure/#_get_started) or install via npm:

   ```bash
    npm install -g allure-commandline
   ```

4. **Playwright browsers**
    ```bash
   npx playwright install
   ```
5. **Dotenv** for reading environment dependencies
    ```bash 
   npm install dotenv
    ```

## Step 1: Clone the Repository

Clone the repository to your local machine:

```bash
git clone git@github.com:ArnautovaElena/1inch.git
cd 1inch 
```

## Step 2: Install Dependencies

Install the required dependencies, including Playwright, Allure and Dotenv, using npm:

```bash
npm install
```

### Project Dependencies

Below are the key dependencies defined in the package.json file:
 - @playwright/test: Playwright testing framework for browser automation.
 - allure-playwright: Integrates Allure reporting with Playwright.
 - typescript: Provides type safety for the tests.
 - eslint: Ensures code quality and adheres to best practices.
 - prettier: Formats the code consistently.

## Running Tests

## Step 1: Environment variables

To run this project, you will need to add the following environment variables to your .env file

`BASE_API_URL`

`API_KEY`

## Step 2: Run All Tests

To execute all tests, run:
```bash
npx playwright test
```

## Step 3: Generate Allure Results

After running the tests, generate an Allure report with:
```bash
allure generate ./allure-results --clean
```
## Step 4: Open the Allure Report

View the report in your browser by running:
```bash
allure open
```
