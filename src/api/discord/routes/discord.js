module.exports = {
  routes: [
    {
      method: "GET",
      path: "/auth/discord/login",
      handler: "discord.login",
      config: { auth: false },
    },
    {
      method: "GET",
      path: "/auth/discord/callback",
      handler: "discord.callback",
      config: { auth: false },
    },
  ],
};
