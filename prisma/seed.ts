import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Create admin user
  const adminPassword = await hash("admin123", 12)
  
  const admin = await prisma.user.upsert({
    where: { email: "admin@maxi-garagen.de" },
    update: {},
    create: {
      email: "admin@maxi-garagen.de",
      password: adminPassword,
      firstName: "Admin",
      lastName: "Maxi-Garagen",
      role: "admin",
    },
  })
  console.log("✅ Admin user created:", admin.email)

  // Create a demo tenant
  const tenantPassword = await hash("mieter123", 12)
  
  const tenant = await prisma.user.upsert({
    where: { email: "mieter@example.de" },
    update: {},
    create: {
      email: "mieter@example.de",
      password: tenantPassword,
      firstName: "Max",
      lastName: "Mustermann",
      role: "tenant",
      phone: "+49 170 1234567",
    },
  })
  console.log("✅ Demo tenant created:", tenant.email)

  // Create a demo property
  const property = await prisma.property.upsert({
    where: { id: "demo-property-1" },
    update: {},
    create: {
      id: "demo-property-1",
      name: "Garagenhof Musterstraße",
      address: "Musterstraße 123",
      city: "München",
      postalCode: "80331",
      description: "Moderner Garagenhof mit 20 Einheiten",
      totalUnits: 20,
    },
  })
  console.log("✅ Demo property created:", property.name)

  // Create demo units
  for (let i = 1; i <= 5; i++) {
    await prisma.unit.upsert({
      where: { 
        propertyId_unitNumber: {
          propertyId: property.id,
          unitNumber: `G${i.toString().padStart(2, '0')}`
        }
      },
      update: {},
      create: {
        propertyId: property.id,
        unitNumber: `G${i.toString().padStart(2, '0')}`,
        floor: 0,
        sizeSqm: 15,
        monthlyRent: 85,
        isOccupied: i === 1,
      },
    })
  }
  console.log("✅ Demo units created")

  // Create a contract for the demo tenant
  const unit = await prisma.unit.findFirst({
    where: { propertyId: property.id, unitNumber: "G01" }
  })

  if (unit) {
    await prisma.contract.upsert({
      where: { id: "demo-contract-1" },
      update: {},
      create: {
        id: "demo-contract-1",
        unitId: unit.id,
        tenantId: tenant.id,
        startDate: new Date("2024-01-01"),
        monthlyRent: 85,
        deposit: 255,
        status: "active",
      },
    })
    console.log("✅ Demo contract created")
  }

  console.log("")
  console.log("🎉 Seeding completed!")
  console.log("")
  console.log("📝 Login credentials:")
  console.log("   Admin:  admin@maxi-garagen.de / admin123")
  console.log("   Mieter: mieter@example.de / mieter123")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
