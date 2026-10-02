const API_URL = "http://127.0.0.1:8000";

export async function askSafetyAgent(message, zone = "") {
  const response = await fetch(
    `${API_URL}/api/safety-agent/chat`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        message,
        zone: zone || null,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Safety Agent request failed: ${response.status}`
    );
  }

  return response.json();
}