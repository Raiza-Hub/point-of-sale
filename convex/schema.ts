import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
    products: defineTable({
        user: v.id('users'),
        name: v.string(),
        description: v.string(),
        price: v.number(),
        category: v.string(),
        imageUrl: v.string(),
        imageStorageId: v.id('_storage'),
        nutrition: v.optional(
            v.object({
                fat: v.string(),
                sugar: v.string(),
                salt: v.string(),
                calories: v.string(),
            })
        ),
    })
        .searchIndex('search_name', { searchField: 'name' })
        .searchIndex('search_category', {
            searchField: 'category',
            filterFields: ["name"]
        }),

    users: defineTable({
        email: v.string(),
        imageUrl: v.string(),
        clerkId: v.string(),
        name: v.string(),
    })
})