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

async function fetchApi<T>({endpoint, options, tags}: {endpoint: string, options?: RequestInit, tags?: string[]}): Promise<T> {
  const nextTags = tags ? { tags } : undefined;
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    next: nextTags,
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
      return fetchApi<ItemsResponse>({endpoint: `/items?page=${page}&limit=${limit}${searchParam}`});
    },
    
    getRecent: (limit = 10) => {
      return fetchApi<Item[]>({endpoint: `/items/recent?limit=${limit}`});
    },
    
    getByItemId: (itemId: number | string) => {
      return fetchApi<Item>({endpoint: `/items/item-id/${itemId}`, tags: [`item-${itemId}`]});
    },
    
    getByClassId: (classId: number | string) => {
      return fetchApi<Item>({endpoint: `/items/class-id/${classId}`, tags: [`class-${classId}`]});
    },
    
    getByName: (name: string) => {
      return fetchApi<Item>({endpoint: `/items/name/${name}`, tags: [`name-${name.toLowerCase().replace(/\s+/g, "-")}`]});
    },
    
    getMinimal: () => {
      return fetchApi<MinimalItemsResponse>({endpoint: "/items/minimal"});
    },
    
    getMinimalLast: () => {
      return fetchApi<MinimalItemsLastResponse>({endpoint: "/items/minimal/last"});
    },
    
    getMinimalDiff: (from: string) => {
      return fetchApi<MinimalItemsDiffResponse>({endpoint: `/items/minimal/diff?from=${from}`});
    },
    
    getSnapshotByItemId: (itemId: number | string) => {
      return fetchApi<Snapshot>({endpoint: `/items/item-id/${itemId}/snapshot`, tags: [`item-${itemId}`]});
    },
    
    getSnapshotByClassId: (classId: number | string) => {
      return fetchApi<Snapshot>({endpoint: `/items/class-id/${classId}/snapshot`, tags: [`class-${classId}`]});
    },
    
    getSnapshotByName: (name: string) => {
      return fetchApi<Snapshot>({endpoint: `/items/name/${name}/snapshot`, tags: [`name-${name.toLowerCase().replace(/\s+/g, "-")}`]});
    },
    
    getOrderBookByItemId: (itemId: number | string) => {
      return fetchApi<OrderBook>({endpoint: `/items/item-id/${itemId}/orderbook`, tags: [`item-${itemId}`]});
    },
    
    getOrderBookByClassId: (classId: number | string) => {
      return fetchApi<OrderBook>({endpoint: `/items/class-id/${classId}/orderbook`, tags: [`class-${classId}`]});
    },
    
    getOrderBookByName: (name: string) => {
      return fetchApi<OrderBook>({endpoint: `/items/name/${name}/orderbook`, tags: [`name-${name.toLowerCase().replace(/\s+/g, "-")}`]});
    },
  },
  
  snapshots: {
    getById: (snapshotId: number | string) => {
      return fetchApi<SnapshotResponse>({endpoint: `/snapshots/${snapshotId}`, tags: [`snapshot-${snapshotId}`]});
    },
  },
};