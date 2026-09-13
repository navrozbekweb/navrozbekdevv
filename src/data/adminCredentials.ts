/**
 * Local (offline) admin credentials.
 * Used as a fallback when the app runs without a backend — e.g. after
 * downloading the project and running it locally in VS Code.
 * When Lovable Cloud is available, the password is verified server-side.
 */
export const localAdminCredentials = {
  username: "admin",
  password: "admin404",
};
