import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { redirect, useActionData, useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import { ArrowLeft } from "lucide-react";
import { authenticator } from "~/.server/authServices";
import { sessionStorage } from "~/.server/sessions";
import Logo from "~/components/Logo";
import { Button } from "~/components/ui/button";
import SignupForm from "~/src/sections/auth/SignupForm";

export const meta: MetaFunction = () => [
    { title: "Signin / create account" },
    { name: "description", content: "sign in or create a new account" },
  ];

export async function action({ request }: ActionFunctionArgs) {
    let account = await authenticator.authenticate("signin-form", request);
    if (!account.success) {
      return {account}
    }
  
    let session = await sessionStorage.getSession(request.headers.get("cookie"));
    session.set("account", account);
  
    const username = account.data.username
    return redirect(`/${username}/code`, {
      headers: { "Set-Cookie": await sessionStorage.commitSession(session) },
    });
  }
  

  export async function loader({ request }: LoaderFunctionArgs) {

    let session = await sessionStorage.getSession(request.headers.get("cookie"));
    let account = session.get("account");
    if (account && account.success && account.data) {
      const username = account.data.username || account.data.id
      return redirect(`/${username}/code`);
    }
    return {account};
  }


export default function Signin() {

  const navigate = useNavigate();
  const fetcher = useFetcher({key: 'signin-form'});

  return (
    <div className="w-full h-screen relative max-w-7xl mx-auto flex flex-col items-center p-2">
      <div className="md:grid md:grid-cols-3 flex flex-row-reverse justify-between py-4 items-center w-full sticky top-0 left-0">
        <Button variant="outline" className="" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 text-primary" />
        </Button>
        <span className="flex items-center md:justify-center ">
          <Logo />
        </span>
      </div>

      <div className="w-full flex-grow flex items-center justify-center flex-col">
        <div className="w-full max-w-md border rounded-xl p-8 flex flex-col gap-10 bg-background">
          <div className="w-full flex flex-col items-center gap-2 cursor-default">
            <h2 className="tracking-normal text-xl text-center text-primary font-bold">
              Sign-In / Create new account
            </h2>
            <p className="text-xs text-center text-muted-foreground">
              Lets get coding.
            </p>
          </div>

          <SignupForm fetcher={fetcher} />
        </div>
      </div>
    </div>
  );
}
