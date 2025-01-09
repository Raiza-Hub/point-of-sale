"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Icon } from "@phosphor-icons/react/dist/lib/types";
import { House, List, Plus, User } from "@phosphor-icons/react/dist/ssr";
import { SignedIn, SignedOut, SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image"
import { buttonVariants } from "./ui/button";

interface NavigationProps {
  name: string;
  icon: Icon;
  path: string;
}

const MobileNav = () => {
  const NAVIGATIONITEMS: NavigationProps[] = [
    {
      name: "Home",
      icon: House,
      path: "/",
    },
    {
      name: "Create Food Item",
      icon: Plus,
      path: "/create-item",
    },
    {
      name: "Profile",
      icon: User,
      path: "/profile",
    },
  ] as const;

  const { user } = useUser();

  return (
    <Sheet>
      <SheetTrigger className="group bg-white p-3 rounded-full">
        <List
          aria-hidden="true"
          className="w-5 h-5 text-gray-600 group-hover:text-primary"
        />
      </SheetTrigger>
      <SheetContent className="w-[300px] flex flex-col" side="left">
        <SheetHeader className="flex flex-col gap-4">
          <SheetTitle>
            <Link
              href="/"
              className="flex cursor-pointer items-center gap-1 "
            >
              <div className="relative h-20 w-20">
                <Image
                  src="/novoski-logo.png"
                  alt="logo"
                  fill
                  className="h-full w-full rounded-md object-cover object-center"
                />
              </div>
              <h1 className="text-xl font-semibold -ml-2 mt-2">Novoski</h1>
            </Link>
          </SheetTitle>
        </SheetHeader>

        <SheetClose asChild>
          <div className="flex-1 group mt-6 ">
            <ul className="space-y-4">
              {NAVIGATIONITEMS.map((item) => (
                <li key={item.name}>
                  <button className="flex items-center gap-3 w-full py-2 px-3 text-sm text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors">
                    <Link href={item.path} className="w-full flex gap-2">
                      <item.icon className="h-5 w-5 group-hover:text-gray-500" />
                      <p>{item.name}</p>
                    </Link>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </SheetClose>


        <div className='p-4'>
          <SignedIn>
            <div className="flex items-center gap-2">
              <UserButton />
              <SheetTitle className="text-gray-800 font-medium truncate">
                {user?.firstName} {user?.lastName}
              </SheetTitle>
            </div>
          </SignedIn>
        </div>

        <div className="mt-auto border-t p-4">
          <SignedIn>
            <div className="w-full text-center bg-red-400 text-white py-2 px-4 rounded-md hover:bg-red-500 transition">
              <SignOutButton>
                Sign out
              </SignOutButton>
            </div>
          </SignedIn>

          {/* Signed-Out View */}
          <div className="w-full">
            <SignedOut>
              <Link href="/sign-in" className={`${buttonVariants()} w-full text-center`}>
                Sign In
              </Link>
            </SignedOut>
          </div>
        </div>

      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
