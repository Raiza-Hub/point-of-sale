import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";


export const getUrl = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});


export const createProduct = mutation({
  args: {
    name: v.string(),         
    description: v.string(),       
    category: v.string(),         
    price: v.number(),           
    nutrition: v.optional(
      v.object({               
        fat: v.string(),
        sugar: v.string(),
        salt: v.string(),
        calories: v.string(),
      })
    ),
    imageUrl: v.string(),
    imageStorageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const user = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('email'), identity.email))
      .collect();
    
    if (!user) {
      throw new ConvexError("User not found");
    }

    const product = await ctx.db.insert('products', {
      ...args,
      user: user[0]._id,
    })
    return product;

  }
});

export const getAllProducts = query({
  handler: async (ctx) => {
    const products = await ctx.db.query('products').order("desc").collect();

    return products;
  }
});

export const getProductById = query({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.productId);
  },
});



export const getProductBySearch = query({
  args: {
    search: v.string(),
    category: v.string(),
    paginationOpts: paginationOptsValidator
  },
  handler: async (ctx, args) => {
    if (args.search === "" && args.category === "All Menu") {
      return await ctx.db
        .query("products")
        .order("desc")
        .paginate(args.paginationOpts);
    }

    if (args.category !== "All Menu") {
      return await ctx.db
        .query("products")
        .withSearchIndex("search_category", (q) => {
          let query = q.search("category", args.category); 
          if (args.search) {
            query = query.eq("name", args.search); 
          }
          
          return query;
        })
        .paginate(args.paginationOpts);
    }


    if (args.category === "All Menu") {
      const titleSearch = await ctx.db
        .query("products")
        .withSearchIndex("search_name", (q) =>
          q.search("name", args.search)
        )
        .paginate(args.paginationOpts);
      
      if (titleSearch.page.length > 0) {
        return titleSearch;
      }
    }

    return {
      results: [],
      page: [],
      isDone: true,
      continueCursor: "" ,
    };
  },
});



export const getCategoryItemCounts = query({
  handler: async (ctx) => {
    const categories = await ctx.db.query('products').collect();

    return categories.map(({ category }) => ({ category }));
  }
});


export const getProductByUserId = query({
  args: {
    userId: v.optional(v.string()),
    paginationOpts: paginationOptsValidator
  },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("user"), args.userId))
      .paginate(args.paginationOpts);

    return products;
  },
});


export const deleteProduct = mutation({
  args: {
    productId: v.id("products"),
    imageStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.productId);

    if (!podcast) {
      throw new ConvexError("Podcast not found");
    }

    await ctx.storage.delete(args.imageStorageId);
    return await ctx.db.delete(args.productId);
  },
});