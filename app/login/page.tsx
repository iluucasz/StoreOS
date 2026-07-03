import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowRight, BarChart3, ShieldCheck, TrendingUp } from "lucide-react"
import { LoginForm } from "@/app/login/login-form"
import { getCurrentUser } from "@/lib/auth"

export default async function LoginPage() {
  const user = await getCurrentUser()
  if (user) redirect("/")

  return (
    <main className="min-h-screen bg-background px-4 py-6">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl overflow-hidden rounded-lg border bg-card shadow-sm lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden flex-col justify-between border-r bg-muted/30 p-8 lg:flex">
          <Link href="/" className="flex items-center gap-3 font-bold">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-sm">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </span>
            <span className="text-xl tracking-tight">StoreOS</span>
          </Link>

          <div className="max-w-lg">
            <p className="text-sm font-medium text-primary">Painel financeiro e operacional</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              Controle loja, margem e marketing em um painel mais limpo.
            </h1>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Entre para acompanhar produtos, pedidos, metas e campanhas com uma experiência mais organizada.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border bg-background p-4">
              <BarChart3 className="mb-3 h-5 w-5 text-primary" />
              <p className="text-sm font-semibold">Marketing</p>
              <p className="mt-1 text-xs text-muted-foreground">Ads e Analytics no mesmo fluxo.</p>
            </div>
            <div className="rounded-lg border bg-background p-4">
              <ShieldCheck className="mb-3 h-5 w-5 text-primary" />
              <p className="text-sm font-semibold">Operação</p>
              <p className="mt-1 text-xs text-muted-foreground">Produtos, pedidos e estoque.</p>
            </div>
            <div className="rounded-lg border bg-background p-4">
              <ArrowRight className="mb-3 h-5 w-5 text-primary" />
              <p className="text-sm font-semibold">Decisão</p>
              <p className="mt-1 text-xs text-muted-foreground">Dados prontos para agir.</p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-sm">
            <Link href="/" className="mb-8 flex items-center justify-center gap-2 font-bold lg:hidden">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-sm">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </span>
              <span className="text-2xl tracking-tight">StoreOS</span>
            </Link>

            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight">Bem-vindo de volta</h2>
              <p className="mt-1 text-sm text-muted-foreground">Acesse sua conta para continuar.</p>
            </div>

            <LoginForm />

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Não tem conta?{" "}
              <Link href="/signup" className="font-medium text-primary hover:underline">
                Criar conta
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
