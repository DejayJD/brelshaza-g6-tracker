import {
  buttonContainerStyle,
  buttonStyle,
  container,
  gridContainer,
  gridHealthColors,
  tileStyle,
  gridText,
  healthText,
  rightContainer,
  leftContainer,
  meteorToggleContainer,
  halfOpacity,
  meteorTextStyle,
  meteorTrackerContainerStyle,
  individualMeteorContainer,
} from "~/routes/styles.css";
import { useState } from "react";
import { HeartIcon } from "~/components/heartIcon";
import cloneDeep from "lodash.clonedeep";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import type { LinksFunction } from "@remix-run/node";
import { CountdownTimer } from "~/components/CountdownTimer";
import dayjs from "dayjs";
import { CircleIcon } from "~/components/CircleIcon";

type Tile = {
  number: number;
  health: number;
  max: number;
  position: { row: number; col: number };
  respawnTimestamp?: Date;
  respawnTimeoutId?: Timeout;
};

const STARTING_GRID: Tile[][] = [
  [
    { number: 12, health: 3, max: 3, position: { row: 0, col: 0 } },
    { number: 1, health: 3, max: 3, position: { row: 0, col: 1 } },
    { number: 3, health: 3, max: 3, position: { row: 0, col: 2 } },
  ],
  [
    { number: 11, health: 3, max: 3, position: { row: 1, col: 0 } },
    { number: 0, health: 14, max: 14, position: { row: 1, col: 1 } },
    { number: 5, health: 3, max: 3, position: { row: 1, col: 2 } },
  ],
  [
    { number: 9, health: 3, max: 3, position: { row: 2, col: 0 } },
    { number: 7, health: 3, max: 3, position: { row: 2, col: 1 } },
    { number: 6, health: 3, max: 3, position: { row: 2, col: 2 } },
  ],
];
type Grid = typeof STARTING_GRID;

const YELLOW_METEOR_ORDER = ["187", "137", "87", "57"];
const BLUE_METEOR_ORDER = [
  2, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4,
];

const TILE_RESPAWN_TIME_SECONDS = 100; // 1m 40s respawn

const iterateYellowTiles = (
  row: number,
  col: number,
  callback: (i: number, j: number) => void
) => {
  for (let i = row - 1; i < row + 2; i += 1) {
    if (i >= 0 && i <= 2) {
      for (let j = col - 1; j < col + 2; j += 1) {
        if (j >= 0 && j <= 2) {
          callback(i, j);
        }
      }
    }
  }
};

export default function Index() {
  const [meteorMode, setMeteorMode] = useState<"yellow" | "blue">("yellow");
  const [respawnTimeoutIDs, setRespawnTimeoutIDs] = useState<Timeout[]>([]);
  const [grid, setGrid] = useState(cloneDeep(STARTING_GRID));
  const [yellowMeteorIndex, setYellowMeteorIndex] = useState<number>(0);
  const [blueMeteorIndex, setBlueMeteorIndex] = useState<number>(0);
  const [blueMeteorCount, setBlueMeteorCount] = useState<number>(
    BLUE_METEOR_ORDER[blueMeteorIndex]
  );
  const [gridHistory, setGridHistory] = useState<
    {
      grid: Grid;
      yellowMeteorIndex: number;
      blueMeteorIndex: number;
      blueMeteorCount: number;
    }[]
  >([{ grid, yellowMeteorIndex, blueMeteorIndex, blueMeteorCount }]);
  const [showNumbers, setShowNumbers] = useState(true);
  const [showHealth, setShowHealth] = useState(true);
  const [refs, setRefs] = useState<(HTMLElement | undefined)[][]>([
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
  ]);

  const handleTileRespawn = (deadTiles: Tile[]) => {
    setGrid((currentGrid) => {
      const newGrid = cloneDeep(currentGrid);
      deadTiles.forEach((tile) => {
        newGrid[tile.position.row][tile.position.col].health = 3;
      });
      return newGrid;
    });
  };

  const handleTileClick = (rowIndex: number, colIndex: number) => {
    let newYMeteorIndex = yellowMeteorIndex;
    let newBMeteorIndex = blueMeteorIndex;
    let newBMeteorCount = blueMeteorCount;
    const updateBlueMeteorCount = () => {
      newBMeteorCount -= 1;
      if (newBMeteorCount === 0) {
        newBMeteorIndex = Math.min(
          newBMeteorIndex + 1,
          BLUE_METEOR_ORDER.length
        );
        newBMeteorCount = BLUE_METEOR_ORDER[newBMeteorIndex];
      }
      setBlueMeteorCount(newBMeteorCount);
      setBlueMeteorIndex(newBMeteorIndex);
    };
    if (grid[rowIndex][colIndex].health === 0) {
      if (meteorMode === "blue") {
        updateBlueMeteorCount();
      }
      return;
    }
    const newGrid = cloneDeep(grid);
    const clickedTile = newGrid[rowIndex][colIndex];
    const deadTiles: Tile[] = [];

    if (meteorMode === "blue") {
      clickedTile.health = Math.max(clickedTile.health - 1, 0);
      if (clickedTile.health === 0) {
        deadTiles.push(clickedTile);
      }
      updateBlueMeteorCount();
    }

    if (meteorMode === "yellow") {
      iterateYellowTiles(rowIndex, colIndex, (i, j) => {
        newGrid[i][j].health = Math.max(newGrid[i][j].health - 3, 0);
        if (newGrid[i][j].health === 0) {
          deadTiles.push(grid[i][j]);
        }
      });
      newYMeteorIndex = Math.min(
        newYMeteorIndex + 1,
        YELLOW_METEOR_ORDER.length
      );

      setYellowMeteorIndex(newYMeteorIndex);
      setMeteorMode("blue");
    }

    if (deadTiles.length > 0) {
      const respawnTimestamp = dayjs(
        new Date().getTime() + TILE_RESPAWN_TIME_SECONDS * 1000
      );
      const timeoutId = setTimeout(() => {
        handleTileRespawn(deadTiles);
      }, TILE_RESPAWN_TIME_SECONDS * 1000);
      deadTiles.forEach((tile) => {
        newGrid[tile.position.row][tile.position.col].respawnTimestamp =
          respawnTimestamp.toDate();
        newGrid[tile.position.row][tile.position.col].respawnTimeoutId =
          timeoutId;
      });
      setRespawnTimeoutIDs([...respawnTimeoutIDs, timeoutId]);
    }
    setGrid(newGrid);
    setGridHistory([
      ...cloneDeep(gridHistory),
      {
        grid: newGrid,
        yellowMeteorIndex: newYMeteorIndex,
        blueMeteorIndex: newBMeteorIndex,
        blueMeteorCount: newBMeteorCount,
      },
    ]);
  };

  const handleUndo = () => {
    if (gridHistory.length === 1) {
      return;
    }
    const newGridHistory = cloneDeep(gridHistory);
    newGridHistory.pop();
    const newCurrentState = newGridHistory[newGridHistory.length - 1];

    // check for any currently ongoing timers
    grid.forEach((row) => {
      row.forEach((tile) => {
        if (tile.respawnTimeoutId) {
          clearTimeout(tile.respawnTimeoutId);
        }
      });
    });

    // check for dead tiles && respawnTimer
    newCurrentState.grid.map((row) => {
      return row.map((tile) => {
        if (
          tile.respawnTimestamp &&
          tile.respawnTimestamp.getTime() < new Date().getTime()
        ) {
          tile.health = 3;
          tile.respawnTimestamp = undefined;
        }
        return tile;
      });
    });

    setYellowMeteorIndex(newCurrentState.yellowMeteorIndex);
    setBlueMeteorIndex(newCurrentState.blueMeteorIndex);
    setBlueMeteorCount(newCurrentState.blueMeteorCount);
    setGrid(newCurrentState.grid);
    setGridHistory(newGridHistory);
  };

  // Handle reset of everything
  const handleReset = () => {
    const resetGrid = cloneDeep(STARTING_GRID);
    setGrid(resetGrid);
    setGridHistory([
      {
        grid: resetGrid,
        yellowMeteorIndex: 0,
        blueMeteorIndex: 0,
        blueMeteorCount: BLUE_METEOR_ORDER[0],
      },
    ]);
    setYellowMeteorIndex(0);
    setBlueMeteorIndex(0);
    setBlueMeteorCount(BLUE_METEOR_ORDER[0]);
    setMeteorMode("yellow");
    respawnTimeoutIDs.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    setRespawnTimeoutIDs([]);
  };

  // On mouse over we add an isHovered class. If in yellow mode we add it to adjacent as well
  const handleTileMouseOver = (row: number, col: number) => {
    if (meteorMode === "blue") {
      refs?.[row]?.[col]?.classList?.add("isHovered");
    }
    if (meteorMode === "yellow") {
      iterateYellowTiles(row, col, (i: number, j: number) => {
        refs?.[i]?.[j]?.classList?.add("isHovered");
      });
    }
  };

  // Remove the hovered class from all tiles
  const handleTileMouseLeave = () => {
    refs.forEach((row) =>
      row.forEach((tile) => {
        tile?.classList.remove("isHovered");
      })
    );
  };

  return (
    <main>
      <div className={container}>
        <div className={leftContainer}>
          <div className={meteorToggleContainer}>
            <span
              className={[
                meteorMode === "blue" ? "" : halfOpacity,
                meteorTextStyle,
              ].join(" ")}
              style={{ marginLeft: "12px" }}
            >
              Blue
            </span>
            <Toggle
              checked={meteorMode === "yellow"}
              onChange={(e) => {
                setMeteorMode(meteorMode === "yellow" ? "blue" : "yellow");
              }}
              icons={false}
              className="meteor-toggle"
              disabled={
                meteorMode === "blue" &&
                yellowMeteorIndex === YELLOW_METEOR_ORDER.length
              }
            />
            <span
              className={[
                meteorMode === "yellow" ? "" : halfOpacity,
                meteorTextStyle,
              ].join(" ")}
            >
              Yellow
            </span>
          </div>
          <div className={gridContainer}>
            {grid.map((row, i) =>
              row.map((cell, j) => (
                <div
                  className={[tileStyle, gridHealthColors[cell.health]].join(
                    " "
                  )}
                  onClick={() => {
                    handleTileClick(i, j);
                  }}
                  key={`tile-${i}-${j}`}
                  ref={(ref) => {
                    if (ref && !refs[i][j]) {
                      const clonedRefs = cloneDeep(refs);
                      clonedRefs[i][j] = ref;
                      setRefs(clonedRefs);
                    }
                  }}
                  onMouseOver={() => {
                    handleTileMouseOver(i, j);
                  }}
                  onMouseLeave={handleTileMouseLeave}
                >
                  <CircleIcon color={meteorMode} size="tile" />
                  <div className={gridText}>
                    {showNumbers && <div>{cell.number}</div>}
                    {showHealth && cell.health > 0 && (
                      <div className={healthText}>
                        <HeartIcon /> {`${cell.health}/${cell.max}`}
                      </div>
                    )}

                    {cell.health === 0 && cell.respawnTimestamp && (
                      <div className={healthText}>
                        <CountdownTimer
                          expiryTimestamp={cell.respawnTimestamp}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className={buttonContainerStyle}>
            <button
              className={buttonStyle}
              onClick={() => {
                handleUndo();
              }}
            >
              Undo
            </button>
            <button className={buttonStyle} onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>
        <div className={rightContainer}>
          <h2> Next Yellow Meteor </h2>
          <div className={meteorTrackerContainerStyle}>
            {YELLOW_METEOR_ORDER.map((meteorNumber, index) => {
              return (
                <div
                  className={[
                    individualMeteorContainer,
                    index !== yellowMeteorIndex ? halfOpacity : "",
                  ].join(" ")}
                >
                  x{meteorNumber}
                  <CircleIcon color="yellow" size="counter" />
                </div>
              );
            })}
          </div>
          <h2> Next Blue Meteors </h2>
          <div
            className={meteorTrackerContainerStyle}
            style={{ marginTop: "12px" }}
          >
            {Array(BLUE_METEOR_ORDER[blueMeteorIndex])
              .fill(undefined)
              .map((_, i) => (
                <>
                  <CircleIcon
                    color="blue"
                    size="counter"
                    className={
                      BLUE_METEOR_ORDER[blueMeteorIndex] - blueMeteorCount > i
                        ? halfOpacity
                        : ""
                    }
                  />
                </>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: "/toggle.css" }];
};
