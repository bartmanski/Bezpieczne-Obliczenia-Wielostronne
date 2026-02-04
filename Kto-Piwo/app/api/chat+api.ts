// We use a simple in-memory array for this demo. 
// In a real app, you would replace this with a database call.
let messages: { id: string; text: string; sender: string; createdAt: number }[] = [];

export function GET(request: Request) {
  // Return the list of messages as JSON
  return Response.json(messages);
}

export async function POST(request: Request) {
  const body = await request.json();
  
  if (!body.text || !body.sender) {
    return Response.json({ error: "Missing text or sender" }, { status: 400 });
  }

  const newMessage = {
    id: Date.now().toString(),
    text: body.text,
    sender: body.sender,
    createdAt: Date.now(),
  };

  messages.push(newMessage);

  // Keep only the last 50 messages to save memory
  if (messages.length > 50) {
    messages = messages.slice(-50);
  }

  return Response.json(newMessage);
}
