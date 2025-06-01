export const notfound = () => {
  throw new Response("Not Found", { status: 404 });
};
notfound.code = 404;

export const forbidden = () => {
  throw new Response("Forbidden", { status: 403 });
};
forbidden.code = 403;
