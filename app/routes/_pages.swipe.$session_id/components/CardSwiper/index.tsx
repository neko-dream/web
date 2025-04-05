import { animated, to } from "@react-spring/web";
import { Card } from "~/components/Card";
import type { useSwipe } from "../../hooks/useSwipe.ts";

const trans = (r: number, s: number) =>
  `rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`;

type Props = ReturnType<typeof useSwipe>;

export default function CardSwiper(props: Props) {
  return props.item?.map(
    (
      {
        x,
        y,
        w,
        left,
        rot,
        scale,
        zIndex,
        backgroundColor,
        disagreeDisplay,
        agreeDisplay,
        opacity,
      },
      i,
    ) => {
      return (
        <animated.div
          className="absolute block touch-none will-change-transform"
          key={i}
          style={{
            x,
            y,
            width: w,
            left,
            zIndex,
          }}
        >
          <animated.div
            {...props.bind(i)}
            style={{ transform: to([rot, scale], trans) }}
            className="w-full"
          >
            {/* 重なり */}
            <animated.div
              style={{
                backgroundColor,
                display: disagreeDisplay,
                opacity,
              }}
              className="absolute z-10 h-full w-full rounded"
            />
            <animated.p
              style={{ display: disagreeDisplay }}
              className="absolute z-10 w-full select-none p-4 text-end font-bold text-2xl text-white"
            >
              違うかも
            </animated.p>

            <animated.div
              style={{
                backgroundColor,
                display: agreeDisplay,
                opacity,
              }}
              className="absolute z-10 h-full w-full rounded"
            />
            <animated.p
              style={{ display: agreeDisplay }}
              className="absolute z-10 w-full select-none p-4 font-bold text-2xl text-white"
            >
              いいかも
            </animated.p>

            <Card
              title={props.opinions[i].opinion.title || ""}
              description={props.opinions[i].opinion.content || ""}
              user={{
                displayID: "",
                displayName: props.opinions[i].user.displayName || "",
                iconURL: props.opinions[i].user.iconURL || "",
              }}
              date={"2025/12/31 10:00"}
              className="pointer-events-none select-none bg-white"
            />
          </animated.div>
        </animated.div>
      );
    },
  );
}
