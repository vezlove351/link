export const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "login",
  "logout",
  "_next",
  "favicon.ico",
  "static",
  "public",
]);

export const SLUG_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;
