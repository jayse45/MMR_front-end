import AuthenticationManager from "./AuthenticationManager";
import NotificationManager from "./NotificationManager";

export default class FetchManager {
  static fetch({
    url,
    method = "GET",
    body = null,
    success_cb = null,
    failure_cb = null,
    prefetch_cb = () => {
      /*empty to prevent null calls*/
    },
    postfetch_cb = () => {
      /*empty to prevent null calls*/
    },
  }) {
    const options = {
      method,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "auth-token": AuthenticationManager.getUserToken(),
      },
    };

    if (body) options.body = JSON.stringify(body);
    prefetch_cb();
    fetch(url, options)
      .then((res) => res.json())
      .then((res) => {
        if (success_cb) {
          success_cb(res);
        }
      })
      .catch((err) => {
        console.log(err);
        if (failure_cb) {
          failure_cb(err);
        } else {
          NotificationManager.notifyUser({
            type: "error",
            message:
              "Failed to connect to server. Please check your internet connection and try again later.",
          });
        }
      })
      .finally((evt) => {
        postfetch_cb();
      });
  }

  static async asyncFetch({
    url,
    method = "GET",
    body = null,
    contentType = "application/json",
    failure_cb = null,
  }) {
    const options = {
      method,
      headers: {
        "Content-Type": contentType,
        "Auth-Token": AuthenticationManager.getUserToken(),
      },
    };

    if (body) options.body = JSON.stringify(body);

    try {
      return await fetch(url, options);
    } catch (err) {
      console.log(err);
      if (failure_cb) {
        failure_cb(err);
      } else {
        NotificationManager.notifyUser({
          type: "error",
          message:
            "Failed to connect to server. Please check your internet connection and try again later.",
        });
      }
    }
  }

  static async asyncFetchJSON({
    url,
    method = "GET",
    body = null,
    contentType = "application/json",
    failure_cb = null,
  }) {
    const options = {
      method,
      headers: {
        accept: "application/json",
        "content-type": contentType,
        "auth-token": AuthenticationManager.getUserToken(),
      },
    };

    if (body) options.body = JSON.stringify(body);

    try {
      const response = await fetch(url, options);
      return await response.json();
    } catch (err) {
      console.log(err);
      if (failure_cb) {
        failure_cb(err);
      } else {
        NotificationManager.notifyUser({
          type: "error",
          message:
            "Failed to connect to server. Please check your internet connection and try again later.",
        });
      }
    }
  }
}
