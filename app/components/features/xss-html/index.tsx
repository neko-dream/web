import xss from "xss";
import "./index.css";

type Props = {
  html: string;
};

export const SanitizedHtml = ({ html }: Props) => {
  const sanitizedHtml = xss(html, {
    whiteList: {
      img: ["style", "src", "alt"],
      p: [],
      a: ["href", "target", "rel"],
      span: [],
    },
  });

  return (
    <article
      className="html"
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};
