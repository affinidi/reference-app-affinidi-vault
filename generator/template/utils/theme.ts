export type BrandColorsKeys =
  | '100'
  | '90'
  | '70'
  | '50'
  | '30'
  | '15'
  | '5'
  | '3'
  | '1'
export type BrandColorsNames = 'primary' | 'secondary' | 'tertiary'
export type NeutralColorsNames = 'primary' | 'secondary'
export type UtilityColorsKeys =
  | '100'
  | '90'
  | '70'
  | '50'
  | '30'
  | '15'
  | '10'
  | '5'
  | '3'
export type UtilityColorsNames = 'danger' | 'warning' | 'success' | 'info'

type BrandColors = {
  [key in BrandColorsKeys]: string
}

const primaryBrand: BrandColors = {
  100: '#403ea7',
  90: '#5351b0',
  70: '#7978c1',
  50: '#9f9ed3',
  30: '#c6c5e5',
  15: '#e2e2f2',
  5: '#f5f5fb',
  3: '#f9f9fc',
  1: '#fdfdfe',
}

const secondaryBrand: BrandColors = {
  100: '#6bf7d4',
  90: '#7af8d8',
  70: '#97f9e1',
  50: '#b5fbe9',
  30: '#d3fdf2',
  15: '#e9fef9',
  5: '#f8fffd',
  3: '#fbfffe',
  1: '#feffff',
}

const tertiaryBrand: BrandColors = {
  100: '#2eba97',
  90: '#43c1a1',
  70: '#6dcfb6',
  50: '#96ddcb',
  30: '#c0eae0',
  15: '#e0f5ef',
  5: '#f5fcfa',
  3: '#f9fdfc',
  1: '#fdfefe',
}

type NeutralColors = {
  [key in BrandColorsKeys]: string
}

const primaryNeutral: NeutralColors = {
  100: '#313a55',
  90: '#464e66',
  70: '#6f7588',
  50: '#989daa',
  30: '#c1c4cc',
  15: '#e0e1e5',
  5: '#f5f5f7',
  3: '#f9f9fa',
  1: '#fdfdfd',
}

const secondaryNeutral: Partial<NeutralColors> = {
  100: '#fff',
}

export type Theme = {
  colors: {
    brand: {
      [key in BrandColorsNames]: BrandColors
    }
    neutral: {
      [key in NeutralColorsNames]: Partial<NeutralColors>
    }
    utility: {
      [key in UtilityColorsNames]: {
        [kei in UtilityColorsKeys]: string
      }
    }
  }
}

export const theme: Theme = {
  colors: {
    brand: {
      primary: primaryBrand,
      secondary: secondaryBrand,
      tertiary: tertiaryBrand,
    },
    neutral: {
      primary: primaryNeutral,
      secondary: secondaryNeutral,
    },
    utility: {
      danger: {
        100: '#e42648',
        90: '#e73c5b',
        70: '#ec677f',
        50: '#f293a4',
        30: '#f7bec8',
        15: '#fbdfe4',
        10: '#fce9ed',
        5: '#fef4f6',
        3: '#fef9fa',
      },
      warning: {
        100: '#fccf07',
        90: '#fcd420',
        70: '#fddd51',
        50: '#fee783',
        30: '#fef1b5',
        15: '#fff8da',
        10: '#fffae6',
        5: '#fffdf3',
        3: '#fffef8',
      },
      success: {
        100: '#21ab68',
        90: '#37b377',
        70: '#64c495',
        50: '#90d5b4',
        30: '#bde6d2',
        15: '#def2e8',
        10: '#e9f7f0',
        5: '#f4fbf8',
        3: '#f8fdfb',
      },
      info: {
        100: '#0072b3',
        90: '#1a80ba',
        70: '#4d9cc9',
        50: '#80b9d9',
        30: '#b2d5e8',
        15: '#d9eaf4',
        10: '#e5f1f7',
        5: '#f2f8fb',
        3: '#f7fbfd',
      },
    },
  },
}
