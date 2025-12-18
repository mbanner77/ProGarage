"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface DownloadInvoiceButtonProps {
  invoiceId: string
  invoiceNumber: string
}

export function DownloadInvoiceButton({ invoiceId, invoiceNumber }: DownloadInvoiceButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/pdf`)
      
      if (!response.ok) {
        const data = await response.json()
        toast.error(data.error || "Fehler beim Herunterladen")
        return
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `Rechnung-${invoiceNumber}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success("PDF heruntergeladen")
    } catch (error) {
      toast.error("Ein Fehler ist aufgetreten")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="gap-2 bg-transparent" 
      onClick={handleDownload}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      PDF
    </Button>
  )
}
