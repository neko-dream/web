import { FC } from "react";

import AutolinkPlugin from "./AutolinkPlugin";
import ClicakbleLink from "./ClickableLinkPlugin";
// import {
//   LinkPreviewDispatcher,
//   LinkPreviewRegister,
// } from "./LinkPreviewPlugin";

export { default as LinkToolbarItem } from "./LinkToolbarItem";
export { LinkPreviewNode } from "./LinkPreviewPlugin";

const Link: FC = () => {
  return (
    <>
      <ClicakbleLink />
      <AutolinkPlugin />
      {/* <LinkPreviewDispatcher />
      <LinkPreviewRegister /> */}
    </>
  );
};

export default Link;
