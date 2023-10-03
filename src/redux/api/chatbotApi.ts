import { createApi } from "@reduxjs/toolkit/dist/query/react";
import customFetchBase from "./customFetchBase";
import { IChatbotInfo, IChatbotItem, IGenericResponse } from "./types";

export const chatbotApi = createApi({
  reducerPath: "chatbotApi",
  baseQuery: customFetchBase,
  endpoints: (builder) => ({
    createChatbot: builder.mutation<IGenericResponse, FormData>({
      query(data) {
        return {
          method: "POST",
          url: "/chatbots",
          body: data,
        };
      },
    }),
    getChatbots: builder.query<IChatbotItem[], void>({
      query() {
        return {
          url: "/chatbots",
        };
      },
      transformResponse: (result: { data: IChatbotItem[] }) => result.data,
    }),
    getChatbot: builder.query<IChatbotInfo, { slug: string }>({
      query({ slug }) {
        return {
          url: `/chatbots/${slug}`,
        };
      },
      transformResponse: (result: { data: IChatbotInfo }) => result.data,
    }),
    chat: builder.mutation<
      { msg: string; url: string },
      { slug: string; msg: { type: string; text: string }[] }
    >({
      query({ slug, msg }) {
        return {
          method: "POST",
          url: `/chatbots/${slug}/chat`,
          body: {
            msg,
          },
        };
      },
      transformResponse: (result: { data: { msg: string; url: string } }) =>
        result.data,
    }),
  }),
});

export const {
  useCreateChatbotMutation,
  useGetChatbotsQuery,
  useGetChatbotQuery,
  useChatMutation,
} = chatbotApi;
