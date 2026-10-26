"use client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";

// ------pagination button array
const getButtonArray = (
  totalPages: number,
  page: number,
): (number | "ellipsis")[] => {
  // -----when total page is less then 7
  if (totalPages <= 6) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  //   ------when active page is less then 5
  if (page <= 5) {
    return [1, 2, 3, 4, 5, totalPages];
  }

  //   ------when active page is last 5 page
  if (page >= totalPages - 3) {
    return [
      1,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [1, "ellipsis", page - 1, page, page + 1, "ellipsis", totalPages];
};

const ReuseAblePagination = () => {
  // ====total page number
  const totalPages = 20;

  //   -----current page state
  const [page, setPage] = useState(1);

  //   -------setting page to go
  const gotoPage = (page: number) => {
    setPage(page);
  };

  // -----button design
  const buttonClass =
    "h-11 min-w-11 cursor-pointer rounded-[10px] border border-[#D5D8DE] bg-white px-3 text-[15px] font-semibold text-[#15171C] hover:bg-[#F0F1F4] hover:text-[#15171C] data-[active=true]:border-[#15171C] data-[active=true]:bg-[#15171C] data-[active=true]:text-white";

  return (
    <Pagination className="pt-8">
      <PaginationContent className="flex-wrap justify-center gap-2">
        <PaginationItem>
          <PaginationPrevious
            onClick={() => gotoPage(page - 1)}
            aria-disabled={page === 1}
            className={`${buttonClass} gap-1 pl-2.5! pr-3.5 ${
              page === 1 ? "pointer-events-none opacity-50" : ""
            }`}
          />
        </PaginationItem>
        {getButtonArray(totalPages, page).map((item, index) =>
          item === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index+1}`}>
              <PaginationEllipsis className="h-11 w-8 text-[#5B616E]" />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                onClick={() => setPage(item)}
                isActive={page === item}
                className={buttonClass}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            onClick={() => gotoPage(page + 1)}
            aria-disabled={page === totalPages}
            className={`${buttonClass} gap-1 pr-2.5! pl-3.5 ${
              page === totalPages ? "pointer-events-none opacity-50" : ""
            }`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default ReuseAblePagination;
