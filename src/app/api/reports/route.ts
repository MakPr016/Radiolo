import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { db } = await connectToDatabase()
    const reports = db.collection('reports')

    const doc = {
      type: body.type || 'radiology',
      title: body.title || null,
      patient: body.patient || null,
      fileName: body.fileName || null,
      size: body.size || 0,
      analysis: body.analysis || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await reports.insertOne(doc)

    return NextResponse.json({ id: result.insertedId.toString() })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
