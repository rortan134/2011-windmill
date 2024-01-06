export const isCollinear = (
  [x1, y1]: [number, number],
  [x2, y2]: [number, number],
  [x3, y3]: [number, number],
) => (y2 - y1) * (x3 - x2) === (y3 - y2) * (x2 - x1);

export const generateRandomPlane = (
  size: number,
  density: number,
): Set<[number, number]> => {
  const plane = new Set<[number, number]>();

  const getRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      if (Math.random() < density) {
        const randomX = getRandomNumber(x, x + 1);
        const randomY = getRandomNumber(y, y + 1);
        plane.add([randomX, randomY]);
      }
    }
  }

  return plane;
};

export const getPivotPoint = (plane: Set<number[]>): [number, number] => {
  const points = Array.from(plane);
  const pivotPoint = points[Math.floor(Math.random() * points.length)]!;
  return pivotPoint as [number, number];
};

// this can be adapted to other angles
export const getLinePointsFromPivot = (
  plane: Set<[number, number]>,
  pivotPoint: [number, number],
): [[number, number], [number, number]] => {
  const points = Array.from(plane);
  // get single lowest and highest y value
  const lowestY = points.reduce(
    (acc, [x, y]) => (y < acc ? y : acc),
    points[0]![1],
  );
  const highestY = points.reduce(
    (acc, [x, y]) => (y > acc ? y : acc),
    points[0]![1],
  );
  // Pivot point X, lowest Y, highest Y
  return [
    [pivotPoint[0], lowestY],
    [pivotPoint[0], highestY],
  ];
};

export const getDirectionalLineSegments = (
  currentPivotPoint: [number, number],
  line: [[number, number], [number, number]],
): {
  frontLineSegment: [[number, number], [number, number]];
  backLineSegment: [[number, number], [number, number]];
} => {
  // The front segment of the line is defined by the pivot point and the tip of the line
  const tip = line[1];
  const back = line[0];
  return {
    frontLineSegment: [currentPivotPoint, tip],
    backLineSegment: [currentPivotPoint, back],
  };
};

const getClosestNumber = (arr: number[], target: number) => {
  return arr.reduce((prev, curr) =>
    Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev,
  );
};

/**
 * Returns the next intersection point of the line with the plane
 * - A point that is closer to the pivot point will always be chosen over a point that is further away.
 * - the rotation of the line is clockwise around the pivot point and is described by the rotation of the two points that form it.
 * - In order to get the next intersection point, we need to find the point that is closest to the pivot point and that is not "behind" the rotation of the line.
 * - A point will be considered as "behind" the rotation of the line if it is on the same side of the line as the pivot point.
 */
export const getNextIntersectionPoint = (
  plane: Set<[number, number]>,
  currentPivotPoint: [number, number],
  line: [[number, number], [number, number]],
) => {
  const points = Array.from(plane).filter(
    ([x, y]) => x !== currentPivotPoint[0] || y !== currentPivotPoint[1],
  );
  const closestPointsToPivotPoint = points.sort(
    ([x1, y1], [x2, y2]) =>
      Math.sqrt((x1 - currentPivotPoint[0]) ** 2) +
      (y1 - currentPivotPoint[1]) ** 2 -
      Math.sqrt((x2 - currentPivotPoint[0]) ** 2) +
      (y2 - currentPivotPoint[1]) ** 2,
  );
  const closestPointToPivotPoint = closestPointsToPivotPoint[0]!;
  const closestPointToPivotPointIndex = points.findIndex(
    ([x, y]) =>
      x === closestPointToPivotPoint[0] && y === closestPointToPivotPoint[1],
  );

  const { frontLineSegment, backLineSegment } = getDirectionalLineSegments(
    currentPivotPoint,
    line,
  );

  // The point will be considered behind if its on the right side of the line
  const closestPointToPivotPointIsBehindLine =
    closestPointToPivotPoint[0] > frontLineSegment[1][0] &&
    closestPointToPivotPoint[0] > backLineSegment[1][0];

  const nextPoint = closestPointToPivotPointIsBehindLine
    ? points[closestPointToPivotPointIndex + 1]!
    : closestPointToPivotPoint;

  return nextPoint;
};

export const getNumberOfPointsInFrontOfLine = (
  plane: Set<[number, number]>,
  currentPivotPoint: [number, number],
  line: [[number, number], [number, number]],
) => {
  const { frontLineSegment, backLineSegment } = getDirectionalLineSegments(
    currentPivotPoint,
    line,
  );
  const points = Array.from(plane).filter(
    ([x, y]) => x !== currentPivotPoint[0] || y !== currentPivotPoint[1],
  );
  const pointsInFrontOfLine = points.filter(([x, y]) => {
    return (
      x > frontLineSegment[1][0] &&
      x > backLineSegment[1][0] &&
      !isCollinear(frontLineSegment[0], frontLineSegment[1], [x, y])
    );
  });
  return pointsInFrontOfLine.length;
};

export const getNumberOfPointsBehindLine = (
  plane: Set<[number, number]>,
  currentPivotPoint: [number, number],
  line: [[number, number], [number, number]],
) => {
  const { frontLineSegment, backLineSegment } = getDirectionalLineSegments(
    currentPivotPoint,
    line,
  );
  const points = Array.from(plane).filter(
    ([x, y]) => x !== currentPivotPoint[0] || y !== currentPivotPoint[1],
  );
  const pointsBehindLine = points.filter(([x, y]) => {
    return (
      x < frontLineSegment[1][0] &&
      x < backLineSegment[1][0] &&
      !isCollinear(frontLineSegment[0], frontLineSegment[1], [x, y])
    );
  });
  return pointsBehindLine.length;
};
