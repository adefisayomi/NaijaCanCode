import { createCookieSessionStorage } from "@remix-run/node"
import { createThemeSessionResolver } from "remix-themes"
import { SESSION_SECRET } from "~/src/constants";

const isProduction = process.env.NODE_ENV === "production"

export let sessionStorage = createCookieSessionStorage({
    cookie: {
      name: "_session", // use any name you want here
      sameSite: "lax", // this helps with CSRF
      path: "/", // remember to add this so the cookie will work in all routes
      httpOnly: true, // for security reasons, make this cookie http only
      secrets: [SESSION_SECRET], // replace this with an actual secret
      secure: isProduction
    },
  });
  
  export let { getSession, commitSession, destroySession } = sessionStorage;

export const themeSessionResolver = createThemeSessionResolver(sessionStorage)


