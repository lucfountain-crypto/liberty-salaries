export async function onRequestPost(context: { request: Request }) {
  try {
    const body: any = await context.request.json();
    const { name, contact, query, role, location, expTier, medianSalary, timestamp } = body;

    console.log("--- NEW LIBERTY SALARIES LEAD ---");
    console.log(`Name/Company: ${name}`);
    console.log(`Contact: ${contact}`);
    console.log(`Role: ${role}`);
    console.log(`Location: ${location}`);
    console.log(`Experience: ${expTier}`);
    console.log(`Median Benchmark: ${medianSalary}`);
    console.log(`Query: ${query}`);
    console.log(`Timestamp: ${timestamp}`);
    console.log("---------------------------------");

    return new Response(JSON.stringify({ success: true, message: "Lead received successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: "Invalid payload" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
