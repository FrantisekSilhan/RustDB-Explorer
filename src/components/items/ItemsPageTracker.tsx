"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function ItemsPageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname === "/items") {
      const currentUrl = searchParams.toString() 
        ? `${pathname}?${searchParams.toString()}`
        : pathname;
      
      sessionStorage.setItem("lastItemsPageUrl", currentUrl);
    }
  }, [pathname, searchParams]);

  return null;
}
