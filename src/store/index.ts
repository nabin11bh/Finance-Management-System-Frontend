import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import { authApi } from "./api/authApi";
import { categoryApi } from "./api/categoryApi";
import { incomeApi } from "./api/incomeApi";
import { expenseApi } from "./api/expenseApi";
import { dashboardApi } from "./api/dashboardApi";
import { noteApi } from "./api/noteApi";
import { reminderApi } from "./api/reminderApi";
import { attachmentApi } from "./api/attachmentApi";
import { auditApi } from "./api/auditApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [incomeApi.reducerPath]: incomeApi.reducer,
    [expenseApi.reducerPath]: expenseApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [noteApi.reducerPath]: noteApi.reducer,
    [reminderApi.reducerPath]: reminderApi.reducer,
    [attachmentApi.reducerPath]: attachmentApi.reducer,
    [auditApi.reducerPath]: auditApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      categoryApi.middleware,
      incomeApi.middleware,
      expenseApi.middleware,
      dashboardApi.middleware,
      noteApi.middleware,
      reminderApi.middleware,
      attachmentApi.middleware,
      auditApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;