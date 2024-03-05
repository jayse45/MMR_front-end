import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../react-query/constants";

import { getBodyParts } from "../api/bodyParts";

export function useBodyParts() {
  const { isLoading, data } = useQuery({
    queryKey: [queryKeys.bodyParts],
    queryFn: async () => getBodyParts(),
    staleTime: 3 * 60 * 1000,
  });

  //   console.log(isLoading, data);
  return { isLoading, data };
}
