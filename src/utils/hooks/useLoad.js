import { useState } from "react";

export default function useLoad(initVal = false) {
  const [isLoading, setIsLoading] = useState(initVal);
  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);
  return { isLoading, startLoading, stopLoading };
}
