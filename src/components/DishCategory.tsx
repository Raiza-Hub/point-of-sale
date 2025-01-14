"use client"

import {
    BeerBottle,
    Cake,
    CallBell,
    Cheese,
    Coffee,
    Cookie,
    DotsThree,
    Hamburger,
    Pizza
} from "@phosphor-icons/react/dist/ssr";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem
} from "@/components/ui/carousel";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Autoplay from "embla-carousel-autoplay"
import React from "react";
import { Icon } from "@phosphor-icons/react/dist/lib/types";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface Category {
    icon: Icon; 
    title: string;
}


const FOODCATEGORIES: Category[] = [
    {
        icon: CallBell,
        title: 'All Menu',
    },
    {
        icon: Pizza,
        title: 'Pizza',
    },
    {
        icon: Cookie,
        title: 'Cookies',
       
    },
    {
        icon: Hamburger,
        title: 'Burgers',
    },
    {
        icon: Coffee,
        title: 'Coffee',
       
    },
    {
        icon: Cheese,
        title: 'Dessert',
    },
    {
        icon: Cake,
        title: 'Cake',
    },
    {
        icon: BeerBottle,
        title: 'Beverages',
    },
];

export function Categories() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get("query");
    const categoryFromURL = searchParams.get("category") || "All Menu";

    const categoryItemCount = useQuery(api.product.getCategoryItemCounts);

    const [selectedCategory, setSelectedCategory] = useState<string>(categoryFromURL);

    const categoryClicked = (category: string) => {
        setSelectedCategory(category); 
        router.push(`/?category=${category}&query=${query}`);
    };

    const itemCount = FOODCATEGORIES.reduce((acc, category) => {
        acc[category.title] = categoryItemCount?.filter(item => item.category === category.title).length || 0;
        return acc;
    }, {} as Record<string, number>);

    const plugin = React.useRef(
        Autoplay({ delay: 3000, stopOnInteraction: true })
    )

    
    return (
        <Carousel
            plugins={[plugin.current]}
            opts={{
                align: "start",
            }}
            className="w-full md:max-w-7xl cursor-grabbing"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
        >
            <CarouselContent>
                {FOODCATEGORIES.map((category, index) => (
                    <CarouselItem
                        key={index}
                        onClick={() => categoryClicked(category.title)}
                        className="sm:basis-1/2 md:basis-1/3 lg:basis-1/5 cursor-pointer">
                        <div className="flex flex-col p-1 group select-none">
                            <Card
                                className={`p-4 ${selectedCategory === category.title
                                        ? "outline outline-primary bg-primary-foreground"
                                        : "hover:outline group-hover:outline-primary group-hover:bg-primary-foreground"
                                    }`}
                            >
                                <CardHeader
                                    className={`w-fit bg-[#f8f8f8] rounded-full transition-colors ${selectedCategory === category.title
                                            ? "bg-primary"
                                            : "group-hover:bg-primary"
                                        }`}
                                >
                                    <CardTitle>
                                        {
                                            <category.icon
                                                className={`w-5 h-5 text-[#b9b9b9] transition-colors ${selectedCategory === category.title
                                                        ? "text-white"
                                                        : "group-hover:text-white"
                                                    }`}
                                                aria-hidden='true'
                                            />
                                        }
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-start font-medium pt-4 px-0 pb-1">
                                    {category.title}
                                </CardContent>
                                <CardFooter className="p-0">
                                    <p className="text-sm text-[#a1a1a1]">
                                        {category.title === 'All Menu'
                                            ? categoryItemCount === undefined
                                                ? <DotsThree className="h-5 w-5 animate-pulse"  />
                                                : `${categoryItemCount?.length || 0} Items`
                                            : itemCount[category.title] === 0
                                                ? <DotsThree className="h-5 w-5 animate-pulse"  />
                                                : `${itemCount[category.title] } Items`
                                        }

                                    </p>
                                </CardFooter>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    );
}
