module.exports = {
  routes: [
    {
      method: "GET",
      path: "/account/me",
      handler: "account.me",
      config: {
        auth: true, // bắt buộc phải có JWT
      },
    },
  ],
};
