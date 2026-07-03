import Link from "next/link"
import { redirect } from "next/navigation"
import { CheckCircle2, LineChart, Package, TrendingUp } from "lucide-react"
import { SignupForm } from "@/app/signup/signup-form"
import { getCurrentUser } from "@/lib/auth"

export default async function SignupPage() {
  const user = await getCurrentUser()
  if (user) redirect("/")

  return (
    <main className="min-h-screen bg-background px-4 py-6">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl overflow-hidden rounded-lg border bg-card shadow-sm lg:grid-cols-[0.95fr_1.05fr]">
        <section className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-sm">
            <Link href="/" className="mb-8 flex items-center justify-center gap-2 font-bold lg:hidden">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-sm">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </span>
              <span className="text-2xl tracking-tight">StoreOS</span>
            </Link>

            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight">Criar conta</h2>
              <p className="mt-1 text-sm text-muted-foreground">Comece com um painel pronto para organizar sua loja.</p>
            </div>

            <SignupForm />

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Já tem conta?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Entrar
              </Link>
            </p>
          </div>
        </section>

        <section className="hidden flex-col justify-between border-l bg-muted/30 p-8 lg:flex">
          <Link href="/" className="flex items-center gap-3 font-bold">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-sm">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </span>
            <span className="text-xl tracking-tight">StoreOS</span>
          </Link>

          <div className="max-w-lg">
            <p className="text-sm font-medium text-primary">Organização desde o primeiro acesso</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight">Monte sua base de produtos, metas e campanhas com clareza.</h1>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              O tema claro e escuro agora foi pensado para leitura diária, com menos ruído e estados de erro mais humanos.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border bg-background p-4">
              <Package className="mb-3 h-5 w-5 text-primary" />
              <p className="text-sm font-semibold">Catálogo</p>
              <p className="mt-1 text-xs text-muted-foreground">Produtos e estoque em ordem.</p>
            </div>
            <div className="rounded-lg border bg-background p-4">
              <LineChart className="mb-3 h-5 w-5 text-primary" />
              <p className="text-sm font-semibold">Métricas</p>
              <p className="mt-1 text-xs text-muted-foreground">Performance sem telas quebradas.</p>
            </div>
            <div className="rounded-lg border bg-background p-4">
              <CheckCircle2 className="mb-3 h-5 w-5 text-primary" />
              <p className="text-sm font-semibold">Fallbacks</p>
              <p className="mt-1 text-xs text-muted-foreground">Estados claros para falhas.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
