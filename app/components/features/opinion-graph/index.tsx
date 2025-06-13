import { useEffect, useRef } from "react";

// 定数
const colorList = [
  0xffa8a8, 0xeebefa, 0xffa94d, 0x63e6be, 0xffec99, 0xc0eb75, 0xfcc2d7,
  0x91a7ff, 0x74c0fc,
];

const groupNames = Array.from({ length: 8 }, (_, i) =>
  String.fromCharCode(65 + i)
);

const axisColor = 0xe5e5ea;
const paddingX = 30;
const paddingY = 25;

// 型定義
type PolygonPoints = {
  x: number;
  y: number;
}[];

type GroupPolygon = {
  points: PolygonPoints;
  flatPoints: number[];
  groupID: string;
}[];

type Props = {
  polygons: any;
  positions: any;
  myPosition: any;
  windowWidth: any;
  selectGroupId: any;
  background?: number;
};

// ヘルパー関数
function numberToHexColor(numColor: number): string {
  return `#${numColor.toString(16).padStart(6, "0")}`;
}

const posToSegmenetDistance = (
  P: { posX: number; posY: number },
  A: { posX: number; posY: number },
  B: { posX: number; posY: number }
) => {
  const ABx = B.posX - A.posX;
  const ABy = B.posY - A.posY;
  const PAx = P.posX - A.posX;
  const PAy = P.posY - A.posY;
  const dotABPA = ABx * PAx + ABy * PAy;
  const dotABAB = ABx * ABx + ABy * ABy;
  let t = dotABPA / dotABAB;
  t = Math.max(0, Math.min(1, t));
  const Qx = A.posX + t * ABx;
  const Qy = A.posY + t * ABy;
  const dx = P.posX - Qx;
  const dy = P.posY - Qy;
  return Math.sqrt(dx * dx + dy * dy);
};

// Canvas描画クラス
class GraphRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private imageCache: Map<string, HTMLImageElement> = new Map();
  private drawingData: any = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Failed to get 2D rendering context");
    }
    this.ctx = context;
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.canvas.addEventListener("click", this.handleClick.bind(this));
  }

  private handleClick(event: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (!this.drawingData) return;

    const {
      resultPolygons,
      resultDifferenctPoints,
      resultSinglePoints,
      myPositionData,
      selectGroupId,
    } = this.drawingData;

    // MyPosition のクリック判定
    if (myPositionData && myPositionData.x !== undefined) {
      const radius = 11 * 1.5;
      if (Math.hypot(x - myPositionData.x, y - myPositionData.y) < radius) {
        return;
      }
    }

    // ポリゴンのクリック判定
    for (const poly of (resultPolygons || []).slice().reverse()) {
      this.ctx.beginPath();
      this.drawAutoRoundedPolygonPath(poly.points, 100000);
      if (this.ctx.isPointInPath(x, y)) {
        selectGroupId(poly.groupID);
        return;
      }
    }

    // 回転矩形のクリック判定
    for (const rectData of (resultDifferenctPoints || []).slice().reverse()) {
      const x1 = rectData.firstPoint.x - rectData.secondPoint.x;
      const y1 = rectData.firstPoint.y - rectData.secondPoint.y;
      const rotation = Math.atan2(y1, x1);
      const vecgtorNorm = Math.hypot(x1, y1);
      const cx = (rectData.firstPoint.x + rectData.secondPoint.x) / 2;
      const cy = (rectData.firstPoint.y + rectData.secondPoint.y) / 2;

      if (this.isPointInRotatedRect(x, y, cx, cy, vecgtorNorm, 20, rotation)) {
        selectGroupId(rectData.groupID);
        return;
      }
    }

    // 円のクリック判定
    for (const circleData of (resultSinglePoints || []).slice().reverse()) {
      const circleSize = 15 + 0.1 * circleData.pointsCount;
      if (
        Math.hypot(x - circleData.point.x, y - circleData.point.y) < circleSize
      ) {
        selectGroupId(circleData.groupID);
        return;
      }
    }
  }

  private isPointInRotatedRect(
    px: number,
    py: number,
    rcx: number,
    rcy: number,
    rWidth: number,
    rHeight: number,
    angle: number
  ): boolean {
    const s = Math.sin(-angle);
    const c = Math.cos(-angle);
    const tx = px - rcx;
    const ty = py - rcy;
    const rotX = tx * c - ty * s;
    const rotY = tx * s + ty * c;
    return Math.abs(rotX) <= rWidth / 2 && Math.abs(rotY) <= rHeight / 2;
  }

  async setData(props: Props) {
    const {
      positions,
      myPosition,
      windowWidth,
      selectGroupId,
      background = 0xf2f2f7,
    } = props;

    // Canvas サイズ設定
    const maxWidth = 656;
    const minWidth = 310;
    const width = Math.min(maxWidth, Math.max(windowWidth, minWidth));
    const maxHeight = 350;
    const minHeight = 250;
    const rateSize = (width - minWidth) / (maxWidth - minWidth);
    const height = minHeight + rateSize * (maxHeight - minHeight);

    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.scale(dpr, dpr);

    if (!positions || positions.length === 0) {
      this.ctx.clearRect(0, 0, width, height);
      return;
    }

    // データ処理
    const sortedPositions = positions.sort(
      (a: any, b: any) => (a.perimeterIndex || 0) - (b.perimeterIndex || 0)
    );

    let _minX = 100000000000;
    let _minY = 100000000000;
    let _maxX = -100000000000;
    let _maxY = -100000000000;

    const groupIDs = new Set<string>();
    const hasDifferentPointGroup = new Set<string>();
    const hasSinglePointGroup = new Set<string>();
    const hasPerimeterIndexGroup = new Set<string>();

    sortedPositions.forEach((v: any) => {
      _minX = Math.min(_minX, v.posX);
      _minY = Math.min(_minY, v.posY);
      _maxX = Math.max(_maxX, v.posX);
      _maxY = Math.max(_maxY, v.posY);
      groupIDs.add(v.groupID);
      if ("perimeterIndex" in v) {
        hasPerimeterIndexGroup.add(v.groupID);
      }
    });

    const groupPointInfo = Array.from({ length: groupIDs.size }, () => ({
      x: new Set<number>(),
      y: new Set<number>(),
    }));

    const groupCounts = Array(groupIDs.size).fill(0);
    const originalWidth = _maxX - _minX;
    const originalHeight = _maxY - _minY;
    let isUsedMyPosition = false;
    const myPositionData: any = {};

    const dots = sortedPositions.map((v: any) => {
      groupCounts[Number(v.groupID)] += 1;
      let radius = 1;
      let myPositionFlag = false;

      if (!hasPerimeterIndexGroup.has(v.groupID)) {
        groupPointInfo[Number(v.groupID)]?.x.add(v.posX);
        groupPointInfo[Number(v.groupID)]?.y.add(v.posY);
      }

      const x =
        (v.posX - _minX) * ((width - paddingX * 2) / originalWidth) + paddingX;
      const y =
        (v.posY - _minY) * ((height - paddingY * 2) / originalHeight) +
        paddingY;
      const centerX = width / 2;
      const centerY = height / 2;

      if (myPosition?.displayID === v?.displayID && !isUsedMyPosition) {
        radius = 1.5;
        isUsedMyPosition = true;
        myPositionFlag = true;
        myPositionData.x = originalWidth === 0 ? centerX : x;
        myPositionData.y = originalHeight === 0 ? centerY : y;
        myPositionData.iconURL = v.iconURL;
      }

      return {
        x: isNaN(x) ? centerX : x,
        y: isNaN(y) ? centerY : y,
        groupID: v.groupID,
        radius: radius,
        myPosition: myPositionFlag,
        iconURL: v.iconURL,
      };
    });

    for (const groupID of groupIDs) {
      if (!hasPerimeterIndexGroup.has(groupID)) {
        if (
          groupPointInfo[Number(groupID)]?.x.size > 1 ||
          groupPointInfo[Number(groupID)]?.y.size > 1
        ) {
          hasDifferentPointGroup.add(groupID);
        } else {
          hasSinglePointGroup.add(groupID);
        }
      }
    }

    const resultPolygons: GroupPolygon = [];
    const labels = [];
    const resultSinglePoints = [];
    const resultDifferenctPoints = [];

    // シングルポイントグループ処理
    for (const groupID of hasSinglePointGroup) {
      const polygons = sortedPositions.filter(
        (opinion: any) => opinion.groupID === groupID
      );
      let point = { x: width / 2, y: height / 2 };

      for (const position of polygons) {
        point = {
          x:
            (position.posX - _minX) * ((width - paddingX * 2) / originalWidth) +
            paddingX,
          y:
            (position.posY - _minY) *
              ((height - paddingY * 2) / originalHeight) +
            paddingY,
        };
      }

      if (isNaN(point.x)) point.x = width / 2;
      if (isNaN(point.y)) point.y = height / 2;

      labels.push({
        textsCenter: [point.x, point.y],
        groupID: groupID,
        counts: groupCounts[Number(groupID)],
      });

      resultSinglePoints.push({
        point: point,
        groupID: groupID,
        pointsCount: polygons.length,
      });
    }

    // 異なるポイントグループ処理
    for (const groupID of hasDifferentPointGroup) {
      const polygons = sortedPositions.filter(
        (opinion: any) => opinion.groupID === groupID
      );
      let firstPoint = null;
      let secondPoint = null;

      for (const position of polygons) {
        const currentPoint = {
          x:
            (position.posX - _minX) * ((width - paddingX * 2) / originalWidth) +
            paddingX,
          y:
            (position.posY - _minY) *
              ((height - paddingY * 2) / originalHeight) +
            paddingY,
        };

        if (!firstPoint) {
          firstPoint = currentPoint;
        } else if (
          firstPoint.x !== position.posX ||
          firstPoint.y !== position.posY
        ) {
          secondPoint = currentPoint;
          break;
        }
      }

      if (!secondPoint) secondPoint = firstPoint;
      const centerX = (firstPoint!.x + secondPoint!.x) / 2;
      const centerY = (firstPoint!.y + secondPoint!.y) / 2;

      labels.push({
        textsCenter: [centerX, centerY],
        groupID: groupID,
        counts: groupCounts[Number(groupID)],
      });

      resultDifferenctPoints.push({
        firstPoint: firstPoint,
        secondPoint: secondPoint,
        groupID: groupID,
      });
    }

    // ペリメーターインデックスグループ処理
    for (const groupID of hasPerimeterIndexGroup) {
      const polygons = sortedPositions
        .filter(
          (opinion: any) =>
            opinion.groupID === groupID &&
            (opinion.perimeterIndex || opinion.perimeterIndex === 0)
        )
        .sort(
          (a: any, b: any) => (a.perimeterIndex || 0) - (b.perimeterIndex || 0)
        );

      if (polygons.length === 0) continue;

      const polygonsSum = polygons.reduce(
        (acc: any, value: any) => ({
          posX: acc.posX + value.posX,
          posY: acc.posY + value.posY,
        }),
        { posX: 0, posY: 0 }
      );

      const polygonsCount = polygons.length;
      const polygonsCenter = {
        posX: polygonsSum.posX / polygonsCount,
        posY: polygonsSum.posY / polygonsCount,
      };

      let minDistance = Infinity;
      for (let i = 0; i < polygonsCount; i++) {
        minDistance = Math.min(
          minDistance,
          posToSegmenetDistance(
            polygonsCenter,
            polygons[i],
            polygons[(i + 1) % polygonsCount]
          )
        );
      }

      const textPos = [
        (polygonsCenter.posX - _minX) *
          ((width - paddingX * 2) / originalWidth) +
          paddingX,
        (polygonsCenter.posY - _minY) *
          ((height - paddingY * 2) / originalHeight) +
          paddingY,
      ];

      labels.push({
        textsCenter: textPos,
        groupID: groupID,
        counts: groupCounts[Number(groupID)],
        minDistance: minDistance,
      });

      const points = polygons.map((v: any) => ({
        x:
          (v.posX - _minX) * ((width - paddingX * 2) / originalWidth) +
          paddingX,
        y:
          (v.posY - _minY) * ((height - paddingY * 2) / originalHeight) +
          paddingY,
      }));

      const flatPoints = polygons.flatMap((v: any) => [
        (v.posX - _minX) * ((width - paddingX * 2) / originalWidth) + paddingX,
        (v.posY - _minY) * ((height - paddingY * 2) / originalHeight) +
          paddingY,
      ]);

      resultPolygons.push({
        points: points,
        flatPoints: flatPoints,
        groupID: groupID,
      });
    }

    // 描画データを保存
    this.drawingData = {
      resultPolygons,
      resultDifferenctPoints,
      resultSinglePoints,
      myPositionData,
      dots,
      labels,
      width,
      height,
      background,
      selectGroupId,
    };

    // 画像をロードしてから描画
    await this.loadImages();
    this.draw();
  }

  private async loadImages() {
    const imagesToLoad = new Set<string>();

    if (this.drawingData.myPositionData?.iconURL) {
      imagesToLoad.add(this.drawingData.myPositionData.iconURL);
    }

    this.drawingData.dots?.forEach((dot: any) => {
      if (dot.iconURL) {
        imagesToLoad.add(dot.iconURL);
      }
    });

    const promises = Array.from(imagesToLoad).map((url) => {
      if (this.imageCache.has(url)) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          this.imageCache.set(url, img);
          resolve();
        };
        img.onerror = () => {
          console.error(`Failed to load image: ${url}`);
          resolve();
        };
        img.src = url;
      });
    });

    await Promise.all(promises);
  }

  private draw() {
    if (!this.drawingData) return;

    const { width, height, background } = this.drawingData;

    // クリア
    this.ctx.clearRect(0, 0, width, height);

    // 背景
    this.ctx.fillStyle = numberToHexColor(background);
    this.ctx.fillRect(0, 0, width, height);

    // 軸を描画
    this.drawAxes();

    // ポリゴンを描画
    this.drawPolygons();

    // 矩形を描画
    this.drawRects();

    // 円を描画
    this.drawCircles();

    // MyPositionを描画
    this.drawMyPosition();

    // ラベルを描画
    this.drawLabels();
  }

  private drawAxes() {
    const { width, height } = this.drawingData;

    this.ctx.strokeStyle = numberToHexColor(axisColor);
    this.ctx.lineWidth = 2;

    // X軸
    this.ctx.beginPath();
    this.ctx.moveTo(0, height / 2);
    this.ctx.lineTo(width, height / 2);
    this.ctx.stroke();

    // Y軸
    this.ctx.beginPath();
    this.ctx.moveTo(width / 2, 0);
    this.ctx.lineTo(width / 2, height);
    this.ctx.stroke();
  }

  private drawPolygons() {
    const { resultPolygons } = this.drawingData;

    resultPolygons?.forEach((poly: any) => {
      this.ctx.fillStyle = numberToHexColor(colorList[Number(poly.groupID)]);
      this.ctx.beginPath();
      this.drawAutoRoundedPolygonPath(poly.points, 100000);
      this.ctx.fill();
    });
  }

  private drawAutoRoundedPolygonPath(points: PolygonPoints, radii: number) {
    const len = points.length;
    if (len < 3) return;

    for (let i = 0; i < len; i++) {
      const p0 = points[(i - 1 + len) % len];
      const p1 = points[i];
      const p2 = points[(i + 1) % len];

      const rOriginal = radii || 0;
      const distPrev = Math.hypot(p1.x - p0.x, p1.y - p0.y);
      const distNext = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const maxR = Math.min(distPrev, distNext) / 10 - 0.1;
      const r = Math.min(rOriginal, Math.max(0, maxR));

      const v1 = { x: p0.x - p1.x, y: p0.y - p1.y };
      const v2 = { x: p2.x - p1.x, y: p2.y - p1.y };
      const len1 = Math.hypot(v1.x, v1.y);
      const len2 = Math.hypot(v2.x, v2.y);

      const u1 =
        len1 === 0 ? { x: 0, y: 0 } : { x: v1.x / len1, y: v1.y / len1 };
      const u2 =
        len2 === 0 ? { x: 0, y: 0 } : { x: v2.x / len2, y: v2.y / len2 };

      const p1a = { x: p1.x + u1.x * r, y: p1.y + u1.y * r };
      const p1b = { x: p1.x + u2.x * r, y: p1.y + u2.y * r };

      if (i === 0) {
        this.ctx.moveTo(p1a.x, p1a.y);
      } else {
        this.ctx.lineTo(p1a.x, p1a.y);
      }
      this.ctx.quadraticCurveTo(p1.x, p1.y, p1b.x, p1b.y);
    }
    this.ctx.closePath();
  }

  private drawRects() {
    const { resultDifferenctPoints } = this.drawingData;

    resultDifferenctPoints?.forEach((rectData: any) => {
      const x = rectData.firstPoint.x - rectData.secondPoint.x;
      const y = rectData.firstPoint.y - rectData.secondPoint.y;
      const rotation = Math.atan2(y, x);
      const vecgtorNorm = Math.hypot(x, y);
      const cx = (rectData.firstPoint.x + rectData.secondPoint.x) / 2;
      const cy = (rectData.firstPoint.y + rectData.secondPoint.y) / 2;

      this.ctx.save();
      this.ctx.translate(cx, cy);
      this.ctx.rotate(rotation);
      this.ctx.fillStyle = numberToHexColor(
        colorList[Number(rectData.groupID)]
      );
      this.ctx.beginPath();
      this.drawRoundedRect(-vecgtorNorm / 2, -10, vecgtorNorm, 20, 20);
      this.ctx.fill();
      this.ctx.restore();
    });
  }

  private drawRoundedRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) {
    if (width < 2 * radius) radius = width / 2;
    if (height < 2 * radius) radius = height / 2;

    this.ctx.moveTo(x + radius, y);
    this.ctx.arcTo(x + width, y, x + width, y + height, radius);
    this.ctx.arcTo(x + width, y + height, x, y + height, radius);
    this.ctx.arcTo(x, y + height, x, y, radius);
    this.ctx.arcTo(x, y, x + width, y, radius);
    this.ctx.closePath();
  }

  private drawCircles() {
    const { resultSinglePoints } = this.drawingData;

    resultSinglePoints?.forEach((circleData: any) => {
      const circleSize = 15 + 0.1 * circleData.pointsCount;
      this.ctx.fillStyle = numberToHexColor(
        colorList[Number(circleData.groupID)]
      );
      this.ctx.beginPath();
      this.ctx.arc(
        circleData.point.x,
        circleData.point.y,
        circleSize,
        0,
        Math.PI * 2
      );
      this.ctx.fill();
    });
  }

  private drawMyPosition() {
    const { myPositionData } = this.drawingData;

    if (
      myPositionData &&
      myPositionData.x !== undefined &&
      myPositionData.iconURL
    ) {
      this.drawAvatar(
        myPositionData.x,
        myPositionData.y,
        myPositionData.iconURL,
        1.5,
        true
      );
    }
  }

  private drawAvatar(
    x: number,
    y: number,
    iconURL: string,
    radius: number,
    isMyPosition: boolean
  ) {
    const img = this.imageCache.get(iconURL);
    if (!img) return;

    this.ctx.save();

    // マスク用の円
    const maskRadius = 11 * radius;
    this.ctx.beginPath();
    this.ctx.arc(x, y, maskRadius, 0, Math.PI * 2);
    this.ctx.clip();

    // 画像描画
    const scale = isMyPosition ? 0.1 : 0.15;
    const scaledRadius = radius * scale;
    const imgWidth = img.width * scaledRadius;
    const imgHeight = img.height * scaledRadius;

    this.ctx.drawImage(
      img,
      x - imgWidth / 2,
      y - imgHeight / 2,
      imgWidth,
      imgHeight
    );

    this.ctx.restore();

    // MyPosition の場合はサングラスを描画
    if (isMyPosition) {
      this.ctx.font = "16px sans-serif";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
    }
  }

  private drawLabels() {
    const { labels } = this.drawingData;

    labels?.forEach((label: any) => {
      const [x, y] = label.textsCenter;

      this.ctx.font = "16px sans-serif";
      this.ctx.fillStyle = "#000000";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";

      // グループ名
      this.ctx.fillText(groupNames[Number(label.groupID)], x, y - 10);

      // 人数
      this.ctx.fillText(`${label.counts}人`, x, y + 10);
    });
  }

  destroy() {
    this.canvas.removeEventListener("click", this.handleClick.bind(this));
  }
}

// Reactコンポーネント
const Dots = (props: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<GraphRenderer | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      if (!rendererRef.current) {
        rendererRef.current = new GraphRenderer(canvasRef.current);
      }
      rendererRef.current.setData(props);
    }

    return () => {
      if (rendererRef.current) {
        rendererRef.current.destroy();
      }
    };
  }, [props]);

  return <canvas ref={canvasRef} style={{ display: "block" }} />;
};

export default Dots;
