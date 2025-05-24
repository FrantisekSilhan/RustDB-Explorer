import { Metadata } from "next";
import { notFound } from "next/navigation";
import { api } from "@/utils/api";
import { BackButton } from "@/components/ui/Buttons";
import ItemDetails from "@/components/items/ItemDetails";
import { formatRelativeTime } from "@/utils/utils";

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
  
  if (!validTypes.includes(type)) {
    notFound();
  }
  
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
  
  const formattedAddedDate = formatRelativeTime(item.added_at);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <BackButton />
        <h1 className="text-3xl font-bold">{item.name}</h1>
        <p className="text-gray-400 mt-1">Added {formattedAddedDate}</p>
      </div>
      
      <ItemDetails item={item} snapshot={snapshot} type={type} identifier={identifier} />
    </div>
  );
}