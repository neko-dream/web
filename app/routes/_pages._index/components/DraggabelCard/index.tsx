import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { Card } from "../Card";

type Props = {
  top: string;
  left: string;
};

export default function DraggabelCard({ top, left }: Props) {
  const y = useMotionValue(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    // ビューポートの高さを取得
    setViewportHeight(window.innerHeight);

    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ビューポートの高さの80%まで移動して消える
  const opacity = useTransform(y, [0, -(viewportHeight * 0.8)], [1, 0]);

  animate(y, -(viewportHeight * 0.9), {
    duration: 10,
    ease: "easeOut",
    // repeat: Infinity,
    repeatDelay: 1,
    repeatType: "loop",
    onRepeat: () => {
      console.log("onRepeat");
    },
    // onUpdate: console.log,
  });

  return (
    <>
      <motion.div
        dragConstraints={{
          top: -(viewportHeight * 0.9), // ビューポートの90%まで上にドラッグ可能
          bottom: viewportHeight * 0.3, // ビューポートの30%まで下にドラッグ可能
        }}
        style={{
          y,
          opacity,
          touchAction: "none",
          top,
          left,
        }}
        className="fixed -z-10 -translate-x-1/2 cursor-grab active:cursor-grabbing"
      >
        <Card
          description="つつじ祭りとやると楽しそう？"
          user={{
            displayID: "#",
            iconURL:
              "https://avatars.githubusercontent.com/u/135724197?v=4&size=64",
            displayName: "mizdra",
          }}
          date="2021/08/02"
          className="w-80 scale-75 shadow-md"
        />
      </motion.div>
    </>
  );
}
