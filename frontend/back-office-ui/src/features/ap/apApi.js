import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apApi = createApi({
  reducerPath: 'apApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/v1/backoffice/ap',
    prepareHeaders: (headers) => {
      // Hardcode process owner for Sprint 01 mock
      headers.set('X-Actor-Id', 'AP-PROCESS-OWNER-01');
      return headers;
    }
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
