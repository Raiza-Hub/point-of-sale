"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "@phosphor-icons/react";
import { useCart } from "@/hooks/use-cart"
import { Id } from "../../convex/_generated/dataModel";


const QuantityButton = ({ productId }: { productId: Id<'products'> }) => {
    const {  quantities, increaseQuantity, decreaseQuantity } = useCart();

    return (
        <div className="w-full flex items-center justify-between bg-[#f7f7f7] mx-auto rounded-full border border-gray-200 shadow-sm p-1">
            <Button
                variant="ghost"
                size='sm'
                onClick={() => decreaseQuantity(productId)}
                className="h-8 w-8 rounded-full bg-white border border-gray-200"
                aria-label="decrease quantity"
            >
                <Minus
                    className="h-4 w-4"
                    aria-hidden='true'
                />
            </Button>
            <span className="text-sm font-medium px-4">{quantities[productId] || 0}</span>
            <Button
                variant="ghost"
                size='sm'
                onClick={() => increaseQuantity(productId)}
                className="h-8 w-8 rounded-full bg-white border border-gray-200"
                aria-label="increase quantity"
            >
                <Plus
                    className="h-4 w-4"
                    aria-hidden='true'
                />
            </Button>
        </div>
    );
};

export default QuantityButton;
