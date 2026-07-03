import { LoadingState } from "@/components/feedback-state"

export default function Loading() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      <LoadingState label="Carregando painel..." className="min-h-72" />
    </div>
  )
}
