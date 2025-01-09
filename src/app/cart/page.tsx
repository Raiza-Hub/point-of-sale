"use client"

import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Trash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/BackButton";
import { redirect } from "next/navigation"
import { useUser } from "@clerk/nextjs";


const Page = () => {
    const { user } = useUser();
    const { items, quantities, removeItem } = useCart();

    const totalFee = items.reduce((total, item) => {
        const quantity = quantities[item._id] || 0;
        return total + item.price * quantity;
    }, 0);

    const tax = 20
    const totalWithTax = totalFee + (totalFee * tax) / 100;

    if (!user) {
        return redirect("/sign-in");
    }

    const handleCheckout = () => {
        alert(
            "Stripe integration is not implemented because Stripe doesn't support my country. " +
            "If it does support yours, feel free to clone the repo and implement it. Don't forget to give this repo a star!"
        );
    };


    return (
        <div>
            <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
                <div className='mb-6'>
                    <BackButton />
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Shopping Cart
                </h1>

                <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
                    <div className={cn("lg:col-span-7", {
                        "rounded-lg border-2 border-dashed border-zinc-200 p-12":
                            items.length === 0,
                    })}>
                        <h2 className="sr-only">
                            Items in your shopping cart
                        </h2>

                        {items.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center space-y-1">
                                <div
                                    aria-hidden='true'
                                    className="relative mb-4 h-40 w-40 text-muted-foreground">
                                    <Image
                                        src="/Add to Cart-amico.svg"
                                        alt="empty shopping cart"
                                        fill
                                        loading="eager"
                                    />
                                </div>
                                <h3 className="font-semibold text-2xl">Your Cart is empty</h3>
                                <p className="text-muted-foreground text-center">
                                    Whoops!  Nothing to show here yet
                                </p>
                            </div>
                        ) : null}

                        <ul className={cn({
                            "divide-y divide-gray-200 border-b border-t border-gray-200": items.length > 0,
                        })}>
                            {items.map((product) => {
                                return (
                                    <li key={product._id} className="flex py-6 sm:py-10">
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
                                                    <div className="flex justify-between">
                                                        <h3 className="text-sm font-medium text-gray-700 hover:text-gray-800">
                                                            {product.name}
                                                        </h3>
                                                    </div>

                                                    <div className="mt-1 flex text-sm">
                                                        <p className="text-muted-foreground">Category: {product.category}</p>
                                                    </div>

                                                    <div className="mt-1 flex text-sm">
                                                        <p className="text-muted-foreground">Quantity:  {quantities[product._id]}</p>
                                                    </div>

                                                    <p className="mt-1 text-sm font-medium text-gray-900">
                                                        {formatPrice(product.price)}
                                                    </p>
                                                </div>

                                                <div className="mt-4 sm:mt-0 sm:pr-9 w-20">
                                                    <div className="absolute right-0 top-0">
                                                        <Button
                                                            variant='ghost'
                                                            aria-label="remove product"
                                                            onClick={() => removeItem(product._id)}
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
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                    <section className="mt-16 rounded-lg bg-gray-100 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
                        <h2 className="text-lg font-bold text-gray-900">Order summary</h2>

                        <div className="mt-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">Subtotal</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {formatPrice(totalFee)}
                                </p>
                            </div>

                            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <span>Tax 20%</span>
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                    {formatPrice(tax)}
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                <div className="text-base font-medium text-gray-900">Order Total</div>
                                <div className="text-base font-medium text-gray-900">
                                    {formatPrice(totalWithTax)}  
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Button
                                className="w-full"
                                size='lg'
                                onClick={handleCheckout}
                            >
                                Checkout
                            </Button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Page;