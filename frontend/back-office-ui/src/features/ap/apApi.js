import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apApi = createApi({
  reducerPath: 'apApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1/ap',
    prepareHeaders: (headers) => {
      // Mocking the mandatory security header for the audit trail
      headers.set('X-Actor-Id', 'actor-pawlos-001');
      return headers;
    },
  }),
  tagTypes: ['AnnualPlan'],
  endpoints: (builder) => ({
    createPlan: builder.mutation({
      query: (newPlan) => ({
        url: '/plans',
        method: 'POST',
        body: newPlan,
      }),
      invalidatesTags: ['AnnualPlan'],
    }),
  }),
});

export const { useCreatePlanMutation } = apApi;
