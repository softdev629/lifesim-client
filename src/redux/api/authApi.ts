import { createApi } from "@reduxjs/toolkit/query/react";
import customFetchBase from "./customFetchBase";
import { IGenericResponse } from "./types";
// import { LoginUserSchema } from "../../pages/login.page";
// import { userApi } from "./userApi";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: customFetchBase,
  endpoints: (builder) => ({
    // loginUser: builder.mutation<IGenericResponse, LoginUserSchema>({
    //   query(data) {
    //     return {
    //       method: "POST",
    //       url: "/auth/login",
    //       body: data,
    //       credentials: "include",
    //     };
    //   },
    //   async onQueryStarted(args, { dispatch, queryFulfilled }) {
    //     try {
    //       await queryFulfilled;
    //       await dispatch(userApi.endpoints.getMe.initiate(null));
    //     } catch (error) {}
    //   },
    // }),
    logoutUser: builder.mutation<IGenericResponse, void>({
      query(data) {
        return {
          url: "/auth/logout",
          credentials: "include",
        };
      },
    }),
  }),
});

export const { /* useLoginUserMutation, */ useLogoutUserMutation } = authApi;
