const BASE_URL = "https://7005-77-222-237-236.ngrok-free.app";

async function runTests() {
  console.log("== Testing GET /strings ==");
  let res = await fetch(`${BASE_URL}/strings`);
  let data = await res.json();
  console.log("Initial strings:", data);

  console.log("\n== Testing POST /strings ==");
  const newValue = "from-test-script-" + Date.now();

  res = await fetch(`${BASE_URL}/strings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ value: newValue }),
  });

  data = await res.json();
  console.log("POST response:", data);

  console.log("\n== Testing GET /strings again ==");
  res = await fetch(`${BASE_URL}/strings`);
  data = await res.json();
  console.log("Final strings:", data);

  const found = data.includes(newValue);
  console.log(
    "\n== Result ==",
    found ? "✅ New value found" : "❌ New value NOT found"
  );
}

runTests().catch((err) => {
  console.error("Test script failed:", err);
  process.exit(1);
});
