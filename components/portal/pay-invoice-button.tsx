"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CreditCard, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface PayInvoiceButtonProps {
  invoiceId: string
  disabled?: boolean
}

export function PayInvoiceButton({ invoiceId, disabled }: PayInvoiceButtonProps) {
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId }),
      })

      const data = await response.json()

      if (data.error) {
        toast.error(data.error)
        return
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      toast.error("Ein Fehler ist aufgetreten")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      size="sm" 
      className="gap-2" 
      onClick={handlePayment}
      disabled={loading || disabled}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <CreditCard className="h-4 w-4" />
      )}
      Jetzt bezahlen
    </Button>
  )
}
