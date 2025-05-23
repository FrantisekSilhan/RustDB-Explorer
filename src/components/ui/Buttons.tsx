"use client";

import { useRouter } from "next/navigation";
import { Button } from "./Button";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    const storedItemsUrl = sessionStorage.getItem("lastItemsPageUrl");

    if (storedItemsUrl) {
      router.push(storedItemsUrl);
    } else {
      router.push("/items");
    }
  };

  return (
    <Button variant="outline" size="sm" className="mb-4" onClick={handleBack}>
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back to Items
    </Button>
  );
}