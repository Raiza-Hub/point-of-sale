import { SignIn } from "@clerk/nextjs";


const Page = () => {
    return ( 
        <div className="w-full flex justify-center items-center h-screen">
            <SignIn />
        </div>
     );
}
 
export default Page;