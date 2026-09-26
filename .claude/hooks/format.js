// Auto-formats every file Claude edits with Prettier, so Claude never spends tokens fixing formatting.
const { execFileSync } = require("child_process");
let raw = "";
process.stdin.on("data", c => (raw += c)).on("end", () => {
  try {
    const file = JSON.parse(raw).tool_input?.file_path;
    if (file && /\.(tsx?|jsx?|css|json|md|mdx)$/.test(file)) {
      execFileSync("npx", ["--no-install", "prettier", "--write", file], {
        stdio: "ignore",
        shell: process.platform === "win32",
      });
    }
  } catch {}
  process.exit(0);
});
