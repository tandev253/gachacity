"use strict";
const axios = require("axios");

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;

// URL frontend (Gacha City) và Strapi, nên cấu hình bằng env
const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";
const STRAPI_PUBLIC_URL =
  process.env.STRAPI_PUBLIC_URL || "http://strapi.gachacity.xyz";

const REDIRECT_URI = `${STRAPI_PUBLIC_URL}/api/auth/discord/callback`;

module.exports = {
  // Bước 1: redirect sang OAuth Discord
  async login(ctx) {
    try {
      // JWT từ frontend gửi lên (để biết user nào)
      const token = ctx.query.token;
      if (!token) {
        return ctx.redirect(
          `${FRONTEND_URL}/tai-khoan?discord=failed`
        );
      }

      const url =
        "https://discord.com/oauth2/authorize?" +
        new URLSearchParams({
          client_id: DISCORD_CLIENT_ID,
          redirect_uri: REDIRECT_URI,
          response_type: "code",
          scope: "identify",
          // nhét JWT vào state, lát callback lấy ra
          state: token,
        }).toString();

      return ctx.redirect(url);
    } catch (err) {
      strapi.log.error("Discord login error", err);
      return ctx.redirect(
        `${FRONTEND_URL}/tai-khoan?discord=failed`
      );
    }
  },

  // Bước 2: Discord callback về đây
  async callback(ctx) {
    try {
      const code = ctx.query.code;
      const tokenFromState = ctx.query.state; // JWT từ bước login

      if (!code || !tokenFromState) {
        return ctx.redirect(
          `${FRONTEND_URL}/tai-khoan?discord=failed`
        );
      }

      // Xác thực JWT để lấy userId
      const decoded = await strapi
        .plugin("users-permissions")
        .service("jwt")
        .verify(tokenFromState);

      const userId = decoded.id;

      // 1) Lấy access token từ Discord
      const tokenRes = await axios.post(
        "https://discord.com/api/oauth2/token",
        new URLSearchParams({
          client_id: DISCORD_CLIENT_ID,
          client_secret: DISCORD_CLIENT_SECRET,
          grant_type: "authorization_code",
          code,
          redirect_uri: REDIRECT_URI,
        }),
        {
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
        }
      );

      const access_token = tokenRes.data.access_token;

      // 2) Lấy thông tin user từ Discord
      const userRes = await axios.get(
        "https://discord.com/api/users/@me",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      const discordUser = userRes.data;

      const avatarUrl = discordUser.avatar
        ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
        : null;

      // 3) Lưu vào bảng user
      await strapi.db
        .query("plugin::users-permissions.user")
        .update({
          where: { id: userId },
          data: {
            discord: {
              username: discordUser.username,
              discordId: discordUser.id,
              avatarUrl,
            },
          },
        });

      // 4) Redirect về AccountPage
      return ctx.redirect(
        `${FRONTEND_URL}/tai-khoan?discord=success`
      );
    } catch (err) {
      strapi.log.error("Discord callback error", err);
      return ctx.redirect(
        `${FRONTEND_URL}/tai-khoan?discord=failed`
      );
    }
  },
};
