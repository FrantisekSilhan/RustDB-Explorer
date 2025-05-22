import Link from "next/link";
import Image from "next/image";
import { Item } from "@/utils/types";

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  // Format the hex color for background
  const bgColor = item.background_color ? `#${item.background_color}` : "#1a1a1a";
  
  return (
    <Link
      href={`/items/item-id/${item.item_id}`}
      className="block transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
    >
      <div className="overflow-hidden rounded-lg" style={{ backgroundColor: bgColor }}>
        <div className="p-4 h-full flex flex-col">
          <div className="relative w-full h-32 flex items-center justify-center mb-3">
            <Image
              src={item.full_icon_url}
              alt={item.name}
              width={128}
              height={96}
              className="object-contain max-h-full"
              style={{ imageRendering: "crisp-edges" }}
            />
          </div>
          
          <div className="mt-auto">
            <h3 className="text-white text-sm font-medium truncate text-center">
              {item.name}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  );
}