import { APIRequestContext } from "@playwright/test";
import * as dotenv from "dotenv";
dotenv.config();

const BASE_API_URL = process.env.BASE_API_URL!;
const API_KEY = process.env.API_KEY!;

class BaseApiHelper {
  protected request: APIRequestContext;
  protected baseUrl: string;
  protected headers: Record<string, string>;

  /**
   * Constructor initializes request context, base URL, and headers.
   * @param request - Playwright APIRequestContext instance
   */
  constructor(request: APIRequestContext) {
    this.request = request;
    this.baseUrl = BASE_API_URL;
    this.headers = {
      Authorization: `Bearer ${API_KEY}`,
    };
  }

  /**
   * Helper method to make GET requests to a specific API endpoint
   * @param endpoint - API endpoint relative to the base URL
   * @returns API response
   */
  protected async get(endpoint: string) {
    return this.request.get(`${this.baseUrl}/${endpoint}`, {
      headers: this.headers,
    });
  }
}

export class TokenApiHelper extends BaseApiHelper {
  constructor(request: APIRequestContext) {
    super(request);
  }

  /**
   * Fetch token details for a specific chain and address
   * @param chainId Blockchain network ID
   * @param address Token address
   * @returns API response
   */
  async fetchTokenDetails(chainId: number, address: string) {
    return this.get(`token/v1.2/${chainId}/custom/${address}`);
  }
}
