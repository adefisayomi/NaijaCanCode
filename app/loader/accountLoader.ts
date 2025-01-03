import { LoaderFunctionArgs } from "@remix-run/node";
import { sessionStorage } from "~/.server/sessions";

export async function accountLoader({ request }: LoaderFunctionArgs) {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const account = session.get("account");
  return { account };
}