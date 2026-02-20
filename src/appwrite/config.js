import { Client, Account, Databases } from "appwrite";

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);

export const DATABASE_ID = import.meta.env.VITE_DATABASE_ID;
export const LEADS_COLLECTION_ID =
  import.meta.env.VITE_LEADS_COLLECTION_ID;
  export const USER_PROFILE_COLLECTION_ID =
  import.meta.env.VITE_USER_PROFILE_COLLECTION_ID;