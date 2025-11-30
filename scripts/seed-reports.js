#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' })
const mongoose = require('mongoose')

const uri = process.env.MONGODB_URI || process.env.NEXT_PUBLIC_MONGODB_URI
const dbName = process.env.MONGODB_DB || undefined

if (!uri) {
  console.error('Please set MONGODB_URI in your environment (e.g. .env.local)')
  process.exit(1)
}

async function main() {
  await mongoose.connect(uri, dbName ? { dbName } : undefined)

  const reportSchema = new mongoose.Schema({
    createdAt: { type: Date, default: Date.now },
    abnormal: { type: Boolean, default: false },
    size: { type: Number, default: 0 }, // bytes
    title: { type: String },
    patientId: { type: String },
  })

  const Report = mongoose.models.Report || mongoose.model('Report', reportSchema)

  // create sample documents
  const docs = []
  const now = Date.now()
  for (let i = 0; i < 50; i++) {
    const daysAgo = Math.floor(Math.random() * 30)
    const createdAt = new Date(now - daysAgo * 24 * 60 * 60 * 1000)
    docs.push({
      createdAt,
      abnormal: Math.random() < 0.12,
      size: Math.floor(Math.random() * 5 * 1024 * 1024) + 1024, // 1KB - ~5MB
      title: `Sample Report ${i + 1}`,
      patientId: `patient-${Math.ceil(Math.random() * 20)}`,
    })
  }

  const result = await Report.insertMany(docs)
  console.log(`Inserted ${result.length} sample reports.`)

  await mongoose.disconnect()
}

main().catch((err) => {
  console.error('Seeding error:', err)
  process.exit(1)
})
