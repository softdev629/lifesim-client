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
    getTranscript: builder.mutation<string, FormData>({
      query(data) {
        return {
          method: "POST",
          url: "/voices/transcript",
          body: data,
        };
      },
      transformResponse: (result: { data: string }) => result.data,
    }),
  }),
});

export const { useGetVoicesQuery, useGetTranscriptMutation } = voiceApi;
