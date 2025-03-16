import { api } from "~/libs/api";
import { requireLoginLoader } from "~/modules/requireLoginLoader";

const setStatus = (requestURL: string) => {
  try {
    const query = new URL(requestURL).searchParams.get("status");
    if (query === "open" || query === "finished") {
      return query;
    }
  } catch {
    return;
  }
};

export const loader = requireLoginLoader(async ({ request }, user) => {
  const { data: opinions } = await api.GET("/opinions/histories", {
    headers: request.headers,
  });

  const { data: sessions } = await api.GET("/talksessions/opened", {
    headers: request.headers,
    params: {
      query: {
        status: setStatus(request.url),
      },
    },
  });
  console.log(sessions?.talkSessions, setStatus(request.url));

  return {
    user,
    opinions: opinions?.opinions,
    sessions: sessions?.talkSessions,
  };
});
