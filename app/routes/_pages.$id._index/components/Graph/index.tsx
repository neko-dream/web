/* eslint-disable @typescript-eslint/no-explicit-any */
import "@pixi/events";
import { Stage, Graphics, Sprite, Text } from "@pixi/react";
import { Fragment, useCallback } from "react";

const colorList = [0xff453a, 0xffd60a, 0xbf5af2, 0x30d158];

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
    // const colorList = [0xff453a, 0xffd60a, 0xbf5af2, 0x30d158];

    g.beginFill(colorList[colorIdx], 0.3); // 色と透明度
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
    }) => {
      g.clear();
      drawPolygon(g, polygon.points, polygon.groupId);
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

const AvatarPlot = ({ dots, myPositionData, selectGroupId }: any) => {
  let avatarWithZindex: any[][] = [];

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
    const images = [
      "/avatar-circle/avatar-circle-red.png",
      "/avatar-circle/avatar-circle-yellow.png",
      "/avatar-circle/avatar-circle-purple.png",
      "/avatar-circle/avatar-circle-green.png",
    ];
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
          image={images[colorIdx]}
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
  selectGroupId: any;
};

const Dots = ({ positions, myPosition, selectGroupId }: Props) => {
  let _minX = 100000000000;
  let _minY = 100000000000;
  let _maxX = -100000000000;
  let _maxY = -100000000000;

  const groupIds = new Set();
  const hasPerimeterIndexGroup = new Set();
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

  const width = 375;
  const height = 300;
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
        if (myPosition?.displayId === v?.displayId && !isUsedMyPosition) {
          // radius = 0.07; // 10 // 自分の位置の画像のサイズを変更する(倍率)
          radius = 1.5;
          isUsedMyPosition = true;
          myPositionFlag = true;
          myPositionData["x"] =
            (v.posX - _minX) * ((width - 30) / originalWidth) + 15;
          myPositionData["y"] =
            (v.posY - _minY) * ((height - 50) / originalHeight) + 25;
        }
        return {
          x: (v.posX - _minX) * ((width - 30) / originalWidth) + 15,
          y: (v.posY - _minY) * ((height - 50) / originalHeight) + 25,
          groupId: v.groupId,
          radius: radius,
          myPosition: myPositionFlag,
          iconURL: v.iconURL,
        };
      },
    ) || [];

  const resultPolygons = [];
  for (const groupId of hasPerimeterIndexGroup) {
    // poligonsを扱う
    const polygons = positions
      .filter((opinion: { groupId: number; perimeterIndex: number }) => {
        return (
          opinion.groupId === groupId &&
          (opinion.perimeterIndex || opinion.perimeterIndex === 0)
        );
      })
      .sort(
        (a: { perimeterIndex: any }, b: { perimeterIndex: any }) =>
          (a.perimeterIndex || 0) - (b.perimeterIndex || 0),
      );

    const points = polygons.flatMap((v: { posX: number; posY: any }) => {
      return [
        (v.posX - _minX) * ((width - 30) / originalWidth) + 15,
        (v.posY - _minY) * ((height - 50) / originalHeight) + 25,
      ];
    });
    resultPolygons.push({ points: points, groupId: groupId });
  }

  return (
    <Stage
      width={width}
      height={height}
      options={{ backgroundColor: 0xffffff }}
    >
      <Axes
        width={width}
        height={height}
        xLength={width}
        yLength={height}
        color={0xd9d9d9}
        thickness={2}
      />
      <DotPlot polygons={resultPolygons} selectGroupId={selectGroupId} />
      <AvatarPlot
        dots={dots}
        myPositionData={myPositionData}
        selectGroupId={selectGroupId}
      ></AvatarPlot>
    </Stage>
  );
};

export default Dots;
