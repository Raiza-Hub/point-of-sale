"use client"

import { useState } from "react";

import Navbar from "@/components/Navbar";
import { Categories } from "@/components/DishCategory";
import SearchBar from "@/components/SearchBar";
import Image from "next/image";
import { redirect, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import PreviewItem from "@/components/PreviewItem";
import { Badge } from "@/components/ui/badge";

import { usePaginatedQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import { cn, formatPrice } from "@/lib/utils";
import AddToCartButton from "@/components/AddToCartButton";
import ProductSkeleton from "@/components/ProductSkeleton";
import EmptyState from "@/components/EmptyState";
import Nutrition from "@/components/Nutrition";
import { Button } from "@/components/ui/button";


const categoryStyles: Record<string, { bg: string; text: string }> = {
  Pizza: { bg: "bg-red-50", text: "text-red-600" },
  Cookies: { bg: "bg-yellow-50", text: "text-yellow-600" },
  Burgers: { bg: "bg-green-50", text: "text-green-600" },
  Coffee: { bg: "bg-brown-50", text: "text-brown-600" },
  Dessert: { bg: "bg-purple-50", text: "text-purple-600" },
  Cake: { bg: "bg-pink-50", text: "text-pink-600" },
  Beverages: { bg: "bg-blue-50", text: "text-blue-600" },
};



export default function Home() {
  const searchParams = useSearchParams();
  const [openDialogs, setOpenDialogs] = useState<Record<string, boolean>>({});

  const query = searchParams.get("query");
  const searchedCategory = searchParams.get("category");

  const { results, status, loadMore } = usePaginatedQuery(
    api.product.getProductBySearch,
    {
      search: query ?? "",
      category: searchedCategory ?? "All Menu"
    },
    { initialNumItems: 8 },
  );


  if (Array.isArray(query)) {
    return redirect('/');
  };

  const closeModal = (id: string) => {
    setOpenDialogs((prev) => ({ ...prev, [id]: false }));
  };

  const openModal = (id: string) => {
    setOpenDialogs((prev) => ({ ...prev, [id]: true }));
  };



  return (
    <div className="w-full lg:max-w-7xl flex flex-col justify-center mx-auto px-6 lg:px-8">
      <main className="flex flex-col gap-4">
        <Navbar />
        <div className=" flex justify-center">
          <Categories />
        </div>
        <div className="flex flex-col">
          <SearchBar />
        </div>

        <div className="flex flex-col items-center mt-14">
          {status === "LoadingFirstPage" ? (
            <ProductSkeleton />
          ) : results?.length > 0 ? (
            <>
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {results.map(({ _id, name, imageUrl, description, category, price, nutrition }) => (
                  <Dialog
                    key={_id}
                    open={openDialogs[_id] || false}
                    onOpenChange={(isOpen) =>
                      setOpenDialogs((prev) => ({ ...prev, [_id]: isOpen }))
                    }
                  >
                    <DialogTrigger onClick={() => openModal(_id)}>
                      <PreviewItem
                        name={name}
                        price={price}
                        image={imageUrl!}
                        category={category}
                      />
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[486px] overflow-auto">
                      <DialogHeader className="flex items-center justify-center border-b shadow-sm">
                        <DialogTitle className="py-4">Details Menu</DialogTitle>
                      </DialogHeader>

                      <div className="w-full flex flex-col justify-center gap-4 p-6 shadow-sm">
                        <div className="relative w-full flex justify-center items-center bg-[#f7f7f7] p-4 -mt-7 rounded-2xl">
                          <Image
                            src={imageUrl!}
                            alt={name}
                            className="w-44 h-44 object-cover"
                            width={500}
                            height={500}
                            priority
                          />
                        </div>

                        <span className="flex text-start">
                          <Badge
                            variant="secondary"
                            className={cn(
                              categoryStyles[category]?.bg || "bg-gray-50",
                              categoryStyles[category]?.text || "text-gray-600",
                              "font-medium"
                            )}
                          >
                            {category}
                          </Badge>
                        </span>

                        <h1 className="text-3xl font-semibold text-balance">{name}</h1>

                        <Nutrition nutrition={nutrition} />

                        <div className="text-gray-600 mb-8">{description}</div>

                        <div className="text-2xl text-primary font-bold -mt-6">{formatPrice(price)}</div>
                      </div>

                      <DialogFooter>
                        <AddToCartButton productId={_id} closeModal={closeModal} />
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>

              {status === "LoadingMore" ? (
                <div className="font-medium text-muted-foreground mt-6">Loading more items...</div>
              ) : status === "Exhausted" ? (
                <div className="font-medium text-muted-foreground my-4">No more items to load.</div>
              ) : status === "CanLoadMore" ? (
                <Button
                  className="my-6 px-8"
                  variant="outline"
                  onClick={() => loadMore(8)}
                  disabled={status !== "CanLoadMore"}
                >
                  <p className="font-semibold text-gray-900">Load more items</p>
                </Button>
              ) : null}
            </>
          ) : (
            <EmptyState title="No results found" search />
          )}
        </div>

      </main>
    </div>
  );
}
