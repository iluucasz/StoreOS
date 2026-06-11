import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { SignupForm } from "./signup-form"
import { TrendingUp } from "lucide-react"

export default async function SignupPage() {
  const user = await getCurrentUser()
  if (user) redirect("/")

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-9 w-9 rounded-md bg-primary flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold tracking-tight">StoreOS</span>
        </div>
        <div className="bg-background border rounded-xl shadow-sm p-6">
          <h1 className="text-xl font-bold mb-1">Criar conta</h1>
          <p className="text-sm text-muted-foreground mb-6">Comece a gerenciar sua loja em uma só tela</p>
          <SignupForm />
        </div>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Já tem conta?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
