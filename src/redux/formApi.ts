import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const formApi = createApi({
  reducerPath: "formApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/" }),
  endpoints: (builder) => ({
    getFormConfig: builder.query({
      query: () => "form",
    }),
  }),
});

export const { useGetFormConfigQuery } = formApi;
