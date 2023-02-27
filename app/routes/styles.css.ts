import { globalStyle, style, styleVariants } from "@vanilla-extract/css";
import { darken, lighten } from "polished";
import type { RecipeVariants } from "@vanilla-extract/recipes";
import { recipe } from "@vanilla-extract/recipes";

const colors = {
  background: "#11111e",
  meteors: {
    blue: "#2572e6",
    yellow: "#ffe658",
  },
  tiles: {
    blue: "#1b263f",
    yellow: "rgb(254 206 41 / 70%)",
    yellow2: "rgb(238 202 76 / 40%)",
    red: "#78313c",
  },
};

export const container = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
  height: "100vh",
});

export const leftContainer = style({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  marginLeft: "125px",
});

export const buttonStyle = style({
  borderRadius: "6px",
  padding: "20px 30px",
  backgroundColor: "#3700B3",
  fontSize: 20,
  fontWeight: "700",
  letterSpacing: 1,
  color: "white",
  border: "none",
  cursor: "pointer",
  ":hover": {
    backgroundColor: darken(0.05, "#3700B3"),
  },
  ":active": {
    backgroundColor: darken(0.1, "#3700B3"),
  },
});

export const tileStyle = style({
  border: "solid 1px black",
  height: 140,
  width: 140,
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  userSelect: "none",
  position: "relative",
});

export const circles = recipe({
  base: {
    borderRadius: "50%",

    selectors: {
      [`${tileStyle}.isHovered > &`]: {
        opacity: "0.5",
      },
    },
  },
  variants: {
    color: {
      blue: {
        backgroundColor: colors.meteors.blue,
        boxShadow: "0 0 20px #375395",
      },
      yellow: {
        backgroundColor: colors.meteors.yellow,
        boxShadow: "0 0 20px #8492b4",
      },
    },
    size: {
      tile: {
        width: 100,
        height: 100,
        position: "absolute",
        zIndex: "30",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        opacity: "0",
      },
      counter: {
        width: 30,
        height: 30,
        boxShadow: "none",
      },
    },
  },
});

export type CircleVariants = RecipeVariants<typeof circles>;

export const gridContainer = style({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  border: "solid 1px black",
  transform: "rotate(45deg)",
  backgroundColor: "#1b263f",
  marginTop: "125px",
});

export const meteorTextStyle = style({
  opacity: "1",
  fontSize: 20,
});
export const halfOpacity = style({ opacity: "0.5" });

// globalStyle(``, {
//   opacity: "0.5",
// });
// globalStyle(`${tileStyle}.isHovered > ${circles.yellow}`, {
//   opacity: "0.5",
// });

const generateHealthColor = (color: string, lightenAmount: number) => {
  return {
    backgroundColor: color,
    ":hover": {
      backgroundColor: lighten(lightenAmount, color),
    },
  };
};

export const gridHealthColors: Record<number, string> = styleVariants({
  14: generateHealthColor(colors.tiles.blue, 0.05),
  13: generateHealthColor(colors.tiles.blue, 0.05),
  12: generateHealthColor(colors.tiles.blue, 0.05),
  11: generateHealthColor(colors.tiles.blue, 0.05),
  10: generateHealthColor(colors.tiles.blue, 0.05),
  9: generateHealthColor(colors.tiles.blue, 0.05),
  8: generateHealthColor(colors.tiles.blue, 0.05),
  7: generateHealthColor(colors.tiles.blue, 0.05),
  6: generateHealthColor(colors.tiles.blue, 0.05),
  5: generateHealthColor(colors.tiles.blue, 0.05),
  4: generateHealthColor(colors.tiles.blue, 0.05),
  3: generateHealthColor(colors.tiles.blue, 0.05),
  2: generateHealthColor(colors.tiles.yellow2, 0.15),
  1: generateHealthColor(colors.tiles.yellow, 0.15),
  0: generateHealthColor(colors.tiles.red, 0.03),
});

export const gridText = style({
  position: "relative",
  display: "flex",
  transform: "rotate(-45deg)",
  fontSize: "28px",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  fontWeight: "400",
  pointerEvents: "none",
});

export const healthText = style({
  fontSize: 18,
  paddingRight: 12,
  fontWeight: "200",
  display: "flex",
  alignItems: "center",
  gap: 4,
});

export const rightContainer = style({
  width: "25%",
  marginLeft: "125px",
  height: "70%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
});

export const meteorTrackerContainerStyle = style({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: "20px",
});

export const individualMeteorContainer = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
});

// export const logStyle = style({
//   fontSize: "22px",
//   color: "white",
//   padding: 12,
//   fontWeight: "300",
//   backgroundColor: colors.tiles.blue,
//   borderRadius: 6,
//   borderStyle: "solid",
//   borderWidth: 2,
//   borderColor: lighten(0.1, colors.tiles.blue),
//   boxShadow: "0px 0px 2px 0px rgba(0, 0, 0, 0.2)",
//   height: "90%",
//   width: "100%",
//   marginBottom: 20,
// });

// export const logEntryStyle = style({
//   padding: "10px 0",
//   selectors: {
//     [`${logStyle}  &:not(:last-child)`]: {
//       borderBottom: "solid 1px white",
//     },
//     [`${logStyle}  &:first-child`]: {
//       paddingTop: 0,
//     },
//   },
// });

export const buttonContainerStyle = style({
  marginTop: "125px",
  display: "flex",
  gap: 10,
});

export const meteorToggleContainer = style({
  display: "flex",
  alignItems: "center",
  gap: 10,
});

globalStyle(".meteor-toggle .react-toggle-track", {
  backgroundColor: colors.meteors.blue,
});

globalStyle(
  ".meteor-toggle.react-toggle:hover:not(.react-toggle--disabled) .react-toggle-track",
  {
    backgroundColor: lighten(0.05, colors.meteors.blue),
  }
);

globalStyle(".meteor-toggle.react-toggle--checked .react-toggle-track", {
  backgroundColor: darken(0.2, colors.meteors.yellow),
});

globalStyle(
  ".meteor-toggle.react-toggle--checked:hover:not(.react-toggle--disabled) .react-toggle-track",
  {
    backgroundColor: lighten(0.1, darken(0.2, colors.meteors.yellow)),
  }
);

globalStyle("html, body", {
  margin: 0,
  padding: 0,
  background: colors.background,
  boxSizing: "border-box",
  fontFamily: "Inter",
  color: "white",
});
