"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Building2, Loader2 } from "lucide-react"
import { processStripePayment, initiateBankTransfer } from "@/lib/actions/payments"
import { toast } from "sonner"

interface PaymentDialogProps {
  invoiceId: string
  amount: number
  invoiceNumber: string
}

export function PaymentDialog({ invoiceId, amount, invoiceNumber }: PaymentDialogProps) {
  const [open, setOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "bank">("stripe")
  const [isProcessing, setIsProcessing] = useState(false)

  async function handlePayment() {
    setIsProcessing(true)

    try {
      let result

      if (paymentMethod === "stripe") {
        // In production, this would integrate with Stripe Elements
        result = await processStripePayment(invoiceId, amount, "mock_payment_method_id")
      } else {
        result = await initiateBankTransfer(invoiceId, amount, {})
      }

      if (result.error) {
        throw new Error(result.error)
      }

      toast.success("Zahlung erfolgreich verarbeitet!")
      setOpen(false)
      window.location.reload()
    } catch (error) {
      console.error("[v0] Payment error:", error)
      toast.error("Zahlung fehlgeschlagen. Bitte versuchen Sie es erneut.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <CreditCard className="h-4 w-4" />
          Jetzt bezahlen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rechnung bezahlen</DialogTitle>
          <DialogDescription>
            Rechnung #{invoiceNumber} über {amount.toFixed(2)} €
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <Label>Zahlungsmethode wählen</Label>
            <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
              <div className="flex items-center space-x-3 rounded-lg border border-border/40 p-4 hover:bg-secondary/50">
                <RadioGroupItem value="stripe" id="stripe" />
                <Label htmlFor="stripe" className="flex flex-1 cursor-pointer items-center gap-3">
                  <div className="rounded-lg bg-primary/20 p-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Kreditkarte / Stripe</p>
                    <p className="text-sm text-muted-foreground">Sofortige Zahlung</p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-3 rounded-lg border border-border/40 p-4 hover:bg-secondary/50">
                <RadioGroupItem value="bank" id="bank" />
                <Label htmlFor="bank" className="flex flex-1 cursor-pointer items-center gap-3">
                  <div className="rounded-lg bg-primary/20 p-2">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Banküberweisung</p>
                    <p className="text-sm text-muted-foreground">1-3 Werktage</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="rounded-lg bg-secondary/30 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Zu zahlender Betrag</span>
              <span className="text-lg font-bold">{amount.toFixed(2)} €</span>
            </div>
          </div>

          <Button onClick={handlePayment} disabled={isProcessing} className="w-full">
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isProcessing ? "Wird verarbeitet..." : "Zahlung bestätigen"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
