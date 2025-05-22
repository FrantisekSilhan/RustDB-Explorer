import {
  Item,
  ItemsResponse,
  MinimalItemsResponse,
  MinimalItemsLastResponse,
  MinimalItemsDiffResponse,
  Snapshot,
  OrderBook,
  SnapshotResponse,
} from "@/utils/types";

const API_BASE_URL = "https://api.watercollector.icu/api/v1";

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    next: { revalidate: 60 },
  });
  
  if (!response.ok) {
    // log url and response for debugging
    console.error("API URL:", `${API_BASE_URL}${endpoint}`);
    console.error("API Response:", response);
    // log response body
    const responseBody = await response.text();
    console.error("API Response Body:", responseBody);

    throw new Error(`API request failed: ${response.statusText}`);
  }
  
  return response.json() as Promise<T>;
}

export const api = {
  items: {
    getAll: (page = 1, limit = 20, search?: string) => {
      const searchParam = search ? `&search=${search}` : "";
      return fetchApi<ItemsResponse>(`/items?page=${page}&limit=${limit}${searchParam}`);
    },
    
    getRecent: (limit = 10) => {
      return fetchApi<Item[]>(`/items/recent?limit=${limit}`);
    },
    
    getByItemId: (itemId: number | string) => {
      return fetchApi<Item>(`/items/item-id/${itemId}`);
    },
    
    getByClassId: (classId: number | string) => {
      return fetchApi<Item>(`/items/class-id/${classId}`);
    },
    
    getByName: (name: string) => {
      return fetchApi<Item>(`/items/name/${name}`);
    },
    
    getMinimal: () => {
      return fetchApi<MinimalItemsResponse>("/items/minimal");
    },
    
    getMinimalLast: () => {
      return fetchApi<MinimalItemsLastResponse>("/items/minimal/last");
    },
    
    getMinimalDiff: (from: string) => {
      return fetchApi<MinimalItemsDiffResponse>(`/items/minimal/diff?from=${from}`);
    },
    
    getSnapshotByItemId: (itemId: number | string) => {
      return fetchApi<Snapshot>(`/items/item-id/${itemId}/snapshot`);
    },
    
    getSnapshotByClassId: (classId: number | string) => {
      return fetchApi<Snapshot>(`/items/class-id/${classId}/snapshot`);
    },
    
    getSnapshotByName: (name: string) => {
      return fetchApi<Snapshot>(`/items/name/${name}/snapshot`);
    },
    
    getOrderBookByItemId: (itemId: number | string) => {
      return fetchApi<OrderBook>(`/items/item-id/${itemId}/orderbook`);
    },
    
    getOrderBookByClassId: (classId: number | string) => {
      return fetchApi<OrderBook>(`/items/class-id/${classId}/orderbook`);
    },
    
    getOrderBookByName: (name: string) => {
      return fetchApi<OrderBook>(`/items/name/${name}/orderbook`);
    },
  },
  
  snapshots: {
    getById: (snapshotId: number | string) => {
      return fetchApi<SnapshotResponse>(`/snapshots/${snapshotId}`);
    },
  },
};