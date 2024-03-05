import { UrlHelper } from "../utils/UrlHelper";
import FetchManager from "../utils/FetchManager";
import NotificationManager from "../utils/NotificationManager";

const BODY_PARTS_URL = UrlHelper.createApiUrlPath("/api/bodyParts");

export const getBodyParts = async () => {
  return await FetchManager.asyncFetchJSON({
    url: BODY_PARTS_URL,
  });
};
