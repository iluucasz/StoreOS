"use client"

const contacts = [
  { id: "1", name: "Ana Lima", phone: "+55 11 91234-5678", optIn: true, lastContact: "2026-06-08", consent: "ativo" },
  { id: "2", name: "Carlos Mendes", phone: "+55 11 92345-6789", optIn: true, lastContact: "2026-06-07", consent: "ativo" },
  { id: "3", name: "Fernanda Costa", phone: "+55 11 93456-7890", optIn: false, lastContact: "2026-06-05", consent: "inativo" },
  { id: "4", name: "Mariana Santos", phone: "+55 11 94567-8901", optIn: true, lastContact: "2026-06-06", consent: "ativo" },
  { id: "5", name: "Roberto Alves", phone: "+55 11 95678-9012", optIn: true, lastContact: "2026-06-05", consent: "ativo" },
  { id: "6", name: "Beatriz Nunes", phone: "+55 11 99999-1234", optIn: false, lastContact: "2026-06-03", consent: "pendente" },
]

type Consent = "ativo" | "inativo" | "pendente"

const consentCfg: Record<Consent, { label: string; class: string }> = {
  ativo: { label: "Ativo", class: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" },
  inativo: { label: "Inativo", class: "bg-muted text-muted-foreground" },
  pendente: { label: "Pendente", class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
}

export function WhatsAppContacts() {
  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Nome</th>
            <th className="text-left px-3 py-2.5 font-medium text-muted-foreground hidden sm:table-cell">Telefone</th>
            <th className="text-center px-3 py-2.5 font-medium text-muted-foreground">Opt-in</th>
            <th className="text-left px-3 py-2.5 font-medium text-muted-foreground hidden md:table-cell">Último Contato</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Consentimento</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((c) => {
            const cfg = consentCfg[c.consent as Consent]
            return (
              <tr key={c.id} className="border-b border-border/50 hover:bg-muted/20">
                <td className="px-4 py-2.5 font-medium">{c.name}</td>
                <td className="px-3 py-2.5 text-muted-foreground font-mono text-xs hidden sm:table-cell">{c.phone}</td>
                <td className="px-3 py-2.5 text-center">
                  <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${c.optIn ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                    {c.optIn ? "✓" : "✗"}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-muted-foreground hidden md:table-cell">
                  {new Date(c.lastContact).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-4 py-2.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.class}`}>
                    {cfg.label}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
