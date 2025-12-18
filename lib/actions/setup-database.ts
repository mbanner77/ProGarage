"use server"

import { prisma } from "@/lib/db"
import { hashPassword } from "@/lib/auth"

type StepCallback = (index: number, status: "running" | "success" | "error", message?: string) => void

export async function setupDatabase(onStep: StepCallback) {
  try {
    console.log("[v0] Setup database started")

    // Step 0: Check Database Connection
    onStep(0, "running")
    try {
      await prisma.$connect()
      onStep(0, "success", "Database connection established")
      console.log("[v0] Step 0 complete: Database connected")
    } catch (error: any) {
      console.error("[v0] Step 0 error:", error)
      onStep(0, "error", error.message)
      throw error
    }

    // Step 1: Clear Existing Data (optional for fresh start)
    onStep(1, "running")
    try {
      // Delete in correct order to respect foreign keys
      await prisma.payment.deleteMany()
      await prisma.message.deleteMany()
      await prisma.maintenanceRequest.deleteMany()
      await prisma.appointment.deleteMany()
      await prisma.invoice.deleteMany()
      await prisma.contract.deleteMany()
      await prisma.unit.deleteMany()
      await prisma.property.deleteMany()
      await prisma.quoteRequest.deleteMany()
      await prisma.user.deleteMany()

      onStep(1, "success", "Existing data cleared")
      console.log("[v0] Step 1 complete: Data cleared")
    } catch (error: any) {
      console.error("[v0] Step 1 error:", error)
      onStep(1, "error", error.message)
      throw error
    }

    // Step 2: Create Admin User
    onStep(2, "running")
    let adminUser
    try {
      console.log("[v0] Creating admin user...")

      const hashedPassword = await hashPassword("RealCore2025")

      adminUser = await prisma.user.create({
        data: {
          email: "admin@propmanage.de",
          password: hashedPassword,
          firstName: "Admin",
          lastName: "User",
          role: "admin",
        },
      })

      console.log("[v0] Admin user created, ID:", adminUser.id)
      onStep(2, "success", "Admin user created (admin@propmanage.de / RealCore2025)")
      console.log("[v0] Step 2 complete: Admin user")
    } catch (error: any) {
      console.error("[v0] Step 2 error:", error)
      onStep(2, "error", error.message)
      throw error
    }

    // Step 3: Create Demo Property Manager
    onStep(3, "running")
    let managerUser
    try {
      const hashedPassword = await hashPassword("Manager2025")

      managerUser = await prisma.user.create({
        data: {
          email: "manager@propmanage.de",
          password: hashedPassword,
          firstName: "Max",
          lastName: "Mustermann",
          role: "property_manager",
          phone: "+49 30 123456",
        },
      })

      onStep(3, "success", "Property Manager created (manager@propmanage.de / Manager2025)")
      console.log("[v0] Step 3 complete: Property Manager")
    } catch (error: any) {
      console.error("[v0] Step 3 error:", error)
      onStep(3, "error", error.message)
      throw error
    }

    // Step 4: Create Demo Property and Units
    onStep(4, "running")
    let demoProperty
    try {
      demoProperty = await prisma.property.create({
        data: {
          name: "Residenz am Park",
          address: "Parkstraße 123",
          city: "Berlin",
          postalCode: "10115",
          description: "Moderne Wohnanlage mit 12 Einheiten",
          totalUnits: 12,
          propertyManagerId: managerUser.id,
        },
      })

      // Create demo units
      await prisma.unit.createMany({
        data: [
          {
            propertyId: demoProperty.id,
            unitNumber: "1A",
            floor: 1,
            sizeSqm: 75.5,
            rooms: 3,
            monthlyRent: 1200.00,
            isOccupied: false,
          },
          {
            propertyId: demoProperty.id,
            unitNumber: "1B",
            floor: 1,
            sizeSqm: 85.0,
            rooms: 3.5,
            monthlyRent: 1400.00,
            isOccupied: false,
          },
          {
            propertyId: demoProperty.id,
            unitNumber: "2A",
            floor: 2,
            sizeSqm: 65.0,
            rooms: 2.5,
            monthlyRent: 1000.00,
            isOccupied: false,
          },
          {
            propertyId: demoProperty.id,
            unitNumber: "2B",
            floor: 2,
            sizeSqm: 90.0,
            rooms: 4,
            monthlyRent: 1500.00,
            isOccupied: false,
          },
        ],
      })

      onStep(4, "success", "Demo property and units created")
      console.log("[v0] Step 4 complete: Property and Units")
    } catch (error: any) {
      console.error("[v0] Step 4 error:", error)
      onStep(4, "error", error.message)
      throw error
    }

    // Step 5: Create Demo Tenant with Contract
    onStep(5, "running")
    try {
      const hashedPassword = await hashPassword("Tenant2025")

      const tenantUser = await prisma.user.create({
        data: {
          email: "tenant@propmanage.de",
          password: hashedPassword,
          firstName: "Maria",
          lastName: "Mieterin",
          role: "tenant",
          phone: "+49 30 987654",
        },
      })

      // Get first unit
      const unit = await prisma.unit.findFirst({
        where: { propertyId: demoProperty.id },
      })

      if (unit) {
        // Create contract
        await prisma.contract.create({
          data: {
            unitId: unit.id,
            tenantId: tenantUser.id,
            startDate: new Date("2024-01-01"),
            monthlyRent: Number(unit.monthlyRent),
            deposit: Number(unit.monthlyRent) * 3,
            status: "active",
          },
        })

        // Mark unit as occupied
        await prisma.unit.update({
          where: { id: unit.id },
          data: { isOccupied: true },
        })
      }

      onStep(5, "success", "Demo tenant created (tenant@propmanage.de / Tenant2025)")
      console.log("[v0] Step 5 complete: Tenant and Contract")
    } catch (error: any) {
      console.error("[v0] Step 5 error:", error)
      onStep(5, "error", error.message)
      throw error
    }

    return { success: true }
  } catch (error: any) {
    console.error("[v0] Setup database error:", error)
    return { success: false, error: error.message }
  } finally {
    await prisma.$disconnect()
  }
}

export async function checkDatabaseStatus() {
  try {
    await prisma.$connect()
    
    const userCount = await prisma.user.count()
    const propertyCount = await prisma.property.count()
    
    return {
      connected: true,
      hasData: userCount > 0,
      userCount,
      propertyCount,
    }
  } catch (error) {
    return {
      connected: false,
      hasData: false,
      userCount: 0,
      propertyCount: 0,
      error: String(error),
    }
  } finally {
    await prisma.$disconnect()
  }
}
