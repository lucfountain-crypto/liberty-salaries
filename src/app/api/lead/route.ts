import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, contact, query, role, location, expTier, medianSalary, timestamp } = body;

    console.log('--- NEW LIBERTY SALARIES LEAD ---');
    console.log(`Name/Company: ${name}`);
    console.log(`Contact: ${contact}`);
    console.log(`Role: ${role}`);
    console.log(`Location: ${location}`);
    console.log(`Experience: ${expTier}`);
    console.log(`Median Benchmark: ${medianSalary}`);
    console.log(`Query: ${query}`);
    console.log(`Timestamp: ${timestamp}`);
    console.log('---------------------------------');

    return NextResponse.json({ success: true, message: 'Lead received successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  }
}
