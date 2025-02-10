import { BASE_URL } from "./constants";

export function toQueryString(params) {
  return Object.entries(params)
    .flatMap(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map(subValue => `${encodeURIComponent(key)}=${encodeURIComponent(subValue)}`);
      }
      if (typeof value === 'object' && value !== null) {
        return Object.entries(value)
          .map(([subKey, subValue]) => `${encodeURIComponent(key + '.' + subKey)}=${encodeURIComponent(subValue)}`);
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join('&');
}

const getHeaders = () => {
  const headers = { "Content-Type": "application/json" };
  return headers;
};

const request = async (url, method, body = null, headers = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      method,
      headers: { ...getHeaders(), ...headers },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Exception ${response.status}: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    throw error;
  }
};

export const get = (url, headers = {}) => request(url, "GET", null, headers);
export const post = (url, body, headers = {}) => request(url, "POST", body, headers);
export const put = (url, body, headers = {}) => request(url, "PUT", body, headers);
export const del = (url, headers = {}) => request(url, "DELETE", null, headers);