import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  databases,
  DATABASE_ID,
  LEADS_COLLECTION_ID,
  USER_PROFILE_COLLECTION_ID,
} from "../../appwrite/config";
import { Query } from "appwrite";

export const leadsApi = createApi({
  reducerPath: "leadsApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Leads", "Users"],

  endpoints: (builder) => ({
    // 🔥 GET LEADS (ROLE BASED)
    getLeads: builder.query({
      async queryFn(_, { getState }) {
        try {
          const state = getState();
          const currentUser = state.auth.user;

          let queries = [Query.orderDesc("$createdAt")];

          if (currentUser?.role === "user") {
            queries.push(Query.equal("assignedTo", currentUser.$id));
          }

          const response = await databases.listDocuments(
            DATABASE_ID,
            LEADS_COLLECTION_ID,
            queries,
          );

          return { data: response.documents };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ["Leads"],
    }),

    // 🔥 UPDATE STATUS
    updateLeadStatus: builder.mutation({
      async queryFn({ id, status }) {
        try {
          await databases.updateDocument(DATABASE_ID, LEADS_COLLECTION_ID, id, {
            status,
          });
          return { data: true };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Leads"],
    }),

    // 🔥 ASSIGN LEAD
    assignLead: builder.mutation({
      async queryFn({ id, userId }) {
        try {
          await databases.updateDocument(DATABASE_ID, LEADS_COLLECTION_ID, id, {
            assignedTo: userId,
          });
          return { data: true };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Leads"],
    }),

    // 🔥 GET USERS
    getUsers: builder.query({
      async queryFn() {
        try {
          const response = await databases.listDocuments(
            DATABASE_ID,
            USER_PROFILE_COLLECTION_ID,
          );
          return { data: response.documents };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ["Users"],
    }),

    // 🔥 CREATE USER PROFILE
    createUserProfile: builder.mutation({
      async queryFn(data) {
        try {
          await databases.createDocument(
            DATABASE_ID,
            USER_PROFILE_COLLECTION_ID,
            data.userId,
            data,
          );
          return { data: true };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Users"],
    }),

    // 🔥 UPDATE USER
    updateUserProfile: builder.mutation({
      async queryFn({ id, updates }) {
        try {
          await databases.updateDocument(
            DATABASE_ID,
            USER_PROFILE_COLLECTION_ID,
            id,
            updates,
          );
          return { data: true };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Users"],
    }),

    // 🔥 DELETE USER PROFILE
    deleteUserProfile: builder.mutation({
      async queryFn(id) {
        try {
          await databases.deleteDocument(
            DATABASE_ID,
            USER_PROFILE_COLLECTION_ID,
            id,
          );
          return { data: true };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Users"],
    }),

    // DELETE LEAD
    deleteLead: builder.mutation({
      async queryFn(id) {
        try {
          await databases.deleteDocument(DATABASE_ID, LEADS_COLLECTION_ID, id);
          return { data: true };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Leads"],
    }),
    // UPDATE LEAD DETAILS
updateLead: builder.mutation({
  async queryFn({ id, updates }) {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        LEADS_COLLECTION_ID,
        id,
        updates
      );
      return { data: true };
    } catch (error) {
      return { error };
    }
  },
  invalidatesTags: ["Leads"],
}),
  }),
});

export const {
  useGetLeadsQuery,
  useUpdateLeadStatusMutation,
  useAssignLeadMutation,
  useGetUsersQuery,
  useCreateUserProfileMutation,
  useUpdateUserProfileMutation,
  useDeleteUserProfileMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
  
} = leadsApi;
