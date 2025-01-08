import { CalendarDots, Clock } from "@phosphor-icons/react/dist/ssr";
import DayAndDate from "./Date";
import { Separator } from "./ui/separator";
import CurrentTime from "./Time";
import MobileNav from "./MobileNav";
import Cart from "./Cart";

const Navbar = () => {
    return (
        <nav className="w-full flex items-center gap-8 p-2">
            <MobileNav />

            <div className="hidden lg:flex items-center gap-4">
                <div className="flex items-center bg-white p-2 rounded-full">
                    <div className=" bg-primary-foreground rounded-full p-2 mr-2">
                        <CalendarDots className="text-primary" />
                    </div>
                    <DayAndDate />
                </div>
                <Separator className="w-3 " />
                <div className="flex items-center bg-white p-2 rounded-full">
                    <div className=" bg-primary-foreground rounded-full p-2 mr-2">
                        <Clock className="text-primary" />
                    </div>
                    <CurrentTime />
                </div>
            </div>


            <div className="ml-auto flow-root">
                <Cart />
            </div>

        </nav>
    );
}

export default Navbar;