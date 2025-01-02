import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, redirect, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/.server/authServices";
import { deployCode } from "~/.server/controllers/deployToGit";
import { sessionStorage } from "~/.server/sessions";
import LogoutButton from "~/components/LogoutButton";

export const meta: MetaFunction = () => [
  { title: "User Management App" },
  { name: "description", content: "Manage users with Remix!" },
];

// export async function action ({request}: ActionFunctionArgs) {
//   if (request.method === 'POST') {
//     const res = await deployCode()
//     console.log(res)
//   }
//   return ({})
// }
export async function action({ request }: ActionFunctionArgs) {
  await authenticator.authenticate("github", request);
}

// export async function loader({ request }: LoaderFunctionArgs) {
//   let user = await authenticator.authenticate("github", request);
//   return user
// }


// export async function loader({ request }: LoaderFunctionArgs) {
//   let session = await sessionStorage.getSession(request.headers.get("cookie"));
//   let account = session.get("account");
//   return {account};
// }

export default function Index() {

  // const data = useLoaderData<typeof loader>()
  // console.log(data)

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6">
      <p className='para'>
        This a paragraph
      </p>
    </div>
  );
}
