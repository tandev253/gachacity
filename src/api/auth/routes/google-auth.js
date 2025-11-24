"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/auth/google/callback",
      handler: "google-auth.googleCallback",
      config: {
        auth: false,
      },
    },
  ],
};
