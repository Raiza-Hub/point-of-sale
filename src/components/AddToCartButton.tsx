"use client"

import { Button } from "./ui/button"
import { useEffect, useState } from "react"
import { useCart } from "@/hooks/use-cart"
import { Id } from "../../convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import ButtonLoader from "./ButtonLoader"


interface AddToCartButtonProps {
    productId: Id<'products'>;
    closeModal: (productId: Id<'products'>) => void;
}

const AddToCartButton = ({ productId, closeModal }: AddToCartButtonProps) => {
    const { addItem } = useCart();
    const [isSuccess, setIsSuccess] = useState<boolean>(false)

    const product = useQuery(api.product.getProductById, { productId });

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsSuccess(false)
        }, 2000)

        return () => clearTimeout(timeout)
    }, [isSuccess])

    if (!product) return <ButtonLoader message='Add to cart' />

    return (
        <Button
            className="w-full bg-primary hover:bg text-white font-medium py-6"
            aria-label="add to cart"
            onClick={() => {
                addItem(product)
                setIsSuccess(true)
                closeModal(product._id)
            }}
        >
            {isSuccess ? "Added!" : `Add to Cart `}

        </Button>
    )
}

export default AddToCartButton