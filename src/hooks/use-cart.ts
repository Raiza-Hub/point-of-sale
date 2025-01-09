import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Id } from "../../convex/_generated/dataModel";

// Define the type for a cart item, based on the products in your data model.
export type CartItem = {
    _id: Id<"products">;
    _creationTime: number;
    imageUrl?: string;
    imageStorageId?: Id<"_storage">;
    nutrition?: {
        fat: string;
        sugar: string;
        salt: string;
        calories: string;
    };
    name: string;
    price: number;
    category: string;
};


type CartState = {
    items: CartItem[];
    quantities: Record<string, number>; // Map product ID to quantity
    addItem: (product: CartItem) => void;
    removeItem: (productId: string) => void;
    increaseQuantity: (productId: string) => void;
    decreaseQuantity: (productId: string) => void;
    clearCart: () => void;
};

export const useCart = create<CartState>()(
    persist(
        (set) => ({
            items: [],
            quantities: {},

            addItem: (product) =>
                set((state) => {
                    const productId = product._id;

                    if (state.quantities[productId]) {
                        return {
                            quantities: {
                                ...state.quantities,
                                [productId]: state.quantities[productId] + 1,
                            },
                        };
                    }

                    return {
                        items: [...state.items, product],
                        quantities: { ...state.quantities, [productId]: 1 },
                    };
                }),

            removeItem: (productId) =>
                set((state) => ({
                    items: state.items.filter((item) => item._id !== productId),
                    quantities: Object.fromEntries(
                        Object.entries(state.quantities).filter(
                            ([id]) => id !== productId
                        )
                    ),
                })),

            increaseQuantity: (productId) =>
                set((state) => ({
                    quantities: {
                        ...state.quantities,
                        [productId]: (state.quantities[productId] || 0) + 1,
                    },
                })),

            decreaseQuantity: (productId) =>
                set((state) => ({
                    quantities: {
                        ...state.quantities,
                        [productId]: Math.max((state.quantities[productId] || 0) - 1, 0),
                    },
                    items: state.quantities[productId] === 1
                        ? state.items.filter((item) => item._id !== productId)
                        : state.items,
                })),

            clearCart: () => set({ items: [], quantities: {} }),
        }),
        {
            name: "cart-storage", // Key for localStorage
            storage: createJSONStorage(() => localStorage),
        }
    )
);
