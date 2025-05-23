"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [editingEllipsis, setEditingEllipsis] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleEllipsisClick = (ellipsisIndex: number) => {
    setEditingEllipsis(ellipsisIndex);
    setInputValue("");
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNumber = parseInt(inputValue);

    if (pageNumber >= 1 && pageNumber <= totalPages) {
      handlePageChange(pageNumber);
    }

    setEditingEllipsis(null);
    setInputValue("");
  };

  const handleInputBlur = () => {
    setEditingEllipsis(null);
    setInputValue("");
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setEditingEllipsis(null);
      setInputValue("");
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis-start");
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis-end");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center space-x-1 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="cursor-pointer"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pageNumbers.map((page, i) => {
        if (typeof page === "string") {
          const ellipsisIndex = i;
          const isEditing = editingEllipsis === ellipsisIndex;

          if (isEditing) {
            return (
              <form
                key={`ellipsis-${i}`}
                onSubmit={handleInputSubmit}
                className="inline-block"
              >
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onBlur={handleInputBlur}
                  onKeyDown={handleInputKeyDown}
                  className="w-12 h-8 px-2 text-center text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:m-0"
                  placeholder="..."
                  min="1"
                  max={totalPages}
                  autoFocus
                />
              </form>
            );
          }

          return (
            <button
              key={`ellipsis-${i}`}
              onClick={() => handleEllipsisClick(ellipsisIndex)}
              className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors cursor-pointer"
              title="Click to go to specific page"
            >
              ...
            </button>
          );
        }

        return (
          <Button
            key={`page-${page}`}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(page as number)}
            className={
              currentPage === page ? "bg-orange-600" : "" + " cursor-pointer"
            }
          >
            {page}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="cursor-pointer"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
