import { Id } from "../../convex/_generated/dataModel";

// Define the type for a cart item, based on the products in your data model.
export type Item = {
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

