import { DotsThree } from "@phosphor-icons/react";

interface Nutrition {
    fat: string;
    sugar: string;
    salt: string;
    calories: string;
}

interface NutritionProps {
    nutrition?: Nutrition; // Optional prop to allow undefined
}


const Nutrition = ({ nutrition }: NutritionProps) => {
    return ( 
        <div className="grid grid-cols-2 gap-2 text-sm">
            {/* Fat */}
            <div className="border rounded-md text-gray-700 font-bold px-6 py-1.5 shadow-inner flex items-center gap-1">
                Fat.
                {nutrition?.fat ? (
                    <span className="text-black">{nutrition.fat}g</span>
                ) : (
                    <DotsThree className='h-5 w-5' />
                )}
            </div>

            {/* Sugar */}
            <div className="border rounded-md text-gray-700 font-bold px-6 py-1.5 shadow-inner flex items-center gap-1">
                Sugar.
                {nutrition?.sugar ? (
                    <span className="text-black">{nutrition?.sugar}g</span>
                ) : (
                    <DotsThree className='h-5 w-5' />
                )}
            </div>

            {/* Salt */}
            <div className="border rounded-md text-gray-700 font-bold px-6 py-1.5 shadow-inner flex items-center gap-1">
                Salt.
                {nutrition?.salt  ? (
                    <span className="text-black">{nutrition?.salt }g</span>
                ) : (
                    <DotsThree className='h-5 w-5' />
                )}
            </div>

            {/* Calories */}
            <div className="border rounded-md text-gray-700 font-bold px-6 py-1.5 shadow-inner flex items-center gap-1">
                Calories.
                {nutrition?.calories ? (
                    <span className="text-black">{nutrition?.calories}kcal</span>
                ) : (
                    <DotsThree className='h-5 w-5' />
                )}
            </div>
        </div>
    );
}
 
export default Nutrition;