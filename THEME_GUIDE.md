# Mantine Theme Customization Guide

## Overview
This guide shows how to customize the Mantine theme in your Cloudyverse application.

## Theme Configuration in `client.tsx`

### 1. **Colors**
```typescript
colors: {
  // Custom color palette
  myColor: ['#f1f1ff', '#e0dff2', '#bfbdde', ...],
  
  // Override default colors
  blue: ['#e7f5ff', '#d0ebff', '#a5d8ff', ...],
}
```

### 2. **Typography**
```typescript
// Font families
fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
fontFamilyMonospace: 'JetBrains Mono, Monaco, Courier, monospace',

// Font sizes
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

// Line heights
lineHeights: {
  xs: '1.2',
  sm: '1.4',
  md: '1.6',
  lg: '1.8',
  xl: '2',
},
```

### 3. **Spacing**
```typescript
spacing: {
  xs: '0.5rem',
  sm: '0.75rem',
  md: '1rem',
  lg: '1.25rem',
  xl: '1.5rem',
  '2xl': '2rem',
  '3xl': '3rem',
},
```

### 4. **Border Radius**
```typescript
radius: {
  xs: '0.125rem',
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
},
```

### 5. **Shadows**
```typescript
shadows: {
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
},
```

### 6. **Breakpoints**
```typescript
breakpoints: {
  xs: '36em',
  sm: '48em',
  md: '62em',
  lg: '75em',
  xl: '88em',
},
```

### 7. **Component Defaults**
```typescript
components: {
  Button: {
    defaultProps: {
      size: 'md',
      radius: 'md',
    },
    styles: {
      root: {
        fontWeight: 500,
      },
    },
  },
  Card: {
    defaultProps: {
      radius: 'lg',
      withBorder: true,
    },
  },
  Paper: {
    defaultProps: {
      radius: 'md',
      withBorder: true,
    },
  },
},
```

## Using Theme Variables in Components

### CSS Variables
```typescript
// In component styles
style={{
  padding: 'var(--mantine-spacing-md)',
  backgroundColor: 'var(--mantine-color-blue-6)',
  borderRadius: 'var(--mantine-radius-md)',
  boxShadow: 'var(--mantine-shadow-md)',
  fontSize: 'var(--mantine-font-size-lg)',
}}
```

### Theme Hook
```typescript
import { useMantineTheme } from '@mantine/core'

const MyComponent = () => {
  const theme = useMantineTheme()
  
  return (
    <div style={{
      padding: theme.spacing.md,
      backgroundColor: theme.colors.blue[6],
      borderRadius: theme.radius.md,
    }}>
      Content
    </div>
  )
}
```

## Color Scheme (Light/Dark Mode)

### Toggle Function
```typescript
const { setColorScheme } = useMantineColorScheme()
const computedColorScheme = useComputedColorScheme('light')

const toggleColorScheme = () => {
  setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')
}
```

### CSS Variables for Color Scheme
```typescript
// Light mode
'--mantine-color-body': '#ffffff'
'--mantine-color-text': '#000000'

// Dark mode
'--mantine-color-body': '#1a1b1e'
'--mantine-color-text': '#ffffff'
```

## Custom Properties

### Adding Custom Theme Properties
```typescript
other: {
  transition: 'all 0.2s ease',
  maxWidth: '1200px',
  customProperty: 'value',
},
```

### Using Custom Properties
```typescript
// In components
style={{
  transition: 'var(--mantine-transition)',
  maxWidth: 'var(--mantine-maxWidth)',
}}
```

## Best Practices

1. **Use CSS Variables**: Prefer `var(--mantine-*)` over direct theme access
2. **Consistent Spacing**: Use the spacing scale consistently
3. **Color Palette**: Create a cohesive color palette
4. **Typography**: Maintain consistent font sizes and line heights
5. **Component Defaults**: Set sensible defaults for common components

## Examples

### Custom Button Component
```typescript
import { Button, useMantineTheme } from '@mantine/core'

const CustomButton = ({ children, ...props }) => {
  const theme = useMantineTheme()
  
  return (
    <Button
      {...props}
      style={{
        background: `linear-gradient(135deg, ${theme.colors.blue[6]}, ${theme.colors.cyan[6]})`,
        boxShadow: theme.shadows.md,
      }}
    >
      {children}
    </Button>
  )
}
```

### Responsive Container
```typescript
import { Container } from '@mantine/core'

const ResponsiveContainer = ({ children }) => {
  return (
    <Container
      size="lg"
      style={{
        maxWidth: 'var(--mantine-maxWidth)',
        margin: '0 auto',
      }}
    >
      {children}
    </Container>
  )
}
``` 