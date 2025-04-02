import { ComponentProps, Fragment, useCallback } from "react";
import { tv } from "tailwind-variants";

const graph = tv({
  base: "h-60 w-full bg-blue-300",
});

export const Graph = ({ className, ...props }: ComponentProps<"div">) => {
  return <div {...props} className={graph({ className })} />;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import "@pixi/events";
import * as PIXI from "pixi.js";
import { Graphics as PixiGraphics } from "@pixi/graphics";
import { TextStyle } from "@pixi/text";
// import { Texture } from "@pixi/core";
import { Stage, Graphics, Sprite, Text } from "@pixi/react";

// const colorList = [0xff453a, 0xffd60a, 0xbf5af2, 0x30d158];
const colorList = [
  0xf03e3e, 0x862e9c, 0xfd7e14, 0x38d9a9, 0xfab005, 0xa9e34b, 0xf783ac,
  0x4263eb, 0x4dabf7,
];

const groupNames = Array.from({ length: 8 }, (_, i) =>
  String.fromCharCode(65 + i),
);
const backgroundColor = 0xf2f2f7;
const axisColor = 0xe5e5ea;

const paddingX = 30;
const paddingY = 25;

type PolygonPoints = {
  x: number;
  y: number;
}[];

type GroupPolygon = {
  points: PolygonPoints;
  flatPoints: number[];
  groupId: string;
}[];

const Axes = ({
  width,
  height,
  xLength,
  yLength,
  color = 0x000000,
  thickness = 2,
}: {
  width: number;
  height: number;
  xLength: number;
  yLength: number;
  color: number;
  thickness: number;
}) => {
  const drawAxes = useCallback(
    (g: {
      clear: () => void;
      lineStyle: (arg0: number, arg1: number) => void;
      moveTo: (arg0: number, arg1: number) => void;
      lineTo: (arg0: number, arg1: number) => void;
    }) => {
      g.clear();
      g.lineStyle(thickness, color);

      // X軸
      g.moveTo(0, height / 2);
      g.lineTo(xLength, height / 2);

      // Y軸
      g.moveTo(width / 2, 0);
      g.lineTo(width / 2, yLength);
    },
    [width, height, xLength, yLength, color, thickness],
  );

  return <Graphics draw={drawAxes} />;
};

const DotPlot = ({
  polygons,
  selectGroupId,
}: {
  polygons: any;
  selectGroupId: any;
}) => {
  const drawPolygon = (
    g: {
      beginFill: (arg0: number, arg1: number) => void;
      drawPolygon: (arg0: any) => void;
      endFill: () => void;
    },
    points: any,
    colorIdx: any,
  ) => {
    g.beginFill(colorList[colorIdx], 1); // 色と透明度
    g.drawPolygon(points);
    g.endFill();
  };

  return polygons.map((polygon: any, i: number) => {
    const draw = (g: {
      clear?: any;
      beginFill: (arg0: number) => void;
      drawCircle: (arg0: any, arg1: any, arg2: number) => void;
      drawPolygon: (arg0: any) => void;
      endFill: () => void;
      moveTo: (arg0: any, arg1: any) => void;
      lineTo: (arg0: any, arg1: any) => void;
      quadraticCurveTo: (arg0: any, arg1: any, arg2: any, arg3: any) => void;
      closePath: () => void;
    }) => {
      g.clear();

      drawPolygon(g, polygon.flatPoints, polygon.groupId);
    };

    return (
      // eslint-disable-next-line react/jsx-key
      <Graphics
        key={i}
        pointerdown={() => {
          selectGroupId(polygon.groupId);
        }}
        // interactive={true}
        eventMode="static"
        draw={draw}
      />
    );
  });
};

// グループポリゴンを生成
const PolygonPlot = ({
  polygons,
  selectGroupId,
}: {
  polygons: GroupPolygon;
  selectGroupId: any;
}) => {
  // const drawPolygon = (
  //   g: {
  //     beginFill: (arg0: number, arg1: number) => void;
  //     drawPolygon: (arg0: any) => void;
  //     endFill: () => void;
  //   },
  //   points: any,
  //   colorIdx: any,
  // ) => {
  //   g.beginFill(colorList[colorIdx], 1); // 色と透明度
  //   g.drawPolygon(points);
  //   g.endFill();
  // };

  return polygons.map((polygon: GroupPolygon[0], i: number) => {
    return (
      <RoundedPolygon
        key={i}
        color={colorList[Number(polygon.groupId)]}
        points={polygon.points}
        groupid={0}
        selectGroupId={undefined}
      ></RoundedPolygon>
    );
  });
};

// グループ長方体を生成
const RectPlot = ({ differentPoints }: { differentPoints: any }) => {
  return differentPoints.map((differentPoint: any, i: any) => {
    const x = differentPoint.firstPoint.x - differentPoint.secondPoint.x;
    const y = differentPoint.firstPoint.y - differentPoint.secondPoint.y;
    const rotation = Math.atan2(y, x);

    const vecgtorNorm = Math.hypot(x, y);
    const cx = (differentPoint.firstPoint.x + differentPoint.secondPoint.x) / 2;
    const cy = (differentPoint.firstPoint.y + differentPoint.secondPoint.y) / 2;
    return (
      <RotatedRoundedRect
        key={i}
        x={cx}
        y={cy}
        width={vecgtorNorm}
        height={20}
        radius={20}
        rotation={rotation}
        color={colorList[Number(differentPoint.groupId)]}
        groupid={0}
        selectGroupId={undefined}
      ></RotatedRoundedRect>
    );
  });
};

// グループサークルを生成
const GroupCirclePlot = ({ singlePoints }: { singlePoints: any }) => {
  return singlePoints.map((singlePoint: any, i: any) => {
    return (
      <Circle
        key={i}
        singlePoint={singlePoint}
        color={colorList[Number(singlePoint.groupId)]}
        circleSize={15 + 0.1 * singlePoint.pointsCount}
        groupid={0}
        selectGroupId={undefined}
      />
    );
  });
};

const LabelsPlot = ({ labels }: any) => {
  // const texture = Texture.from("");
  return labels.map((text: any) => {
    return (
      <>
        <Text
          text={groupNames[text.groupId]}
          x={text.textsCenter[0]}
          y={text.textsCenter[1] - 10}
          anchor={0.5}
          style={
            new TextStyle({
              fontSize: 16,
              fill: "0x000000",
            })
          }
        />
        {/* <Sprite
          // texture={texture}
          x={text.textsCenter[0] - 10}
          y={text.textsCenter[1] + 10}
          anchor={0.5}
          // zIndex={zIndex + 10}
          // scale={[0.15 * radiusRate, 0.15 * radiusRate]}
          // anchor={[0.5, 0.5]}
          // scale={[0.1, 0.1]}
          pointerdown={() => {
            // selectGroupId(colorIdx);
          }}
          eventMode="static"
        /> */}
        <Text
          text={text.counts}
          x={text.textsCenter[0] + 10}
          y={text.textsCenter[1] + 10}
          anchor={0.5}
          style={
            new TextStyle({
              fontSize: 16,
              fill: "0x000000",
            })
          }
        />
      </>
    );
  });
};

const posToSegmenetDistance = (
  P: { posX: number; posY: number },
  A: { posX: number; posY: number },
  B: { posX: number; posY: number },
) => {
  const ABx = B.posX - A.posX;
  const ABy = B.posY - A.posY;

  const PAx = P.posX - A.posX;
  const PAy = P.posY - A.posY;

  const dotABPA = ABx * PAx + ABy * PAy;
  const dotABAB = ABx * ABx + ABy * ABy;

  // 投影係数 t 正射影ベクトルを使ったもの？
  let t = dotABPA / dotABAB;
  t = Math.max(0, Math.min(1, t));

  // 最近接点 Q = A + t * AB
  const Qx = A.posX + t * ABx;
  const Qy = A.posY + t * ABy;

  const dx = P.posX - Qx;
  const dy = P.posY - Qy;

  return Math.sqrt(dx * dx + dy * dy);
};

const AvatarPlot = ({ dots, myPositionData, selectGroupId }: any) => {
  let avatarWithZindex: any[][] = [];

  // console.log("----avatar plot");
  // console.log(dots);
  // console.log(myPositionData);
  // console.log(selectGroupId);

  const drawAvatarBackground = useCallback(
    (g: {
      clear?: any;
      beginFill: (arg0: number) => void;
      drawCircle: (arg0: any, arg1: any, arg2: number) => void;
      drawPolygon: (arg0: any) => void;
      endFill: () => void;
    }) => {
      g.clear();
      // bg-slate-500
      g.beginFill(0x64748b);
      g.drawCircle(myPositionData.x, myPositionData.y, 10);
      g.endFill();
    },
    [myPositionData],
  );

  const drawCircleMask = useCallback(
    (
      g: {
        clear: () => void;
        beginFill: (arg0: number) => void;
        drawCircle: (arg0: number, arg1: number, arg2: number) => void;
        endFill: () => void;
      },
      color: number = 0x64748b,
      radius: number = 11,
    ) => {
      g.clear();
      g.beginFill(color);
      g.drawCircle(0, 0, radius);
      g.endFill();
    },
    [],
  );

  const drawAvatar = (
    x: any,
    y: any,
    colorIdx: any,
    radiusRate = 1,
    myPosition = false,
    iconURL: string,
  ) => {
    // const images = [
    //   "/avatar-circle/avatar-circle-red.png",
    //   "/avatar-circle/avatar-circle-yellow.png",
    //   "/avatar-circle/avatar-circle-purple.png",
    //   "/avatar-circle/avatar-circle-green.png",
    // ];
    const zIndex = myPosition ? 100 : 10;
    if (myPosition) {
      avatarWithZindex.push([
        // eslint-disable-next-line react/jsx-key
        <Graphics zIndex={zIndex} draw={drawAvatarBackground} />,
        zIndex,
      ]);
    }
    // const ref = createRef<any>();
    // maskRefs.current.push(ref);

    console.log("iconURL: " + iconURL);
    avatarWithZindex.push([
      // eslint-disable-next-line react/jsx-key
      <Graphics
        x={x}
        y={y}
        zIndex={zIndex}
        // ref={ref}
        draw={(graphics) =>
          drawCircleMask(graphics, colorList[colorIdx], 11 * radiusRate)
        }
        // ref={(ref) => setMask([...masks, ref])}
      ></Graphics>,
      zIndex + 10,
    ]);
    console.log(iconURL);

    avatarWithZindex.push([
      // eslint-disable-next-line react/jsx-key
      <>
        <Sprite
          // image={images[colorIdx]}
          image={"/avatar-circle/avatar-circle-red.png"}
          x={x}
          y={y}
          zIndex={zIndex + 10}
          scale={[0.15 * radiusRate, 0.15 * radiusRate]}
          anchor={[0.5, 0.5]}
          pointerdown={() => {
            selectGroupId(colorIdx);
          }}
          eventMode="static"
        />
        {myPosition && <Text text="🕶️" x={x - 13} y={y - 15} />}
      </>,
      zIndex + 10,
    ]);
  };

  dots.forEach(
    (dot: {
      x: any;
      y: any;
      groupId: number;
      radius: number;
      myPosition: boolean;
      iconURL: string;
    }) => {
      drawAvatar(
        dot.x,
        dot.y,
        dot.groupId,
        dot.radius ?? 1,
        dot.myPosition,
        dot.iconURL,
      );
    },
  );

  avatarWithZindex = avatarWithZindex.sort(function (a, b) {
    return a[1] - b[1];
  });
  return avatarWithZindex.map((avatar, i) => (
    <Fragment key={i}>{avatar[0]}</Fragment>
  ));
};

type Props = {
  polygons: any;
  positions: any;
  myPosition: any;
  windowWidth: any;
  selectGroupId: any;
};

const RotatedRoundedRect = ({
  x,
  y,
  width,
  height,
  radius,
  rotation,
  color,
  groupid,
  selectGroupId,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  rotation: number;
  color: number;
  groupid: number;
  selectGroupId: any;
}) => {
  const draw = (g: PixiGraphics) => {
    g.clear();
    g.beginFill(color, 1);
    // 注意：原点 (0, 0) から描くと回転が中心でできる
    g.drawRoundedRect(-width / 2, -height / 2, width, height, radius);
    // g.drawRoundedRect(0, 0, width, height, radius);
    g.endFill();
  };

  return (
    <Graphics
      draw={draw}
      x={x}
      y={y}
      rotation={rotation} // 回転（ラジアン）
      pointerdown={() => {
        // selectGroupId(colorIdx);
        console.log("click!!!!");
        // selectGroupId(groupid)
      }}
      eventMode="static"
    />
  );
};

const Dots = ({ positions, myPosition, windowWidth, selectGroupId }: Props) => {
  let _minX = 100000000000;
  let _minY = 100000000000;
  let _maxX = -100000000000;
  let _maxY = -100000000000;

  const groupIds = new Set<string>();
  // const hasPoint = new Set<string>();
  const hasDifferentPointGroup = new Set<string>();
  const hasSinglePointGroup = new Set<string>();
  const hasPerimeterIndexGroup = new Set<string>();
  const idxToGroupId = [];
  positions.forEach((v: { groupId: string; posX: number; posY: any }) => {
    _minX = Math.min(_minX, v.posX);
    _minY = Math.min(_minY, v.posY);
    _maxX = Math.max(_maxX, v.posX);
    _maxY = Math.max(_maxY, v.posY);
    idxToGroupId.push(v.groupId);
    groupIds.add(v.groupId);
    if ("perimeterIndex" in v) {
      hasPerimeterIndexGroup.add(v.groupId);
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const groupPointInfo = Array.from({ length: groupIds.size }, (_v, _i) => ({
    x: new Set<number>(),
    y: new Set<number>(),
  }));

  // const windowWidth = window.innerWidth;
  // グラフサイズに関わる
  const maxWidth = 656;
  const minWidth = 375;

  const width = Math.min(maxWidth, Math.max(windowWidth, minWidth));

  // グラフサイズに関わる
  const maxHeight = 350;
  const minHeight = 250;
  const rateSize = (width - minWidth) / (maxWidth - minWidth);
  const height = minHeight + rateSize * (maxHeight - minHeight);

  const originalWidth = _maxX - _minX;
  const originalHeight = _maxY - _minY;
  let isUsedMyPosition = false;
  const myPositionData: any = {};
  const dots =
    positions.map(
      (v: {
        displayId: string;
        groupId: string;
        posX: number;
        posY: any;
        iconURL: string;
      }) => {
        let radius: number = 1; // 5
        let myPositionFlag = false;

        // console.log("------- positions map");
        // console.log(v.posX);
        // console.log(_minX);
        // console.log(originalWidth);
        // console.log(v.iconURL);
        // console.log(
        //   (v.posX - _minX) * ((width - paddingX * 2) / originalWidth),
        // );

        if (!hasPerimeterIndexGroup.has(v.groupId)) {
          groupPointInfo[Number(v.groupId)].x.add(v.posX);
          groupPointInfo[Number(v.groupId)].y.add(v.posY);
        }

        const x =
          (v.posX - _minX) * ((width - paddingX * 2) / originalWidth) +
          paddingX;
        const y =
          (v.posY - _minY) * ((height - paddingY * 2) / originalHeight) +
          paddingY;
        const centerX = width / 2;
        const centerY = height / 2;
        // const centerX = 0;
        // const centerY = 0;
        if (myPosition?.displayId === v?.displayId && !isUsedMyPosition) {
          // radius = 0.07; // 10 // 自分の位置の画像のサイズを変更する(倍率)
          radius = 1.5;
          isUsedMyPosition = true;
          myPositionFlag = true;
          if (originalWidth === 0) {
            myPositionData["x"] = centerX;
          } else {
            myPositionData["x"] = x;
          }
          if (originalHeight === 0) {
            myPositionData["y"] = centerY;
          } else {
            myPositionData["y"] = y;
          }
          // myPositionData["x"] =
          //   (v.posX - _minX) * ((width - 30) / originalWidth) + 15;
          // myPositionData["y"] =
          //   (v.posY - _minY) * ((height - 50) / originalHeight) + 25;
        }

        return {
          x: isNaN(x) ? centerX : x,
          y: isNaN(y) ? centerY : y,
          groupId: v.groupId,
          radius: radius,
          myPosition: myPositionFlag,
          iconURL: v.iconURL,
        };
      },
    ) || [];

  for (const groupId of groupIds) {
    if (!hasPerimeterIndexGroup.has(groupId)) {
      if (
        groupPointInfo[Number(groupId)].x.size > 1 ||
        groupPointInfo[Number(groupId)].y.size > 1
      ) {
        hasDifferentPointGroup.add(groupId);
      } else {
        hasSinglePointGroup.add(groupId);
      }
    }
  }

  const resultPolygons: GroupPolygon = [];
  const labels = [];
  // console.log("------------------------ plot polygon");
  // console.log(hasDifferentPointGroup);
  // console.log(hasSinglePointGroup);
  // console.log(positions);
  // console.log(dots);
  const resultSinglePoints = [];

  for (const groupId of hasSinglePointGroup) {
    const polygons = positions.filter(
      (opinion: { groupId: string; perimeterIndex: number }) => {
        return opinion.groupId === groupId;
      },
    );

    let point: { x: number | null; y: number | null } = {
      x: null,
      y: null,
    };

    for (const position of polygons) {
      point = {
        x:
          (position.posX - _minX) * ((width - paddingX * 2) / originalWidth) +
          paddingX,
        y:
          (position.posY - _minY) * ((height - paddingY * 2) / originalHeight) +
          paddingY,
      };
    }

    const centerX = width / 2;
    const centerY = height / 2;
    if (isNaN(point.x!)) {
      point.x = centerX;
    }

    if (isNaN(point.y!)) {
      point.y = centerY;
    }

    const textPos = [point.x, point.y];

    // console.log("single textPos!!!!");
    // console.log(textPos);
    // console.log(point);

    labels.push({
      textsCenter: textPos,
      groupId: groupId,
      counts: polygons.length,
      minDistance: null,
    });

    resultSinglePoints.push({
      point: point,
      groupId: groupId,
      pointsCount: polygons.length,
    });
  }

  const resultDifferenctPoints = [];

  for (const groupId of hasDifferentPointGroup) {
    const polygons = positions.filter(
      (opinion: { groupId: string; perimeterIndex: number }) => {
        return opinion.groupId === groupId;
      },
    );

    let firstPoint: { x: number | null; y: number | null } = {
      x: null,
      y: null,
    };
    let secondPoint: { x: number | null; y: number | null } = {
      x: null,
      y: null,
    };

    for (const position of polygons) {
      if (firstPoint.x === null) {
        // firstPoint = { x: position.posX, y: position.posY };
        firstPoint = {
          x:
            (position.posX - _minX) * ((width - paddingX * 2) / originalWidth) +
            paddingX,
          y:
            (position.posY - _minY) *
              ((height - paddingY * 2) / originalHeight) +
            paddingY,
        };
      } else if (
        firstPoint.x !== position.posX ||
        firstPoint.y !== position.posY
      ) {
        // secondPoint = { x: position.posX, y: position.posY };
        secondPoint = {
          x:
            (position.posX - _minX) * ((width - paddingX * 2) / originalWidth) +
            paddingX,
          y:
            (position.posY - _minY) *
              ((height - paddingY * 2) / originalHeight) +
            paddingY,
        };
      }
    }

    const centerX = (firstPoint.x! + secondPoint.x!) / 2;
    const centerY = (firstPoint.y! + secondPoint.y!) / 2;

    const textPos = [centerX, centerY];
    // console.log("textPos!!!!!!!!!!!!!!!!!");
    // console.log(textPos);
    // console.log(firstPoint);
    labels.push({
      textsCenter: textPos,
      groupId: groupId,
      counts: polygons.length,
      minDistance: null,
    });

    resultDifferenctPoints.push({
      firstPoint: firstPoint,
      secondPoint: secondPoint,
      groupId: groupId,
    });
  }

  for (const groupId of hasPerimeterIndexGroup) {
    // poligonsを扱う
    const polygons = positions
      .filter((opinion: { groupId: string; perimeterIndex: number }) => {
        return (
          opinion.groupId === groupId &&
          (opinion.perimeterIndex || opinion.perimeterIndex === 0)
        );
      })
      .sort(
        (a: { perimeterIndex: any }, b: { perimeterIndex: any }) =>
          (a.perimeterIndex || 0) - (b.perimeterIndex || 0),
      );

    const polygonsSum = polygons.reduce(
      (acc: { posX: any; posY: any }, value: { posX: any; posY: any }) => ({
        posX: acc.posX + value.posX,
        posY: acc.posY + value.posY,
      }),
      { posX: 0, posY: 0 },
    );

    const polygonsCount = polygons.length;
    const polygonsCenter = {
      posX: polygonsSum.posX / polygonsCount,
      posY: polygonsSum.posY / polygonsCount,
    };
    // const isCreatedPolygons = polygonsCount >= 3;

    let minDistance = Infinity;
    for (let i = 0; i < polygonsCount; i++) {
      minDistance = Math.min(
        minDistance,
        posToSegmenetDistance(
          polygonsCenter,
          polygons[i],
          polygons[(i + 1) % polygonsCount],
        ),
      );
    }

    // console.log("---------------- 計算");
    // console.log(polygonsCenter);
    // console.log(isCreatedPolygons);
    // console.log(minDistance);

    const textPos = [
      (polygonsCenter.posX - _minX) * ((width - paddingX * 2) / originalWidth) +
        paddingX,
      (polygonsCenter.posY - _minY) *
        ((height - paddingY * 2) / originalHeight) +
        paddingY,
    ];
    labels.push({
      textsCenter: textPos,
      groupId: groupId,
      counts: polygons.length,
      minDistance: minDistance,
    });

    const flatPoints = polygons.flatMap((v: { posX: number; posY: any }) => {
      return [
        (v.posX - _minX) * ((width - paddingX * 2) / originalWidth) + paddingX,
        (v.posY - _minY) * ((height - paddingY * 2) / originalHeight) +
          paddingY,
      ];
    });

    const points = polygons.map((v: { posX: number; posY: any }) => {
      return {
        x:
          (v.posX - _minX) * ((width - paddingX * 2) / originalWidth) +
          paddingX,
        y:
          (v.posY - _minY) * ((height - paddingY * 2) / originalHeight) +
          paddingY,
      };
    });

    resultPolygons.push({
      points: points,
      flatPoints: flatPoints,
      groupId: groupId,
    });
  }

  return (
    <Stage
      width={width}
      height={height}
      options={{ backgroundColor: backgroundColor }}
    >
      <Axes
        width={width}
        height={height}
        xLength={width}
        yLength={height}
        color={axisColor}
        thickness={2}
      />
      {/* <DotPlot polygons={resultPolygons} selectGroupId={selectGroupId} /> */}
      <PolygonPlot
        polygons={resultPolygons}
        selectGroupId={selectGroupId}
      ></PolygonPlot>
      {/* <AvatarPlot
        dots={dots}
        myPositionData={myPositionData}
        selectGroupId={selectGroupId}
      ></AvatarPlot> */}
      <RectPlot differentPoints={resultDifferenctPoints}></RectPlot>
      <GroupCirclePlot singlePoints={resultSinglePoints}></GroupCirclePlot>
      <LabelsPlot labels={labels}></LabelsPlot>
    </Stage>
  );
};

export default Dots;

const drawAutoRoundedPolygon = (
  graphics: PixiGraphics,
  points: PolygonPoints,
  radii: number,
  color: number = 0x66ccff,
) => {
  graphics.clear();
  graphics.beginFill(color);

  const len = points.length;

  for (let i = 0; i < len; i++) {
    const p0 = points[(i - 1 + len) % len];
    const p1 = points[i];
    const p2 = points[(i + 1) % len];

    const rOriginal = radii || 0;

    const distPrev = Math.hypot(p1.x - p0.x, p1.y - p0.y);
    const distNext = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    // const maxR = Math.min(distPrev, distNext) / 2 - 0.1;
    // const maxR = Math.min(distPrev, distNext) / 2 - 50;
    // const maxR = Math.min(distPrev, distNext) / 2 - 10;
    const maxR = Math.min(distPrev, distNext) / 5 - 0.1;
    const r = Math.min(rOriginal, Math.max(0, maxR));

    const v1 = { x: p0.x - p1.x, y: p0.y - p1.y };
    const v2 = { x: p2.x - p1.x, y: p2.y - p1.y };
    const len1 = Math.hypot(v1.x, v1.y);
    const len2 = Math.hypot(v2.x, v2.y);
    const u1 = { x: v1.x / len1, y: v1.y / len1 };
    const u2 = { x: v2.x / len2, y: v2.y / len2 };

    const p1a = {
      x: p1.x + u1.x * r,
      y: p1.y + u1.y * r,
    };
    const p1b = {
      x: p1.x + u2.x * r,
      y: p1.y + u2.y * r,
    };

    if (i === 0) {
      graphics.moveTo(p1a.x, p1a.y);
    } else {
      graphics.lineTo(p1a.x, p1a.y);
    }

    graphics.quadraticCurveTo(p1.x, p1.y, p1b.x, p1b.y);
  }

  graphics.closePath();
  graphics.endFill();
};

const RoundedPolygon = ({
  points,
  color,
  groupId,
  selectGroupId,
}: {
  points: PolygonPoints;
  color: number;
  groupid: number;
  selectGroupId: any;
}) => {
  // const points = [
  //   { x: 100, y: 100 },
  //   { x: 300, y: 120 },
  //   { x: 350, y: 250 },
  //   { x: 250, y: 350 },
  //   { x: 120, y: 300 },
  // ];

  const radii = 100000;

  const draw = useCallback(
    (g: PixiGraphics) => {
      drawAutoRoundedPolygon(g, points, radii, color);
    },
    [points, radii, color],
  );

  return (
    <Graphics
      draw={draw}
      pointerdown={() => {
        console.log("click!!!!");
        // selectGroupId(groupId)
      }}
      eventMode="static"
    />
  );
};

const Circle = ({
  singlePoint,
  circleSize = 10,
  color,
  groupId,
  selectGroupId,
}: {
  singlePoint: any;
  circleSize: any;
  color: number;
  groupid: number;
  selectGroupId: any;
}) => {
  // console.log("circle !!!!!!!!!");
  // console.log(singlePoint);
  // console.log(typeof singlePoint.point);
  // console.log(typeof singlePoint.x);
  const drawGroupCircle = useCallback(
    (g: {
      clear?: any;
      beginFill: (arg0: number) => void;
      drawCircle: (arg0: any, arg1: any, arg2: number) => void;
      drawPolygon: (arg0: any) => void;
      endFill: () => void;
    }) => {
      g.clear();
      // bg-slate-500
      g.beginFill(color);
      g.drawCircle(singlePoint.point.x, singlePoint.point.y, circleSize);
      g.endFill();
    },
    [color, singlePoint.point.x, singlePoint.point.y, circleSize],
  );

  return (
    <Graphics
      draw={drawGroupCircle}
      pointerdown={() => {
        // selectGroupId(colorIdx);
        console.log("click!!!!");
      }}
      eventMode="static"
    />
  );
};
