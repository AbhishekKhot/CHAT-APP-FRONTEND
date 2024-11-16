import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const BASE_URL = process.env.API_BASE_URL;

interface HttpRequestOptions {
  url: string;
  requestData?: any;
  params?: any;
  headers?: Record<string, string>;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
}

class ApiService {
  private static async httpRequest({
    url,
    requestData,
    params,
    headers = {},
    method = "GET",
  }: HttpRequestOptions): Promise<AxiosResponse> {
    const config: AxiosRequestConfig = {
      url: `${BASE_URL}${url}`,
      method,
      data: requestData,
      params,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };
    try {
      return await axios(config);
    } catch (error) {
      throw error;
    }
  }

  static async httpGetJson(options: HttpRequestOptions) {
    options.method = "GET";
    return this.httpRequest(options);
  }
  static async httpPostJson(options: HttpRequestOptions) {
    options.method = "POST";
    return this.httpRequest(options);
  }
  static async httpPutJson(options: HttpRequestOptions) {
    options.method = "PUT";
    return this.httpRequest(options);
  }
  static async httpDeleteJson(options: HttpRequestOptions) {
    options.method = "DELETE";
    return this.httpRequest(options);
  }
}

export default ApiService;
