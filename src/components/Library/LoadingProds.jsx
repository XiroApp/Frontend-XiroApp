import { CircularProgress } from "@mui/material";

export default function LoadingProds() {
  return (
    <div className="flex justify-center items-center pt-16 w-full min-h-20">
      <CircularProgress color="primary" size={50} />
    </div>
  );
}
