export interface Item {
  name: string;
  item_id: number;
  added_at: string;
  background_color: string;
  icon_url: string;
  class_id: number;
  full_icon_url: string;
}

export interface MinimalItem {
  name: string;
  icon: string;
}

export interface ItemsResponse {
  items: Item[];
  pagination: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
}

export interface MinimalItemsResponse {
  last_item: string;
  items: MinimalItem[];
}

export interface MinimalItemsLastResponse {
  last_item: string;
}

export interface MinimalItemsDiffResponse {
  from: string;
  to: string;
  items: MinimalItem[];
}

export interface Snapshot {
  snapshot_id: number;
  fetched_at: string;
  total_sell_requests: number;
  total_buy_requests: number;
}

export interface Order {
  price: number;
  quantity: number;
  cumulative_quantity: number;
}

export interface OrderBook extends Snapshot {
  sell_orders: Order[];
  buy_orders: Order[];
}

export interface SnapshotResponse {
  sell_orders: Order[];
  buy_orders: Order[];
}