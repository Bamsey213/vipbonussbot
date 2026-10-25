const { Bot, webhookCallback } = require("grammy");

// Initialize bot, token comes from Appwrite environment variables
const bot = new Bot(process.env.BOT_TOKEN);

// /start command
bot.command("start", async (ctx) => {
  await ctx.reply(
    `Welcome to VIP Bonus Bot! 🎁\n\nYour Telegram ID: ${ctx.from.id}\nUse /bonus to check your VIP rewards.`
  );
});

// /bonus command
bot.command("bonus", async (ctx) => {
  await ctx.reply("🎉 Your current VIP bonus: 100 points!\nStay tuned for more rewards.");
});

// Handle other text messages
bot.on("message:text", async (ctx) => {
  await ctx.reply(`Received: "${ctx.message.text}"\nType /start or /bonus to interact.`);
});

// Appwrite Function handler
module.exports = async function (context) {
  // Parse Telegram Update from request body
  const body = context.req.body;
  const update = typeof body === "string" ? JSON.parse(body) : body;

  // Use grammy's webhookCallback to process the update
  const handler = webhookCallback(bot, "std/http");

  // Construct a Request object to pass to grammy
  const request = new Request("https://localhost/webhook", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(update),
  });

  // Execute bot logic
  const response = await handler(request);

  // Return 200 to the proxy
  return context.res.json({ ok: true });
};
