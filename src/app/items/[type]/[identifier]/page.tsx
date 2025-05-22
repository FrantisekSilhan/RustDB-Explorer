import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BarChart2, Database, ExternalLink, Clock } from "lucide-react";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/Button";
import { formatDistanceToNow } from "date-fns";

// Define valid types
const validTypes = ["item-id", "class-id", "name"];

interface ItemDetailPageProps {
  params: Promise<{
    type: string;
    identifier: string;
  }>;
}

export async function generateMetadata({ 
  params 
}: ItemDetailPageProps): Promise<Metadata> {
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
        item = await api.items.getByName(identifier);
        break;
    }

    if (!item) {
      return {
        title: "Item Not Found",
      };
    }
    
    return {
      title: item.name,
      description: `View market data and price information for ${item.name} in Rust`,
    };
  } catch (error) {
    console.error("Error fetching item data:", error);
    return {
      title: "Item Not Found",
    };
  }
}

export default async function ItemDetailPage({ params }: ItemDetailPageProps) {
  const { type, identifier } = await params;
  
  // Validate type
  if (!validTypes.includes(type)) {
    notFound();
  }
  
  // Fetch item data based on type
  let item;
  let snapshot;
  
  try {
    switch (type) {
      case "item-id":
        item = await api.items.getByItemId(identifier);
        snapshot = await api.items.getSnapshotByItemId(identifier);
        break;
      case "class-id":
        item = await api.items.getByClassId(identifier);
        snapshot = await api.items.getSnapshotByClassId(identifier);
        break;
      case "name":
        item = await api.items.getByName(decodeURIComponent(identifier));
        snapshot = await api.items.getSnapshotByName(decodeURIComponent(identifier));
        break;
    }
  } catch (error) {
    console.error("Error fetching item data:", error);
    notFound();
  }

  if (!item || !snapshot) {
    notFound();
  }
  
  // Format background color
  const bgColor = item.background_color ? `#${item.background_color}` : "#1a1a1a";
  
  // Format added date
  const addedDate = new Date(item.added_at);
  const formattedAddedDate = formatDistanceToNow(addedDate, { addSuffix: true });
  
  // Format snapshot date
  const snapshotDate = new Date(snapshot.fetched_at);
  const formattedSnapshotDate = formatDistanceToNow(snapshotDate, { addSuffix: true });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{item.name}</h1>
        <p className="text-gray-400 mt-1">Added {formattedAddedDate}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Item Image */}
        <div 
          className="bg-opacity-80 rounded-xl overflow-hidden p-8 flex items-center justify-center"
          style={{ backgroundColor: bgColor }}
        >
          <Image
            src={item.full_icon_url}
            alt={item.name}
            width={280}
            height={280}
            className="object-contain max-h-full"
            priority
          />
        </div>
        
        {/* Item Details */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-gray-400 text-sm mb-1">Item ID</h3>
              <p className="text-lg font-medium">{item.item_id}</p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-gray-400 text-sm mb-1">Class ID</h3>
              <p className="text-lg font-medium">{item.class_id}</p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-gray-400 text-sm mb-1">Sell Orders</h3>
              <p className="text-lg font-medium">{snapshot.total_sell_requests}</p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-gray-400 text-sm mb-1">Buy Orders</h3>
              <p className="text-lg font-medium">{snapshot.total_buy_requests}</p>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="text-gray-400 h-4 w-4" />
              <h3 className="text-gray-400 text-sm">Last Updated</h3>
            </div>
            <p className="text-lg font-medium">{formattedSnapshotDate}</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Button variant="gradient">
              <Link href={`/items/${type}/${identifier}/orderbook`} className="flex items-center">
                <BarChart2 className="mr-2 h-4 w-4" />
                View Order Book
              </Link>
            </Button>
            
            <Button variant="outline">
              <a 
                href={`https://steamcommunity.com/market/listings/252490/${encodeURIComponent(item.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View on Steam Market
              </a>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Market Data</h2>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold">Snapshot ID: {snapshot.snapshot_id}</h3>
              <p className="text-gray-400 flex items-center">
                <Clock className="inline-block mr-2 h-4 w-4" />
                Fetched {formattedSnapshotDate}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Button variant="outline" size="sm">
                <Link href={`/items/${type}/${identifier}/orderbook`} className="flex items-center">
                  <Database className="mr-2 h-4 w-4" />
                  Full Order Book
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900 rounded-lg p-4">
              <h4 className="text-orange-500 font-medium mb-3">Sell Orders</h4>
              <div className="text-center py-12">
                <p className="text-4xl font-bold">{snapshot.total_sell_requests}</p>
                <p className="text-gray-400 mt-2">Total sell requests</p>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-4">
              <h4 className="text-green-500 font-medium mb-3">Buy Orders</h4>
              <div className="text-center py-12">
                <p className="text-4xl font-bold">{snapshot.total_buy_requests}</p>
                <p className="text-gray-400 mt-2">Total buy requests</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}