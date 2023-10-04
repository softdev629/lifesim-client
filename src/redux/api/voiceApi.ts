import { createApi } from "@reduxjs/toolkit/dist/query/react";
import customFetchBase from "./customFetchBase";

export const voiceApi = createApi({
  reducerPath: "voiceApi",
  baseQuery: customFetchBase,
  endpoints: (builder) => ({
    getVoices: builder.query<Array<Object>, void>({
      query() {
        return {
          url: "/voices",
        };
      },
      transformResponse: (result: { voices: Array<Object> }) => result.voices,
    }),
  }),
});

export const { useGetVoicesQuery } = voiceApi;
