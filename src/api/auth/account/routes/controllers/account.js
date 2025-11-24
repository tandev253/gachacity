module.exports = {
  async me(ctx) {
    const user = ctx.state.user; // lấy user từ JWT

    if (!user) {
      return ctx.unauthorized(
        "Not authenticated",
      );
    }

    const data =
      await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        user.id,
        {
          populate: ["loginHistory"],
        },
      );

    // map lại dữ liệu cho gọn, chỉ trả đúng những gì frontend cần
    return {
      username: data.username,
      email: data.email,
      createdAt: data.createdAt,
      level: data.level ?? 0,

      discord: data.discordId
        ? {
            id: data.discordId,
            username: data.discordUsername,
            avatarUrl: data.discordAvatarUrl,
          }
        : null,

      loginHistory: (data.loginHistory || []).map(
        (item) => ({
          time: item.time,
          ip: item.ip,
          device: item.device,
          status: item.loginStatus, // convert loginStatus -> status cho dễ dùng
        }),
      ),
    };
  },
};
