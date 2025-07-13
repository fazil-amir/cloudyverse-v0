import { createTheme, MantineColorsTuple } from '@mantine/core'

// Modern neutral color palette
const neutral: MantineColorsTuple = [
  '#f8fafc',
  '#f1f5f9',
  '#e2e8f0',
  '#cbd5e1',
  '#94a3b8',
  '#64748b',
  '#475569',
  '#334155',
  '#1e293b',
  '#0f172a'
];

// Modern accent color palette
const accent: MantineColorsTuple = [
  '#f0f9ff',
  '#e0f2fe',
  '#bae6fd',
  '#7dd3fc',
  '#38bdf8',
  '#0ea5e9',
  '#0284c7',
  '#0369a1',
  '#075985',
  '#0c4a6e'
];

// Modern theme configuration
export const theme = createTheme({
  // Custom colors
  colors: {
    neutral,
    accent
  },

  // Set neutral as the primary color
  primaryColor: 'neutral',

  // Modern spacing scale
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },

  // Modern typography
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  fontFamilyMonospace: 'JetBrains Mono, Monaco, Courier, monospace',
  
  // Modern font sizes
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },

  // Modern line heights
  lineHeights: {
    xs: '1.25',
    sm: '1.375',
    md: '1.5',
    lg: '1.625',
    xl: '1.75',
  },

  // Modern border radius
  radius: {
    xs: '0.25rem',
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
  },

  // Modern shadows
  shadows: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },

  // Modern breakpoints
  breakpoints: {
    xs: '36em',
    sm: '48em',
    md: '62em',
    lg: '75em',
    xl: '88em',
  },

  // Modern headings
  headings: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    fontWeight: '600',
    sizes: {
      h1: { fontSize: '2.25rem', lineHeight: '1.2' },
      h2: { fontSize: '1.875rem', lineHeight: '1.3' },
      h3: { fontSize: '1.5rem', lineHeight: '1.4' },
      h4: { fontSize: '1.25rem', lineHeight: '1.5' },
      h5: { fontSize: '1.125rem', lineHeight: '1.6' },
      h6: { fontSize: '1rem', lineHeight: '1.6' },
    },
  },

  // Modern components default props
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        root: {
          minHeight: '44px',
          fontWeight: '500',
          transition: 'all 0.2s ease',
        },
      },
    },
    Card: {
      defaultProps: {
        radius: 'lg',
        withBorder: true,
      },
      styles: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 'var(--mantine-shadow-lg)',
          },
        },
      },
    },
    Paper: {
      defaultProps: {
        radius: 'lg',
        withBorder: true,
      },
      styles: {
        root: {
          transition: 'all 0.2s ease',
        },
      },
    },
    Drawer: {
      defaultProps: {
        radius: 'lg',
      },
      styles: {
        content: {
          padding: 'var(--mantine-spacing-lg)',
          border: '1px solid var(--mantine-color-neutral-3)',
        },
      },
    },
    Input: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        input: {
          height: '44px',
          transition: 'all 0.2s ease',
        },
        label: {
          marginBottom: '8px',
          fontWeight: '500',
        },
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        input: {
          height: '44px',
          transition: 'all 0.2s ease',
        },
        label: {
          marginBottom: '8px',
          fontWeight: '500',
        },
      },
    },
    PasswordInput: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        input: {
          height: '44px',
          transition: 'all 0.2s ease',
        },
        label: {
          marginBottom: '8px',
          fontWeight: '500',
        },
      },
    },
    NumberInput: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        input: {
          height: '44px',
          transition: 'all 0.2s ease',
        },
        label: {
          marginBottom: '8px',
          fontWeight: '500',
        },
      },
    },
    Select: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        input: {
          height: '44px',
          transition: 'all 0.2s ease',
        },
        label: {
          marginBottom: '8px',
          fontWeight: '500',
        },
      },
    },
    Textarea: {
      defaultProps: {
        radius: 'md',
        minRows: 4,
      },
      styles: {
        input: {
          transition: 'all 0.2s ease',
        },
        label: {
          marginBottom: '8px',
          fontWeight: '500',
        },
      },
    },
    NavLink: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'var(--mantine-color-neutral-1)',
          },
        },
      },
    },
    ActionIcon: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        root: {
          transition: 'all 0.2s ease',
        },
      },
    },
    Menu: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        dropdown: {
          border: '1px solid var(--mantine-color-neutral-3)',
          boxShadow: 'var(--mantine-shadow-lg)',
        },
      },
    },
    Modal: {
      defaultProps: {
        radius: 'lg',
      },
      styles: {
        content: {
          border: '1px solid var(--mantine-color-neutral-3)',
        },
      },
    },
  },

  // Custom other properties
  other: {
    transition: 'all 0.2s ease',
    maxWidth: '1200px',
    containerPadding: 'var(--mantine-spacing-lg)',
  },
}); 