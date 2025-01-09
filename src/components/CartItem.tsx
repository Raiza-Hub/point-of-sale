import { CartItem as Product, useCart } from "@/hooks/use-cart";
import Image from "next/image";
import { Trash } from "@phosphor-icons/react/dist/ssr";
import { formatPrice } from "@/lib/utils";
import QuantityButton from "./QuantityBtn";


const CartItem = ({ product }: { product: Product }) => {

    const { removeItem } = useCart();

    return (
        <div className="space-y-3 py-2">
            <div className="flex items-start justify-between gap-4 pt-2">
                <div className="flex items-center space-x-4">
                    <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded">
                        <Image
                            src={product.imageUrl!}
                            alt={product.name}
                            fill
                            className="absolute object-cover"
                        />
                    </div>

                    <div className="flex flex-col self-start">
                        <span className="line-clamp-1 text-sm font-medium mb-1">
                            {product.name}
                        </span>

                        <span className="line-clamp-1 text-sm capitalize text-muted-foreground">
                            {product.category}
                        </span>
                        <div>
                            <button
                                onClick={() => removeItem(product._id)}
                                aria-label="remove product"
                                className="w-fit mt-3 text-sm text-muted-foreground border-2 p-1 transition-colors rounded-full hover:bg-primary hover:text-white"
                            >
                                <Trash
                                    className='w-4 h-4 flex items-center gap-0.5 cursor-pointer'
                                    aria-hidden='true'
                                />
                            </button>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col space-y-4 font-medium'>
                    <span className='ml-auto line-clamp-1 text-sm'>
                        {formatPrice(product.price)}
                    </span>

                    <span>
                        <QuantityButton
                            productId={product._id}
                        />
                    </span>
                </div>
            </div>
        </div>
    );
}

export default CartItem;