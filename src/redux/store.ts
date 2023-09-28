import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux";

import { authApi } from "./api/authApi";
import { userApi } from "./api/userApi";
import { voiceApi } from "./api/voiceApi";
import { chatbotApi } from "./api/chatbotApi";

import userSlice from "./features/userSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [voiceApi.reducerPath]: voiceApi.reducer,
    [chatbotApi.reducerPath]: chatbotApi.reducer,
    userState: userSlice,
  },
  devTools: process.env.NODE_ENV === "development",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([
      authApi.middleware,
      userApi.middleware,
      voiceApi.middleware,
      chatbotApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
