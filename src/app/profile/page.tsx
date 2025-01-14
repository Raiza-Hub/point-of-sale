"use client";


import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";

import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import ProfileCard from "@/components/ProfileCard";
import Image from 'next/image'
import { useUser } from "@clerk/nextjs";
import { redirect, useRouter } from "next/navigation";
import { categoryStyles, cn, formatPrice } from "@/lib/utils";
import { Trash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";






const Page = () => {
    const { user } = useUser();
    const { toast } = useToast();
    const router = useRouter();


    const userId = useQuery(api.users.getUserById, {
        clerkId: user?.id
    });

    const { results, status, loadMore } = usePaginatedQuery(
        api.product.getProductByUserId,
        {
            userId: userId?._id,
        },
        { initialNumItems: 12 },
    );

    const deleteProduct = useMutation(api.product.deleteProduct);

    if (!user) {  
        return redirect("/sign-in");
    }

    if (status  === "LoadingFirstPage") return <LoaderSpinner />;

    const handleDelete = async ({ productId, imageStorageId }:
        {
            productId: Id<'products'>,
            imageStorageId: Id<'_storage'>
        }
    ) => {
        try {
            await deleteProduct({ productId, imageStorageId });
            toast({
                title: "Product deleted",
            });
            router.push("/");
        } catch (error) {
            console.error("Error deleting product", error);
            toast({
                title: "Error deleting product",
                variant: "destructive",
            });
        }
    };

    return (
        <section className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl max-md:text-center">
                Profile
            </h1>
            <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
                <ProfileCard
                    imageUrl={userId?.imageUrl}
                    userFirstName={userId?.name}
                    userLastName={user?.lastName}
                    userEmail={userId?.email}
                />
            </div>
            <section className="mt-9 flex flex-col gap-5">
                <h1 className="text-lg font-bold">All Products</h1>
                {results && results.length > 0 ? (
                    <div className="mt-12 ">
                        {results?.map((product) => (
                            <div
                                key={product._id}
                                className={cn({
                                    "divide-y divide-gray-200 border-b border-t border-gray-200": results.length > 0,
                                })}
                            >
                                <div className="flex py-6 sm:py-10">
                                    <div className="flex-shrink-0">
                                        <div className="relative h-24 w-24">
                                            <Image
                                                src={product.imageUrl!}
                                                alt={product.name}
                                                fill
                                                className="h-full w-full rounded-md object-cover object-center sm:w-48 sm:h-48"
                                            />
                                        </div>
                                    </div>
                                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                            <div>
                                                <h1 className="text-sm font-semibold text-gray-700 hover:text-gray-800 mb-1">{product.name}</h1>
                                                <h2 className="text-sm line-clamp-2 capitalize text-white-4">{product.description}</h2>

                                                <div className="mt-1 flex text-sm">
                                                    <div className="text-muted-foreground">Category:{" "}
                                                        <span>
                                                            <Badge
                                                                variant="secondary"
                                                                className={cn(
                                                                    categoryStyles[product.category]?.bg || "bg-gray-50",
                                                                    categoryStyles[product.category]?.text || "text-gray-600",
                                                                    "font-medium"
                                                                )}
                                                            >
                                                                {product.category}
                                                            </Badge>
                                                        </span>
                                                    </div>
                                                </div>

                                                <p className="mt-1 text-sm font-medium text-gray-900">
                                                    {formatPrice(product.price)}
                                                </p>
                                            </div>

                                            <div className="mt-4 sm:mt-0 sm:pr-9 w-20">
                                                <div className="absolute right-0 top-0">
                                                    <Button
                                                        variant='ghost'
                                                        aria-label="delete product"
                                                        onClick={() => handleDelete({ productId: product._id, imageStorageId: product.imageStorageId })}
                                                    >
                                                        <Trash
                                                            className='w-4 h-4 flex items-center gap-0.5 cursor-pointer'
                                                            aria-hidden="true"
                                                        />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title="You have not created any products yet"
                        buttonLink="/create-item"
                        buttonText="Create Product"
                    />
                )}

                <div className="flex flex-col items-center">
                    {results && results.length > 0 && (
                        <>
                            {status === "LoadingMore" ? (
                                <div className="font-medium text-muted-foreground mt-6">Loading more items...</div>
                            ) : status === "Exhausted" ? (
                                <div className="font-medium text-muted-foreground my-4">You’ve reached the end of the list</div>
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
                    )}
                </div>
            </section>
        </section>
    );
};

export default Page;