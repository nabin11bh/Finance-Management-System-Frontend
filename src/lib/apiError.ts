// Shape returned by our axiosBaseQuery on failure (see src/store/api/axiosBaseQuery.ts)
interface ApiErrorData {
  code?: string;
  message?: string;
}

interface RtkQueryError {
  status?: number;
  data?: ApiErrorData;
}

function isRtkQueryError(error: unknown): error is RtkQueryError {
  return typeof error === "object" && error !== null && "data" in error;
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (isRtkQueryError(error) && error.data?.message) {
    return error.data.message;
  }
  return fallback;
}