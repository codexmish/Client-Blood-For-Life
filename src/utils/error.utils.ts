// -----backend error message (ofetch keeps it in err.data)
export const errorMessage = (err: unknown) =>
  (err as { data?: { message?: string } }).data?.message ??
  "Something Went Wrong";
