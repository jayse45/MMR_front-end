import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../react-query/constants";

import { getExercises } from "../api/exercises";

export function useExercises(page, query, bodyPart) {
  const { isLoading, data } = useQuery({
    queryKey: [queryKeys.exercises, query, page, bodyPart],
    queryFn: async () => getExercises(page, query, bodyPart),
    staleTime: 3 * 60 * 1000,
  });

  //   console.log(isLoading, data);
  return { isLoading, data };
}
