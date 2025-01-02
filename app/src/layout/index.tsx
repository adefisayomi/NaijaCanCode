import { ReactNode } from "react";
import Header from "./header";
import Footer from "./footer";
import { cn } from "~/lib/utils";


interface LayoutProps {
    disableHeader?: boolean;
    disableFooter?: boolean;
    children: ReactNode;
    className?: string;
}

export default function Layout ({disableFooter, disableHeader, children, className}: LayoutProps) {
    return (
        <div className={cn('w-full min-h-screen flex flex-col relative', className)}>
            {!disableHeader && <Header />}
            {children}
            {!disableFooter && <Footer />}
        </div>
    )
}