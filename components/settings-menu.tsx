"use client"

import { useState } from "react"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Settings as SettingsComponent } from "@/components/settings"

export function SettingsMenu() {
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <>
      <Button
        id="settings-trigger"
        variant="ghost"
        size="icon"
        className="hidden"
        onClick={() => setSettingsOpen(true)}
      >
        <Settings className="h-4 w-4" />
        <span className="sr-only">Configurações</span>
      </Button>

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Configurações</DialogTitle>
          </DialogHeader>
          <SettingsComponent />
        </DialogContent>
      </Dialog>
    </>
  )
}
