import { createApi } from "@reduxjs/toolkit/dist/query/react";
import customFetchBase from "./customFetchBase";
import { IGenericResponse } from "./types";

export const chatbotApi = createApi({
  reducerPath: "chatbotApi",
  baseQuery: customFetchBase,
  endpoints: (builder) => ({
    createChatbotApi: builder.mutation<IGenericResponse, FormData>({
      query(data) {
        return {
          method: "POST",
          url: "/chatbots",
          body: data,
          // headers: {
          //   "Content-Type": "multipart/form-data",
          // },
        };
      },
    }),
  }),
});

export const { useCreateChatbotApiMutation } = chatbotApi;
