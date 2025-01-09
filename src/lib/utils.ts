import { clsx, type ClassValue } from "clsx"
import { Metadata } from 'next'
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(
  price: number | string,
  options: {
    currency?: "USD" | "EUR" | "GBP",
    notation?: Intl.NumberFormatOptions['notation']
  } = {}
) {
  const { currency = 'USD', notation = 'compact' } = options

  const numericPrice =
    typeof price === "string" ? parseFloat(price) : price
    
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation,
    maximumFractionDigits: 2,
  }).format(numericPrice)
}

export const categoryStyles: Record<string, { bg: string; text: string }> = {
  Pizza: { bg: "bg-red-50", text: "text-red-600" },
  Cookies: { bg: "bg-yellow-50", text: "text-yellow-600" },
  Burgers: { bg: "bg-green-50", text: "text-green-600" },
  Coffee: { bg: "bg-brown-50", text: "text-brown-600" },
  Dessert: { bg: "bg-purple-50", text: "text-purple-600" },
  Cake: { bg: "bg-pink-50", text: "text-pink-600" },
  Beverages: { bg: "bg-blue-50", text: "text-blue-600" },
};


export function constructMetadata({
  title = 'Novoski - the marketplace for food products',
  description = 'Novoski is an open-source marketplace for high-quality food products.',
  image = '/thumbnail.jpg',
  icons = '/icons/favicon.ico',
  noIndex = false,
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
  noIndex?: boolean
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@wisdom_adebola',
    },
    icons,
    metadataBase: new URL('https://digitalhippo.up.railway.app'),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  }
}