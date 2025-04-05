import type { components } from "~/types/openapi";

type Props = {
  timeline: components["schemas"]["actionItem"][];
};

export const Timeline = ({ timeline }: Props) => {
  return timeline.map((item, i) => {
    return (
      <div key={i}>
        <p>{item.Content}</p>
        <p>{item.Status}</p>
      </div>
    );
  });
};
