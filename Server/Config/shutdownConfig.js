import readline from "readline";

let shuttingDown = false;
let sigintPromptActive = false;

function waitForKeypress(promptText = "Press Y to confirm, N to cancel: ") {
  return new Promise((resolve) => {
    if (!process.stdin.isTTY) return resolve("y");
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(promptText, (answer) => {
      rl.close();
      resolve(answer ? answer.trim().toLowerCase() : "");
    });
  });
}

async function shutdownDB() {
  try {
    if (typeof globalThis.dbClose === "function") {
      await globalThis.dbClose();
    }
  } catch (err) {
    console.warn("⚠️ Error while closing DB:", err);
  }
}

async function doGracefulShutdown(signal, server) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
  if (server && server.listening) {
    server.close(async (err) => {
      if (err) {
        console.error("❌ Error while closing server:", err);
        await shutdownDB();
        process.exit(1);
      }
      await shutdownDB();
      console.log("✅ Graceful shutdown complete.");
      process.exit(0);
    });
  } else {
    await shutdownDB();
    console.log("✅ Graceful shutdown complete.");
    process.exit(0);
  }
  setTimeout(() => {
    console.error("⚠️ Forcing shutdown (timeout).");
    process.exit(1);
  }, 10_000).unref();
}

export function setupGracefulShutdown(server) {
  process.on("SIGINT", async () => {
    if (shuttingDown || sigintPromptActive) return;
    sigintPromptActive = true;
    try {
      const answer = await waitForKeypress(
        "\nAre you sure you want to exit? (Y/N): "
      );
      sigintPromptActive = false;
      if (answer === "y" || answer === "yes")
        await doGracefulShutdown("SIGINT", server);
      else console.log("Shutdown cancelled. Continuing to run.");
    } catch (err) {
      sigintPromptActive = false;
      await doGracefulShutdown("SIGINT", server);
    }
  });
  process.on("SIGTERM", () => {
    if (!shuttingDown) doGracefulShutdown("SIGTERM", server);
  });
  process.on("uncaughtException", (err) => {
    console.error("❌ Uncaught exception:", err);
    if (!shuttingDown) doGracefulShutdown("uncaughtException", server);
  });
  process.on("unhandledRejection", (reason) => {
    console.error("❌ Unhandled Rejection:", reason);
    if (!shuttingDown) doGracefulShutdown("unhandledRejection", server);
  });
}
