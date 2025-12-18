"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { createUser, updateUser } from "@/lib/actions/users"

interface UserFormProps {
  user?: {
    id: string
    email: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    role: string
  }
}

export function UserForm({ user }: UserFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const [email, setEmail] = useState(user?.email || "")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState(user?.firstName || "")
  const [lastName, setLastName] = useState(user?.lastName || "")
  const [phone, setPhone] = useState(user?.phone || "")
  const [role, setRole] = useState(user?.role || "janitor")

  const isEdit = !!user

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isEdit) {
        const result = await updateUser(user.id, {
          firstName: firstName || null,
          lastName: lastName || null,
          phone: phone || null,
          role: role as "admin" | "property_manager" | "janitor",
        })
        
        if (result.success) {
          toast.success("Benutzer aktualisiert")
          router.push("/admin/users")
          router.refresh()
        } else {
          toast.error(result.error || "Fehler beim Aktualisieren")
        }
      } else {
        if (!email || !password) {
          toast.error("E-Mail und Passwort sind erforderlich")
          setLoading(false)
          return
        }

        const result = await createUser({
          email,
          password,
          firstName: firstName || null,
          lastName: lastName || null,
          phone: phone || null,
          role: role as "admin" | "property_manager" | "janitor",
        })
        
        if (result.success) {
          toast.success("Benutzer erstellt")
          router.push("/admin/users")
          router.refresh()
        } else {
          toast.error(result.error || "Fehler beim Erstellen")
        }
      }
    } catch {
      toast.error("Ein Fehler ist aufgetreten")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Vorname</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Max"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nachname</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Mustermann"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-Mail *</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="benutzer@beispiel.de"
          disabled={isEdit}
          required={!isEdit}
        />
      </div>

      {!isEdit && (
        <div className="space-y-2">
          <Label htmlFor="password">Passwort *</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mindestens 6 Zeichen"
            required
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="phone">Telefon</Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+49 123 456789"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Rolle *</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger>
            <SelectValue placeholder="Rolle wählen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="property_manager">Verwalter</SelectItem>
            <SelectItem value="janitor">Hausmeister</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Abbrechen
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Speichern" : "Erstellen"}
        </Button>
      </div>
    </form>
  )
}
