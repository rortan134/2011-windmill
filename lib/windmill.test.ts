import { describe, expect, it } from "vitest";
import {
  generateRandomPlane,
  getPivotPoint,
  isCollinear,
  getLinePointsFromPivot,
  getNextIntersectionPoint,
  getNumberOfPointsInFrontOfLine,
  getNumberOfPointsBehindLine,
} from "./windmill";

describe("generateRandomPlane", () => {
  it("should generate a random plane with the specified size and density", () => {
    const size = 5;
    const density = 0.5;

    const plane = generateRandomPlane(size, density);

    expect(plane.size).toBeGreaterThan(0);
    expect(plane.size).toBeLessThanOrEqual(size * size);
  });
});

describe("isCollinear", () => {
  it("should return true if the given points are collinear", () => {
    const result = isCollinear([1, 2], [3, 4], [5, 6]);
    expect(result).toBe(true);
  });

  it("should return false if the given points are not collinear", () => {
    const result = isCollinear([1, 2], [3, 4], [5, 7]);
    expect(result).toBe(false);
  });
});

describe("getPivotPoint", () => {
  it("should return a valid pivot point from the given plane", () => {
    const plane = new Set([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);

    expect(plane.has(getPivotPoint(plane))).toBe(true);
  });
});

describe("getPivotPoint", () => {
  it("should return a valid pivot point from the given plane", () => {
    const plane = new Set([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
    expect(plane.has(getPivotPoint(plane))).toBe(true);
  });
});

describe("getLinePointsFromPivot", () => {
  it("should return a set of vertical line points from the given plane and pivot point", () => {
    const plane = new Set<[number, number]>([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
    const result = getLinePointsFromPivot(plane, [3, 4]);
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeLessThanOrEqual(plane.size);
    expect(result[0].includes(2)).toBe(true); // lowest point in plane
    expect(result[1].includes(6)).toBe(true); // highest point in plane
    expect(result[0][0]).toBe(result[1][0]); // same x value
  });
});

describe("getNextIntersectionPoint", () => {
  it("should return the next intersection point on the plane", () => {
    const plane = new Set<[number, number]>([
      [1, 2],
      [3, 4],
      [2, 6],
    ]);
    const pivotPoint: [number, number] = [3, 4];
    const result = getNextIntersectionPoint(
      plane,
      pivotPoint,
      getLinePointsFromPivot(plane, pivotPoint),
    );
    expect(result).toEqual([1, 2]);
  });

  it("should return the closest intersection point if there are multiple intersection points", () => {
    const plane = new Set<[number, number]>([
      [1, 2],
      [3, 4],
      [2, 6],
      [4, 5],
      [5, 3],
      [6, 1],
    ]);
    const pivotPoint: [number, number] = [2, 6];
    const result = getNextIntersectionPoint(
      plane,
      pivotPoint,
      getLinePointsFromPivot(plane, pivotPoint),
    );
    expect(result).toEqual([1, 2]);
  });
});

describe("getNumberOfPointsInFrontOfLine", () => {
  it("should return the correct number of points in front of the line when the number of points is even", () => {
    const plane = new Set<[number, number]>([
      [1, 2],
      [3, 4],
      [5, 6],
      [7, 8],
    ]);
    const currentPivotPoint: [number, number] = [3, 4];
    const line: [[number, number], [number, number]] = [
      [2, 2],
      [6, 6],
    ];

    const result = getNumberOfPointsInFrontOfLine(
      plane,
      currentPivotPoint,
      line,
    );

    expect(result).toBe(plane.size / 2 - 1);
  });

  it("should return the correct number of points in front of the line when the number of points is odd", () => {
    const plane = new Set<[number, number]>([
      [1, 2],
      [3, 4],
      [5, 6],
      [7, 8],
      [9, 10],
    ]);
    const currentPivotPoint: [number, number] = [3, 4];
    const line: [[number, number], [number, number]] = [
      [2, 2],
      [6, 6],
    ];

    const result = getNumberOfPointsInFrontOfLine(
      plane,
      currentPivotPoint,
      line,
    );

    expect(result).toBe(Math.floor(plane.size / 2));
  });
});

describe("getNumberOfPointsBehindLine", () => {
  it("should return the correct number of points behind the line when the number of points is even", () => {
    const plane = new Set<[number, number]>([
      [1, 2],
      [3, 4],
      [5, 6],
      [7, 8],
    ]);
    const currentPivotPoint: [number, number] = [3, 4];
    const line: [[number, number], [number, number]] = [
      [2, 2],
      [6, 6],
    ];

    const result = getNumberOfPointsBehindLine(plane, currentPivotPoint, line);

    expect(result).toBe(plane.size / 2 - 1);
  });

  it("should return the correct number of points behind the line when the number of points is odd", () => {
    const plane = new Set<[number, number]>([
      [1, 2],
      [3, 4],
      [5, 6],
      [7, 8],
      [9, 10],
    ]);
    const currentPivotPoint: [number, number] = [3, 4];
    const line: [[number, number], [number, number]] = [
      [2, 2],
      [6, 6],
    ];

    const result = getNumberOfPointsBehindLine(plane, currentPivotPoint, line);

    expect(result).toBe(Math.floor(plane.size / 2) - 1);
  });

  it("number of points behind the line should be equal to the number of points in front of the line when the number of points is odd", () => {
    const plane = new Set<[number, number]>([
      [1, 2],
      [3, 4],
      [5, 6],
      [7, 8],
      [9, 10],
    ]);
    const currentPivotPoint: [number, number] = [3, 4];
    const line: [[number, number], [number, number]] = [
      [2, 2],
      [6, 6],
    ];

    const numberOfPointsInFrontOfLine = getNumberOfPointsInFrontOfLine(
      plane,
      currentPivotPoint,
      line,
    );
    const numberOfPointsBehindLine = getNumberOfPointsBehindLine(
      plane,
      currentPivotPoint,
      line,
    );

    expect(numberOfPointsInFrontOfLine).toBe(numberOfPointsBehindLine + 1);
  });
});
