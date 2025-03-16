import { useState } from "react";
import { useSprings } from "react-spring";
import { useDrag } from "react-use-gesture";
import { OpinionType } from "~/feature/opinion/types";
import { components } from "~/libs/api/openapi";
import { animations } from "../libs/animations";

type OnSwipeParam = {
  opinionID: string;
  opinionStatus: OpinionType;
};

type Props = {
  opinions: {
    opinion: components["schemas"]["opinion"];
    user: components["schemas"]["user"];
    replyCount: number;
  }[];
  onSwipe: ({ opinionID, opinionStatus }: OnSwipeParam) => void;
};

export const useSwipe = ({ opinions, onSwipe }: Props) => {
  const [gone] = useState(() => new Set<number>());

  const [item, api] = useSprings(opinions.length, (i) => ({
    ...animations.to(),
    y: i,
    delay: i,
    from: animations.from(),
  }));

  const bind = useDrag(
    ({ args: [index], down, movement: [mx, my], velocity }) => {
      const trigger = velocity > 0.1;
      // MEMO: 閾値を超えたらスワイプしたとみなす
      const xdir = mx > 100 ? 1 : mx < -100 ? -1 : 0;
      const ydir = my > 100 ? 1 : my < -100 ? -1 : 0;

      // MEMO: スワイプしたカードをコールバックに渡す
      if (!down && trigger) {
        const opinionID = opinions[opinions.length - gone.size - 1].opinion.id;
        if (xdir >= 1) {
          onSwipe({ opinionID, opinionStatus: "agree" });
        } else if (xdir <= -1) {
          onSwipe({ opinionID, opinionStatus: "disagree" });
        }
        if (ydir >= 1) {
          onSwipe({ opinionID, opinionStatus: "pass" });
        }
      }

      // MEMO: ydir || xidr が 0 でない場合はどこかにスワイプしている
      if (!down && trigger && (ydir !== 0 || xdir !== 0)) {
        if (ydir !== -1) {
          gone.add(index);
        }
      }

      api.start((i) => {
        if (i !== index) return;

        const isGone = gone.has(index);
        // MEMO: スワイプしたカードの位置を計算
        const x = isGone ? (200 + window.innerWidth) * xdir : down ? mx : 0;
        const y = isGone ? (200 + window.innerHeight) * ydir : down ? my : 0;
        const rot = down ? mx / 100 + (isGone ? xdir * 10 * velocity : 0) : 0;

        const config = {
          friction: 50,
          tension: down ? 800 : isGone ? 200 : 500,
        };

        // 透かし
        let backgroundColor = x > 10 ? "blue" : x < -10 ? "red" : "transparent";
        backgroundColor = y < -100 ? "transparent" : backgroundColor;
        const opacity = x > 10 ? mx / 400 : x < -10 ? -mx / 400 : 0;

        return {
          ...animations.init(),
          y,
          x,
          rot,
          backgroundColor,
          opacity,
          agreeDisplay: x > 10 && y > -100 ? "block" : "none",
          disagreeDisplay: x < -10 ? "block" : "none",
          zIndex: down ? 100 : 0,
          config,
        };
      });
    },
  );

  return {
    gone,
    item,
    api,
    bind,
    opinions,
  };
};
