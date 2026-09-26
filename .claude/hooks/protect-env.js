// Blocks Claude from reading, editing or cat-ing real .env files (API keys live there).
// .env.example is allowed. Exit code 2 = block and tell Claude why.
let raw = "";
process.stdin.on("data", c => (raw += c)).on("end", () => {
  try {
    const { tool_name, tool_input = {} } = JSON.parse(raw);
    const secret = /(^|[\/\\\s"'])\.env(\.(?!example\b)[\w.-]+)?(?=$|[\s"'])/;
    const target = tool_name === "Bash" ? tool_input.command || "" : tool_input.file_path || "";
    if (secret.test(target)) {
      console.error("Blocked: .env files hold secret API keys. Use .env.example for variable names instead.");
      process.exit(2);
    }
  } catch {}
  process.exit(0);
});
