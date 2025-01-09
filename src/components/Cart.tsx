"use client"

import { ShoppingCart } from "lucide-react";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Separator } from "./ui/separator";
import { formatPrice } from "@/lib/utils";

import { buttonVariants } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import CartItem from "./CartItem";
import { ScrollArea } from "./ui/scroll-area";
import { useSearchParams } from "next/navigation";


const Cart = () => {
    const { items, quantities } = useCart();
    const itemCount = items.length

      const searchParams = useSearchParams();
      
      const query = searchParams.get("query");
      const searchedCategory = searchParams.get("category");

    const totalFee = items.reduce((total, item) => {
        const quantity = quantities[item._id] || 0;
        return total + item.price * quantity;
    }, 0);

    const tax = 20
    const totalWithTax = totalFee + (totalFee * tax) / 100;

    return <Sheet>
        <SheetTrigger className="group -m-2 flex items-center p-2">

            {itemCount > 0 ? (
                <>
                    <ShoppingCart
                        aria-hidden='true'
                        className="relative h-6 w-6 flex-shrink-0 text-[#b9b9b9] group-hover:text-[#b9b9b9]/80"
                    />
                    <span className="h-3 w-3 relative flex items-center justify-center transition-all animate__animated animate__fadeIn" aria-hidden='true'>
                        <span className="animate-ping absolute -top-[0.78rem] -right-[1px]  inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" aria-hidden='true' />
                        <span className="relative -top-3 -right-[1px] inline-flex rounded-full h-2 w-2 bg-primary" aria-hidden='true' />
                    </span>
                </>
            ) : (
                <ShoppingCart
                    aria-hidden='true'
                    className="relative h-6 w-6 flex-shrink-0 text-[#b9b9b9] group-hover:text-[#b9b9b9]/80"
                />

            )}
        </SheetTrigger>
        <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg overflow-auto">
            <SheetHeader className="space-y-2.5 pr-6">
                <SheetTitle>cart ({itemCount})</SheetTitle>
            </SheetHeader>
            {itemCount > 0 ? (
                <>
                    <div className="flex w-full flex-col pr-6">
                        <ScrollArea>
                            {items?.map((product) => (
                                <CartItem
                                    product={product}
                                    key={product._id}
                                />

                            ))}
                        </ScrollArea>
                    </div>
                    <div className="space-y-4 pr-6">
                        <Separator />
                        <div className="space-y-1.5 pr-6">
                            <div className="flex font-medium">
                                <span className="flex-1">Subtotal</span>
                                <span>{formatPrice(totalFee)}</span>
                            </div>
                            <div className="flex text-sm text-muted-foreground">
                                <span className="flex-1">
                                    Tax 20%
                                </span>
                                <span>{formatPrice(tax)}</span>
                            </div>
                            <div className="flex font-semibold">
                                <span className="flex-1">
                                    Total
                                </span>
                                <span>{formatPrice(totalWithTax)}</span>
                            </div>
                        </div>

                        <SheetFooter>
                            <SheetTrigger asChild>
                                <Link href='/cart' className={buttonVariants({
                                    className: 'w-full'
                                })}>
                                    Continue to Checkout
                                </Link>
                            </SheetTrigger>
                        </SheetFooter>
                    </div>
                </>
            ) : (
                <div className="flex h-full flex-col items-center justify-center space-y-1">
                    <div className="relative mb-4 h-60 w-60 text-muted-foreground" aria-hidden='true'>
                        <Image
                            src="/Order food-pana.svg"
                            alt="searching for food"
                            fill
                            loading="eager"
                        />
                    </div>
                    <div className="text-xl font-semibold">Your cart is empty</div>
                    <SheetTrigger asChild>
                            <Link href={`/?category=${searchedCategory}&query=${query}`} className={buttonVariants({
                            variant: 'link',
                            size: 'sm',
                            className: 'text-sm text-muted-foreground'
                        })}>
                            Add items to your cart to checkout
                        </Link>
                    </SheetTrigger>
                </div>
            )}
        </SheetContent>
    </Sheet>;
}

export default Cart;