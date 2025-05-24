import Image from "next/image";
import { ExternalLink, Database, Clock, BarChart2 } from "lucide-react";
import { Item, Snapshot } from "@/utils/types";
import { Button } from "@/components/ui/Button";
import { formatRelativeTime } from "@/utils/utils";

interface ItemDetailsProps {
  item: Item;
  snapshot: Snapshot;
  type: string;
  identifier: string;
}

export default function ItemDetails({ item, snapshot, type, identifier }: ItemDetailsProps) {
  const bgColor = item.background_color ? `#${item.background_color}` : "#1a1a1a";
  const formattedSnapshotDate = formatRelativeTime(snapshot.fetched_at);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
            <Button path={`/items/${type}/${identifier}/orderbook`} variant="gradient">
              <div className="flex items-center">
                <BarChart2 className="mr-2 h-4 w-4" />
                View Order Book
              </div>
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
              <Button path={`/items/${type}/${identifier}/orderbook`} variant="outline" size="sm">
                <div className="flex items-center">
                  <Database className="mr-2 h-4 w-4" />
                  Full Order Book
                </div>
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
    </>
  );
}