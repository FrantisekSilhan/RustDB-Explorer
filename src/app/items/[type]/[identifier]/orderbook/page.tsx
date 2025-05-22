// app/items/[type]/[identifier]/orderbook/page.tsx
import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/Button";
import OrderBookChart from "@/components/charts/OrderBookChart";
import { formatDistanceToNow } from "date-fns";

// Define valid types
const validTypes = ["item-id", "class-id", "name"];

interface OrderBookPageProps {
  params: Promise<{
    type: string;
    identifier: string;
  }>;
}

export async function generateMetadata({ 
  params 
}: OrderBookPageProps): Promise<Metadata> {
  const { type, identifier } = await params;
  
  if (!validTypes.includes(type)) {
    return {
      title: "Invalid Item",
    };
  }
  
  try {
    // Fetch item data based on type
    let item;
    switch (type) {
      case "item-id":
        item = await api.items.getByItemId(identifier);
        break;
      case "class-id":
        item = await api.items.getByClassId(identifier);
        break;
      case "name":
        item = await api.items.getByName(decodeURIComponent(identifier));
        break;
    }

    if (!item) {
      return {
        title: "Item Not Found",
      };
    }
    
    return {
      title: `Order Book - ${item.name}`,
      description: `View the detailed order book for ${item.name} in Rust`,
    };
  } catch (error) {
    console.error("Error fetching item data:", error);
    return {
      title: "Item Not Found",
    };
  }
}

export default async function OrderBookPage({ params }: OrderBookPageProps) {
  const { type, identifier } = await params;
  
  // Validate type
  if (!validTypes.includes(type)) {
    notFound();
  }
  
  // Fetch item and order book data based on type
  let item;
  let orderBook;
  
  try {
    switch (type) {
      case "item-id":
        item = await api.items.getByItemId(identifier);
        orderBook = await api.items.getOrderBookByItemId(identifier);
        break;
      case "class-id":
        item = await api.items.getByClassId(identifier);
        orderBook = await api.items.getOrderBookByClassId(identifier);
        break;
      case "name":
        item = await api.items.getByName(decodeURIComponent(identifier));
        orderBook = await api.items.getOrderBookByName(decodeURIComponent(identifier));
        break;
    }
  } catch (error) {
    console.error("Error fetching item or order book data:", error);
    notFound();
  }

  if (!item || !orderBook) {
    notFound();
  }
  
  // Format snapshot date
  const snapshotDate = new Date(orderBook.fetched_at);
  const formattedSnapshotDate = formatDistanceToNow(snapshotDate, { addSuffix: true });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button variant="outline" size="sm" className="mb-4">
          <Link href={`/items/${type}/${identifier}`} className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Item
          </Link>
        </Button>
        
        <h1 className="text-3xl font-bold">{item.name} - Order Book</h1>
        <p className="text-gray-400 mt-1">
          <Clock className="inline mr-2 h-4 w-4" />
          Last updated {formattedSnapshotDate}
        </p>
      </div>
      
      {/* Order Book Chart */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Order Book Visualization</h2>
        
        <Suspense fallback={<div className="h-80 bg-gray-900 animate-pulse rounded-lg" />}>
          <OrderBookChart
            sellOrders={orderBook.sell_orders}
            buyOrders={orderBook.buy_orders}
            className="w-full h-80 md:h-96"
          />
        </Suspense>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900 p-3 rounded-lg">
            <p className="text-sm text-gray-400">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Buy Orders: {orderBook.total_buy_requests}
            </p>
          </div>
          
          <div className="bg-gray-900 p-3 rounded-lg">
            <p className="text-sm text-gray-400">
              <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
              Sell Orders: {orderBook.total_sell_requests}
            </p>
          </div>
        </div>
      </div>
      
      {/* Order Book Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sell Orders */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-red-500">Sell Orders</h2>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Quantity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cumulative</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {orderBook.sell_orders.map((order, index) => (
                    <tr key={`sell-${index}`}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-white">
                        ${(order.price / 100).toFixed(2)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">
                        {order.quantity}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">
                        {order.cumulative_quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Buy Orders */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-green-500">Buy Orders</h2>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Quantity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cumulative</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {orderBook.buy_orders.slice().reverse().map((order, index) => (
                    <tr key={`buy-${index}`}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-white">
                        ${(order.price / 100).toFixed(2)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">
                        {order.quantity}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">
                        {order.cumulative_quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}