import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { ReactElement } from "react";
import { SocialsProvider } from 'remix-auth-socials';
import { Form } from "@remix-run/react";

type SocialProps = {
    type: 'google' | 'github';
    label: string,
    icon: ReactElement;
    provider: string;
}


export default function SocialAuth ({icon, label, provider}: SocialProps) {
    return (
        <Form action={`/auth/${provider}`} method="post">
            <Button 
                variant='outline'
                className={cn("h-11 capitalize w-full flex items-center gap-2 border-2")}
            >
                {icon} {label}
            </Button>
        </Form>
    );
}
