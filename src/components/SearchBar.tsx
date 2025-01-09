"use client"

import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";

const SearchBar = () => {

    const inputRef = useRef<HTMLInputElement>(null);
    const [isSearching, startTransition] = useTransition();
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [query, setQuery] = useState<string>('');

    const category = searchParams.get('category');
    const debouncedValue = useDebounce(query, 500);

    const search = useCallback(() => {
        startTransition(() => {
            router.push(`/?category=${category}&query=${debouncedValue}`)
        })
    }, [category, debouncedValue, router])


    useEffect(() => {
        if (debouncedValue) {
            search();
        } else if (category && !debouncedValue) {
            search();
        } else if (!debouncedValue && pathname === '/') router.push('/');
    }, [router, pathname, debouncedValue, search, category])


    return (
        <div className="relative w-full flex flex-col rounded-full">
            <div className="relative z-10 rounded-full">
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            search()
                        }

                        if (e.key === "Escape") {
                            inputRef?.current?.blur()
                        }
                    }}
                    ref={inputRef}
                    className="absolute inset-0  p-6 rounded-full border-none"
                />


                <Button
                    size='sm'
                    onClick={search}
                    disabled={isSearching}
                    className="absolute right-2 inset-y-1.5 rounded-full bg-[#f8f8f8]"
                    aria-label="search button"
                >
                    <MagnifyingGlass className="w-5 h-5 text-black" />
                </Button>
            </div>
        </div>
    );
}

export default SearchBar;
