import { Link } from "@remix-run/react";
import { IUser } from "~/.server/schemas/user";
import { Button } from "./ui/button";

type AccountData = {
  success: boolean;
  data: IUser | any; // Replace `any` with the actual type for `data` if known
};

export default function LogoutButton({account}: {account: AccountData}) {

  return (
    <>
      {account && account.success && account.data ? (
        <Link to="/logout">
          <Button variant="outline" size="sm">
            Logout
          </Button>
        </Link>
      ) : (
        <Link to="/signin">
          <Button size="sm">Signin</Button>
        </Link>
      )}
    </>
  );
}
