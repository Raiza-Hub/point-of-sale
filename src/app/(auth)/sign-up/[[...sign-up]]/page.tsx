import { SignUp } from "@clerk/nextjs";


const Page = () => {
    return ( 
        <div className="w-full flex justify-center items-center h-screen">
            <SignUp />
        </div>
     );
}
 
export default Page;