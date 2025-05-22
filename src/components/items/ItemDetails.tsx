import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Calendar, Tag, Database } from "lucide-react";
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
  const formattedAddedDate = formatRelativeTime(item.added_at);
  const formattedSnapshotDate = formatRelativeTime(snapshot.fetched_at);

  return (
    <div>
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
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="text-gray-400 h-4 w-4" />
                <h3 className="text-gray-400 text-sm">Added</h3>
              </div>
              <p className="text-lg font-medium">{formattedAddedDate}</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Tag className="text-gray-400 h-4 w-4" />
                <h3 className="text-gray-400 text-sm">Color</h3>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded-full border border-gray-700" 
                  style={{ backgroundColor: bgColor }}
                ></div>
                <p className="font-medium uppercase">{item.background_color || "None"}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-gray-400 text-sm mb-1">Sell Orders</h3>
              <p className="text-lg font-medium">{snapshot.total_sell_requests}</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-gray-400 text-sm mb-1">Buy Orders</h3>
              <p className="text-lg font-medium">{snapshot.total_buy_requests}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button variant="gradient">
              <Link href={`/items/${type}/${identifier}/orderbook`} className="flex items-center">
                <Database className="mr-2 h-4 w-4" />
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

      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="text-gray-400 h-4 w-4" />
          <p className="text-sm text-gray-400">Last market snapshot: {formattedSnapshotDate}</p>
        </div>
      </div>
    </div>
  );
}