import { UrlHelper } from "../utils/UrlHelper";
import FetchManager from "../utils/FetchManager";
import NotificationManager from "../utils/NotificationManager";

const EXERCISES_URL = UrlHelper.createApiUrlPath("/api/exercises/paginate?");

export const getExercises = async (page, query, bodyPart) => {
  return await FetchManager.asyncFetchJSON({
    url: `${EXERCISES_URL}&query=${query}&page=${
      page - 1
    }&limit=10&bodyPart=${bodyPart}`,
    method: "GET",
  });
};
