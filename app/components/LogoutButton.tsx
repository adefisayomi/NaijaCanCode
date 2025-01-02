import { Form, Link } from "@remix-run/react";
import { Button } from "./ui/button";




export default function LogoutButton () {
    return (
        <Link to="/logout">
            <Button variant='outline' size='sm'>
                Logout
            </Button>
        </Link>
    )
}