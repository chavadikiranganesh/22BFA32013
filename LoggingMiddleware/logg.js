export async function logPackageMessage(message, level, pkg) {
  const stack = "frontend";
  const validLevels = ["debug", "info", "warn", "error", "fatal"];
  const validPackages = ["hook", "page", "state", "style"];

  if (!validLevels.includes(level)) {
    console.error("Invalid level");
    return;
  }

  if (!validPackages.includes(pkg)) {
    console.error("Invalid package for frontend");
    return;
  }

  const payload = {
    stack,
    level,
    package: pkg,
    message,
    timestamp: new Date().toISOString()
  };

  try {
    const response = await fetch("http://20.244.56.144/evaluation-service/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok) {
      console.log(" Log submitted. Log ID:", data.logId);
    } else {
      console.error(" API error:", data.message);
    }
  } catch (err) {
    console.error(" Network error:", err.message);
  }
}