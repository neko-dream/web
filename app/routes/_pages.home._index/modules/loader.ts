import { LoaderFunctionArgs } from "react-router";
import { api } from "~/libs/api";

const setStatus = (requestURL: string) => {
  try {
    const query = new URL(requestURL).searchParams.get("q");
    if (query === "open" || query === "finished") {
      return query;
    }
  } catch {
    return;
  }
};

const setSortKey = (requestURL: string) => {
  try {
    const query = new URL(requestURL).searchParams.get("sortKey");
    if (
      query === "latest" ||
      query === "oldest" ||
      query === "mostReplies" ||
      query === "nearest"
    ) {
      return query;
    }
  } catch {
    return;
  }

  return undefined;
};

const setTheme = (requestURL: string) => {
  try {
    const query = new URL(requestURL).searchParams.get("q");
    if (
      query !== "latest" &&
      query !== "oldest" &&
      query !== "mostReplies" &&
      query !== "open" &&
      query !== "finished"
    ) {
      return query;
    }
  } catch {
    return;
  }

  return undefined;
};

const setGeoLocation = (requestURL: string) => {
  try {
    const lat = new URL(requestURL).searchParams.get("lat");
    const lng = new URL(requestURL).searchParams.get("lng");
    if (lat && lng) {
      return {
        lat: Number(lat),
        lng: Number(lng),
      };
    }
  } catch {
    return;
  }

  return undefined;
};

export const loader = ({ request }: LoaderFunctionArgs) => {
  const $session = api
    .GET("/talksessions", {
      headers: request.headers,
      params: {
        query: {
          status: setStatus(request.url),
          sortKey: setSortKey(request.url),
          theme: setTheme(request.url),
          latitude: setGeoLocation(request.url)?.lat,
          longitude: setGeoLocation(request.url)?.lng,
        },
      },
    })
    .then((res) => res?.data || null);

  return { $session };
};
