import { ActionFunctionArgs } from "@remix-run/node";
import { sessionStorage } from "~/.server/sessions";
import { redirect } from "@remix-run/node";


export async function loader({ request }: ActionFunctionArgs) {
    let session = await sessionStorage.getSession(request.headers.get("cookie"));
    return redirect("/signin", {
      headers: { "Set-Cookie": await sessionStorage.destroySession(session) },
    });
  }