import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const reports = db.collection('reports')

    const totalReports = await reports.countDocuments()

    const recentDate = new Date()
    // recent uploads in the last 7 days
    recentDate.setDate(recentDate.getDate() - 7)
    const recentUploads = await reports.countDocuments({ createdAt: { $gte: recentDate } })

    const abnormalFindings = await reports.countDocuments({ abnormal: true })

    const storageAgg = await reports
      .aggregate([
        { $group: { _id: null, totalSize: { $sum: '$size' } } },
      ])
      .toArray()

    const totalBytes = storageAgg[0]?.totalSize || 0
    const storageUsed = `${Math.round((totalBytes / (1024 * 1024)) * 10) / 10} MB`

    return NextResponse.json({
      totalReports,
      recentUploads,
      abnormalFindings,
      storageUsed,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: `DB error: ${message}` }, { status: 500 })
  }
}
