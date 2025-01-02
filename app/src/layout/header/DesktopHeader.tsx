import Logo from "~/components/Logo";
import SavingIndicator from "~/components/SavingIndicator";
import ToggleThemeMode from "~/components/ToggleThemeMode";
import UserMenu from "../UserMenu";
import { Button } from "~/components/ui/button";
import { Send } from "lucide-react";



export default function DesktopHeader () {
    return (
        <header className="w-full  py-3 px-4 sticky top-0 left-0 bg-background z-20 border-b border-muted">
            <div className="grid grid-cols-3 max-w-8xl mx-auto">
                <Logo />
                <span className="flex items-center justify-center gap-1">
                    <SavingIndicator /> | <ToggleThemeMode />
                </span>

                <span className="flex items-center justify-end gap-1">
                    <UserMenu />
                    <Button variant='destructive'>
                        Delete
                    </Button>

                    <Button className="flex items-center gap-2 group/deploy">
                        <Send className="w-4 h-4 group-hover/deploy:animate-bounce duration-700" />
                        Deploy & Submit
                    </Button>
                </span>
            </div>
        </header>
    )
}