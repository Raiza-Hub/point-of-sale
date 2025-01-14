import Image from "next/image";
import { Badge } from "./ui/badge";
import { categoryStyles, formatPrice } from "@/lib/utils";

interface MenuItemProps {
    name: string;
    price: number;
    image: string;
    category: string;
}


const PreviewItem = ({ name, price, image, category }: MenuItemProps) => {
    const styles = categoryStyles[category];

    return (
        <div className="flex flex-col gap-1 w-full  p-2 bg-white rounded-lg">
            <div className="relative flex justify-center items-center bg-[#f7f7f7] p-4 rounded-md">
                <Image
                    src={image}
                    alt={name}
                    className="h-24 w-24 object-cover object-center"
                    width={400}
                    height={400}
                    loading="eager"
                />
            </div>

            <p className="font-medium text-start truncate drop-shadow-sm">{name}</p>
            <div className="flex text-start">
                <span className="flex-1">
                    <Badge
                        variant="secondary"
                        className={`${styles.bg} ${styles.text} font-medium`}
                    >
                        {category}
                    </Badge>
                </span>
                <span className="font-semibold">{formatPrice(price)}</span>
            </div>
        </div>
    );
}

export default PreviewItem;
