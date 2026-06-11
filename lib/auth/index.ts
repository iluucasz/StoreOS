import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { cache } from "react"
import { SESSION_COOKIE, validateSession } from "./session"

export type CurrentUser = {
  id: string
  email: string
  name: string
  image: string | null
}

/** Reads the session cookie and returns the user, or null. Cached per request. */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const store = await cookies()
  const signed = store.get(SESSION_COOKIE)?.value
  const result = await validateSession(signed)
  return result?.user ?? null
})

/** Returns the current user or redirects to /login. Use in server actions / pages. */
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser()
  if (!user) redirect("/login")
  return user
}

export { SESSION_COOKIE }
