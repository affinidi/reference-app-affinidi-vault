export type BrandColorsKeys =
  | "100"
  | "90"
  | "80"
  | "60"
  | "40"
  | "20"
  | "10"
  | "5"
  | "3"
  | "1";
export type BrandColorsNames = "primary" | "secondary" | "tertiary";

export type AccentColorsKeys =
  | "100"
  | "80"
  | "60"
  | "40"
  | "20"
  | "10"
  | "5"
  | "3"
  | "1";
export type AccentColorsNames = "primary" | "secondary";

export type UtilityColorsKeys =
  | "100"
  | "90"
  | "70"
  | "50"
  | "30"
  | "15"
  | "10"
  | "5"
  | "3";
export type UtilityColorsNames = "danger" | "warning" | "success" | "info";

type BrandColors = {
  [key in BrandColorsKeys]: string;
};

const brandPrimary: BrandColors = {
  100: "#1d58fc",
  90: "#3469fc",
  80: "#4a79fd",
  60: "#779bfd",
  40: "#a5bcfe",
  20: "#d2defe",
  10: "#e8eeff",
  5: "#f4f7ff",
  3: "#f8faff",
  1: "#fdfdff",
};

const brandSecondary: BrandColors = {
  100: "#040822",
  90: "#1d2138",
  80: "#36394e",
  60: "#686b7a",
  40: "#9b9ca7",
  20: "#cdced3",
  10: "#e6e6e9",
  5: "#f2f3f4",
  3: "#f7f8f8",
  1: "#fcfdfd",
};

const brandTertiary: Partial<BrandColors> = {
  100: "#ffffff",
};

type AccentColors = {
  [key in AccentColorsKeys]: string;
};

const accentPrimary: AccentColors = {
  100: "#1fe5cd",
  80: "#4cead7",
  60: "#79efe1",
  40: "#a6f4eb",
  20: "#d2faf5",
  10: "#e9fcfa",
  5: "#f4fefc",
  3: "#f8fefd",
  1: "#fdfffe",
};

const accentSecondary: AccentColors = {
  100: "#f3ff47",
  80: "#f5ff6c",
  60: "#f8ff91",
  40: "#faffb5",
  20: "#fdffda",
  10: "#feffed",
  5: "#fefff6",
  3: "#fffff9",
  1: "#fffffd",
};

export type Theme = {
  colors: {
    brand: {
      [key in BrandColorsNames]: Partial<BrandColors>;
    };
    accent: {
      [key in AccentColorsNames]: AccentColors;
    };
    utility: {
      [key in UtilityColorsNames]: {
        [kei in UtilityColorsKeys]: string;
      };
    };
  };
};

export const theme: Theme = {
  colors: {
    brand: {
      primary: brandPrimary,
      secondary: brandSecondary,
      tertiary: brandTertiary,
    },
    accent: {
      primary: accentPrimary,
      secondary: accentSecondary,
    },
    utility: {
      danger: {
        100: "#f00c5e",
        90: "#f1246e",
        70: "#f4558e",
        50: "#f786af",
        30: "#fab6cf",
        15: "#fddbe7",
        10: "#fde7ef",
        5: "#fef3f7",
        3: "#fff8fa",
      },
      warning: {
        100: "#ffd400",
        90: "#ffd81a",
        70: "#ffe14d",
        50: "#ffe980",
        30: "#fff2b2",
        15: "#fff9d9",
        10: "#fffbe5",
        5: "#fffdf2",
        3: "#fffef7",
      },
      success: {
        100: "#00a08d",
        90: "#1aa998",
        70: "#4dbcaf",
        50: "#80cfc6",
        30: "#b2e2dd",
        15: "#d9f1ee",
        10: "#e5f5f4",
        5: "#f2faf9",
        3: "#f7fcfc",
      },
      info: {
        100: "#008bf4",
        90: "#1a96f5",
        70: "#4daef7",
        50: "#80c5f9",
        30: "#b2dcfc",
        15: "#d9eefd",
        10: "#e5f3fe",
        5: "#f2f9fe",
        3: "#f7fcff",
      },
    },
  },
};
