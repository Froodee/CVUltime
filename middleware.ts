import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

// Routes qui nécessitent une authentification
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Exclure les fichiers statiques et les ressources Next.js
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Toujours traiter les routes API et tRPC
    "/(api|trpc)(.*)",
  ],
}
