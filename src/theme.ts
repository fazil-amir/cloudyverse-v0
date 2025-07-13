import { createTheme, MantineColorsTuple } from '@mantine/core'

// Custom color palette
const myColor: MantineColorsTuple = [
  "#d2b8de",
  "#e9deee",
  "#f6f0f9",
  "#ba91cf",
  "#a670c1",
  "#9a5bb9",
  "#9450b6",
  "#8041a0",
  "#72398f",
  "#653080"
];

// Custom theme configuration
export const theme = createTheme({
  // Custom colors
  colors: {
    myColor
  },

  // Set the custom color as the primary color
  primaryColor: 'myColor',

  // Custom spacing scale
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
    '2xl': '2rem',
    '3xl': '3rem',
  },

  // Custom typography
  fontFamily: 'Poppins, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  fontFamilyMonospace: 'JetBrains Mono, Monaco, Courier, monospace',
  
  // Custom font sizes
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '0.900rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },

  // Custom line heights
  lineHeights: {
    xs: '1.2',
    sm: '1.4',
    md: '1.6',
    lg: '1.8',
    xl: '2',
  },

  // Custom border radius
  radius: {
    xs: '0.05rem',
    sm: '0.15rem',
    md: '0.20rem',
    lg: '0.25rem',
    xl: '0.30rem',
    '2xl': '1rem',
  },

  // Custom shadows
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },

  // Custom breakpoints
  breakpoints: {
    xs: '36em',
    sm: '48em',
    md: '62em',
    lg: '75em',
    xl: '88em',
  },

  // Custom headings
  headings: {
    fontFamily: 'Poppins, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    fontWeight: '600',
    sizes: {
      h1: { fontSize: '2.5rem', lineHeight: '1.2' },
      h2: { fontSize: '2rem', lineHeight: '1.3' },
      h3: { fontSize: '1.5rem', lineHeight: '1.4' },
      h4: { fontSize: '1.25rem', lineHeight: '1.5' },
      h5: { fontSize: '1.125rem', lineHeight: '1.6' },
      h6: { fontSize: '1rem', lineHeight: '1.6' },
    },
  },

  // Custom components default props
  components: {
    Button: {
      styles: {
        root: {
          minHeight: '46px',
        },
      },
    },
    Card: {
      styles: {
        root: {
          padding: 'var(--mantine-spacing-md)',
          borderRadius: 'var(--mantine-radius-md)',
        },
      },
    },
    Paper: {
      defaultProps: {
        radius: 'md',
        withBorder: true,
      },
      styles: {
        root: {
          padding: 'var(--mantine-spacing-lg)',
        },
      },
    },
    Drawer: {
      styles: {
        content: {
          padding: 'var(--mantine-spacing-lg)',
        },
      },
    },
    Input: {
      styles: {
        input: {
          height: '46px',
        },
        label: {
          marginBottom: '6px'
        },
      },
    },
    TextInput: {
      styles: {
        input: {
          height: '46px',
        },
        label: {
          marginBottom: '6px'
        },
      },
    },
    PasswordInput: {
      styles: {
        input: {
          height: '46px',
        },
        label: {
          marginBottom: '6px'
        },
      },
    },
    NumberInput: {
      styles: {
        input: {
          height: '46px',
        },
        label: {
          marginBottom: '6px'
        },
      },
    },
    Select: {
      styles: {
        input: {
          height: '46px',
        },
        label: {
          marginBottom: '6px'
        },
      },
    },
    Textarea: {
      defaultProps: {
        minRows: 5,
      },
      styles: {
        input: {
          height: '120px',
        },
        label: {
          marginBottom: '6px'
        },
      },
    },
  },

  // Custom other properties
  other: {
    // You can add custom properties here
    transition: 'all 0.2s ease',
    maxWidth: '1200px',
  },
}); 