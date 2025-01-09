import Image from 'next/image'
import { Button } from './ui/button';
import Link from 'next/link';

interface EmptyStateProps {
    title: string;
    search?: boolean;
    buttonLink?: string;
    buttonText?: string;
}

const EmptyState = ({ title, search, buttonLink, buttonText }: EmptyStateProps) => {
    return (
        <section className="max-w-7xl flex h-full flex-col items-center justify-center mx-auto space-y-1">
            <div
                ria-hidden='true'
                className="relative mt-8 h-64 w-64 text-muted-foreground"
            >
                <Image
                    src="/Empty-pana.svg"
                    fill
                    alt="empty state"
                    loading='eager'
                />
            </div>
            <div className="flex-center w-full max-w-[254px] flex-col gap-3">
                <h1 className="text-lg text-center font-medium text-white-1">{title}</h1>
                {search && (
                    <p className="text-sm text-center font-medium text-gray-500">Try adjusting your search to find what you are looking for</p>
                )}
                {buttonLink && (
                    <Button className="w-full mt-2">
                        <Link href={buttonLink} className="gap-1 flex">
                            <h1 className=" font-extrabold ">{buttonText}</h1>
                        </Link>
                    </Button>
                )}
            </div>
        </section>
    )
}

export default EmptyState