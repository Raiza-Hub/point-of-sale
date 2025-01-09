"use client"


import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    CurrencyDollarSimple,
    GoodreadsLogo,
    SpinnerGap
} from "@phosphor-icons/react/dist/ssr"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { useRouter, redirect } from "next/navigation"
import { useUser } from "@clerk/nextjs";

import { Id } from "../../../convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { fetchMutation } from "convex/nextjs"
import { api } from "../../../convex/_generated/api"




const FOODCATEGORIES = ["Pizza", "Cookies", "Burgers", "Coffee", "Dessert", "Cake", "Beverages"] as const

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Product Name must be at least 2 characters.",
    }),
    description: z.string()
        .min(2, { message: "Description must be at least 2 characters." })
        .max(250, { message: "Description must not exceed 250 characters." }),
    price: z
        .union([
            z.number().transform((val) => val.toString()), // Normalize to string
            z.string().regex(/^\d+(\.\d{1,2})?$/, {
                message: "Price must be a valid number with up to two decimal places.",
            }),
        ])
        .refine((value) => !isNaN(parseFloat(value)), {
            message: "Price must be a valid number.",
        }),

    nutrition: z.object({
        fat: z.string(),
        sugar: z.string(),
        salt: z.string(),
        calories: z.string(),
    }).optional(),
});



const Page = () => {
    const router = useRouter();
    const { toast } = useToast();
    const { user } = useUser();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [foodCategory, setFoodCategory] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false)


    const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(null);
    const [imageUrl, setImageUrl] = useState('');
    const imageRef = useRef<HTMLInputElement>(null);

    const getImageUrl = useMutation(api.product.getUrl);
    const createProduct = useMutation(api.product.createProduct);


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            price: "0",
            nutrition: {
                fat: "",
                sugar: "",
                salt: "",
                calories: "",
            },
        },
    });

    if (!user) {
        return redirect("/sign-in");
    }

    // const handleImage = async (blob: Blob, fileName: string) => {
    //     setIsImageLoading(true)
    //     setImageUrl('')

    //     try {
    //         const file = new File([blob], fileName, { type: 'image/*' });

    //         const uploaded = await startUpload([file]);

    //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //         const storageId = (uploaded[0].response as any).storageId;

    //         setImageStorageId(storageId);

    //         const imageUrl = await getImageUrl({ storageId });
    //         setImageUrl(imageUrl!);
    //         setIsImageLoading(false);
    //         toast({
    //             title: "Thumbnail uploadeed successfully",
    //         })

    //     } catch (error) {
    //         console.log(error)
    //         toast({ title: 'Error generating thumbnail', variant: 'destructive' })
    //     }
    // }


    // const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //     e.preventDefault();

    //     try {
    //         const files = e.target.files;
    //         if (!files) return;
    //         const file = files[0];
    //         const blob = await file.arrayBuffer()
    //             .then((ab) => new Blob([ab]));

    //         handleImage(blob, file.name);
    //     } catch (error) {
    //         console.log(error)
    //         toast({ title: 'Error uploading image', variant: 'destructive' })
    //     }
    // }


    const handleImageUplaod = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return;

        try {
            setIsUploading(true)

            const postUrl = await fetchMutation(api.files.generateUploadUrl)
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file
            })

            if (!result.ok) {
                throw new Error(`Upload failed: ${result.statusText}`)
            }

            const { storageId } = await result.json()

            const imageUrl = await getImageUrl({ storageId });

            if (imageUrl) {
                setImageStorageId(storageId)
                setImageUrl(imageUrl!);
                toast({
                    title: "Thumbnail uploadeed successfully",
                })
            }

        } catch (error) {
            console.log("Upload failed:", error);
            toast({ title: 'Failed to upload image. Please try again.', variant: 'destructive' })
        } finally {
            setIsUploading(false);
        }
    }


    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsSubmitting(true);
            if (!imageUrl) {
                toast({
                    title: 'Please upload image.',
                })
                setIsSubmitting(false);
                throw new Error('Please upload image.')
            }
            await createProduct({
                name: values.name,
                description: values.description,
                category: foodCategory,
                price: parseFloat(values.price),
                nutrition: values.nutrition,
                imageUrl,
                imageStorageId: imageStorageId!
            });
            toast({ title: 'Product created' })
            setIsSubmitting(false);
            router.push('/')

        } catch (error) {
            console.log(error);
            toast({
                title: 'Something went wrong.',
                variant: 'destructive',
            })
            setIsSubmitting(false);
        }
    }


    return (
        <div className="w-[486px] flex flex-col mx-auto mt-10">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="flex flex-col gap-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">Product Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="focus-visible:ring-primary"
                                            placeholder="Motil" {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className='flex flex-col gap-2.5'>
                            <Label className='font-bold'>Category</Label>

                            <Select onValueChange={(value) => setFoodCategory(value)} required>
                                <SelectTrigger className={cn('w-full border-none')}>
                                    <SelectValue className='placeholder' placeholder="Select Food Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {FOODCATEGORIES.map((category) => (
                                        <SelectItem
                                            key={category}
                                            value={category}
                                        >
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className="focus-visible:ring-primary"
                                            placeholder="Write a item description" {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">Price</FormLabel>
                                    <FormControl>
                                        <div className='relative border-b border-gray-300 rounded'>
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <CurrencyDollarSimple className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <Input
                                                type="number"
                                                className="focus-visible:ring-primary pl-10 pr-20"
                                                placeholder="0.00" {...field}
                                                inputMode="decimal"
                                                step="0.01"
                                                min="0"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="border-b border-gray-300 ">
                            <div className="space-y-2 mb-2">
                                <h2 className="font-bold">Nutritional Information{" "}{`(optional)`} </h2>
                                <p className="text-sm font-medium">Provide detailed nutritional values for the food item. These details help users make informed dietary decisions</p>
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="nutrition.fat"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">Fat</FormLabel>
                                    <FormControl>
                                        <div className='relative border-b border-gray-300 rounded'>
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <GoodreadsLogo
                                                    className="h-5 w-5 text-gray-400"
                                                />
                                            </div>
                                            <Input
                                                type="number"
                                                className="focus-visible:ring-primary pl-10 pr-20"
                                                placeholder="Enter fat content in grams" {...field}
                                                inputMode="decimal"
                                                step="0.01"
                                                min="0"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="nutrition.sugar"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">Sugar</FormLabel>
                                    <FormControl>
                                        <div className='relative border-b border-gray-300 rounded'>
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <GoodreadsLogo
                                                    className="h-5 w-5 text-gray-400"
                                                />
                                            </div>
                                            <Input
                                                type="number"
                                                className="focus-visible:ring-primary pl-10 pr-20"
                                                placeholder="Enter sugar content in grams"{...field}
                                                inputMode="decimal"
                                                step="0.01"
                                                min="0"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="nutrition.salt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">Salt</FormLabel>
                                    <FormControl>
                                        <div className='relative border-b border-gray-300 rounded'>
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <GoodreadsLogo
                                                    className="h-5 w-5 text-gray-400"
                                                />
                                            </div>
                                            <Input
                                                type="number"
                                                className="focus-visible:ring-primary pl-10 pr-20"
                                                placeholder="Enter salt content in grams" {...field}
                                                inputMode="decimal"
                                                step="0.01"
                                                min="0"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="nutrition.calories"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">Calories</FormLabel>
                                    <FormControl>
                                        <div className='relative border-b border-gray-300 rounded'>
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <GoodreadsLogo
                                                    className="h-5 w-5 text-gray-400"
                                                />
                                            </div>
                                            <Input
                                                type="number"
                                                className="focus-visible:ring-primary pl-10 pr-20"
                                                placeholder="Enter calories in kcal"
                                                {...field}
                                                inputMode="decimal"
                                                step="0.01"
                                                min="0"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex flex-col justify-center items-center p-8 cursor-pointer border  border-dashed border-gray-400 rounded-lg bg-white" onClick={() => imageRef.current?.click()}>
                        <Input
                            type="file"
                            className="hidden"
                            ref={imageRef}
                            onChange={handleImageUplaod}
                            disabled={isUploading}
                        />
                        {isUploading ? (
                            <div className="flex items-center">
                                <SpinnerGap className="w-5 h-5 animate-spin mr-2" />
                                Uploading
                            </div>
                        ) : (
                            <Image
                                src="/upload-image.svg"
                                alt="upload"
                                width={40}
                                height={40}

                            />
                        )}
                        <div className="flex flex-col items-center">
                            <h2 className="font-bold text-primary">
                                Click to upload
                            </h2>
                            <p className="text-sm font-normal">SVG, PNG, JPG, or GIF (max. 1080x1080px)</p>
                        </div>

                    </div>
                    {imageUrl && (
                        <div className="flex-center w-full">
                            <Image
                                src={imageUrl}
                                width={200}
                                height={200}
                                className="mt-5"
                                alt="thumbnail"
                            />
                        </div>
                    )}

                    <div className="w-full mt-1o">
                        <Button
                            className="w-full py-4 mb-6 font-extrabold text-white transition-all duration-500"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <SpinnerGap className="w-5 h-5 animate-spin mr-2" />
                                    Submitting
                                </>
                            ) : (
                                'Submit'
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default Page;