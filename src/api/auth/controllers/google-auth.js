"use strict";

const {
  getService,
} = require("@strapi/plugin-users-permissions/server/utils");

module.exports = {
  async googleCallback(ctx) {
    const provider = "google";
    const frontendUrl =
      process.env.FRONTEND_URL ||
      "https://gachacity.xyz";

    try {
      const providerService =
        getService("providers");

      const { user, jwt } =
        await providerService.connect(
          provider,
          ctx.query,
        );

      if (!user || !jwt) {
        return ctx.redirect(
          `${frontendUrl}/auth/error`,
        );
      }

      const isProd =
        process.env.NODE_ENV === "production";

      ctx.cookies.set("gc_token", jwt, {
        httpOnly: true,
        secure: isProd, 
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        domain: ".gachacity.xyz", 
        path: "/",
      });

      return ctx.redirect(
        `${frontendUrl}/tai-khoan`,
      );
    } catch (err) {
      strapi.log.error("Google auth error:", err);
      return ctx.redirect(
        `${frontendUrl}/auth/error`,
      );
    }
  },
};
