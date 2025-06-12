
import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "/api/auth",
  plugins: [organizationClient()],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;

export const { 
  useActiveOrganization,
  useListOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization,
} = authClient.organization;
