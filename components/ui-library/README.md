# UI Component Library Documentation

## Overview

This is a reusable component library built for the multi-tenancy application. All components are theme-aware and can be used across both the admin dashboard and the frontend.

## Installation

```typescript
import { Input, Button, Container, Stack } from '@/components/ui-library';
```

## Components

### Forms

#### Input

A versatile input component with multiple variants and states.

**Props:**
- `label?: string` - Label text
- `error?: string` - Error message
- `helperText?: string` - Helper text
- `variant?: 'default' | 'filled' | 'outlined'` - Visual variant
- `fullWidth?: boolean` - Full width (default: true)
- All standard HTML input props

**Example:**
```tsx
<Input
  label="البريد الإلكتروني"
  type="email"
  placeholder="example@email.com"
  error={errors.email}
  required
/>
```

---

#### Textarea

Multi-line text input component.

**Props:**
- `label?: string` - Label text
- `error?: string` - Error message
- `helperText?: string` - Helper text
- `fullWidth?: boolean` - Full width (default: true)
- All standard HTML textarea props

**Example:**
```tsx
<Textarea
  label="الوصف"
  placeholder="أدخل الوصف هنا..."
  rows={5}
  required
/>
```

---

#### Select

Dropdown select component with custom styling.

**Props:**
- `label?: string` - Label text
- `error?: string` - Error message
- `helperText?: string` - Helper text
- `options: SelectOption[]` - Array of options
- `placeholder?: string` - Placeholder text
- `fullWidth?: boolean` - Full width (default: true)
- All standard HTML select props

**Example:**
```tsx
<Select
  label="الفئة"
  options={[
    { value: '1', label: 'فئة 1' },
    { value: '2', label: 'فئة 2' },
  ]}
  placeholder="اختر الفئة"
  required
/>
```

---

### Buttons

#### Button

Flexible button component with multiple variants and sizes.

**Props:**
- `variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'` - Button style
- `size?: 'sm' | 'md' | 'lg'` - Button size
- `fullWidth?: boolean` - Full width
- `loading?: boolean` - Loading state
- All standard HTML button props

**Example:**
```tsx
<Button 
  variant="primary" 
  size="lg"
  loading={isSubmitting}
  onClick={handleSubmit}
>
  حفظ
</Button>
```

---

### Layout

#### Container

Responsive container with max-width constraints.

**Props:**
- `maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'` - Maximum width
- `className?: string` - Additional CSS classes
- `children: ReactNode` - Content

**Example:**
```tsx
<Container maxWidth="xl">
  <h1>المحتوى</h1>
</Container>
```

---

#### Stack

Flexbox-based layout component for spacing elements.

**Props:**
- `direction?: 'row' | 'column'` - Flex direction (default: 'column')
- `spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'` - Gap between items
- `align?: 'start' | 'center' | 'end' | 'stretch'` - Align items
- `justify?: 'start' | 'center' | 'end' | 'between' | 'around'` - Justify content
- `className?: string` - Additional CSS classes
- `children: ReactNode` - Content

**Example:**
```tsx
<Stack direction="row" spacing="md" align="center">
  <Button variant="primary">حفظ</Button>
  <Button variant="outline">إلغاء</Button>
</Stack>
```

---

## Theme Integration

All components automatically use CSS variables from the active theme:

- `--color-primary`
- `--color-secondary`
- `--color-error`
- `--color-foreground`
- `--color-background`

Components will automatically adapt to theme changes without any code modifications.

---

## Best Practices

1. **Always use these components** instead of native HTML elements for consistency
2. **Provide labels** for all form inputs for accessibility
3. **Handle errors** by passing error messages to the `error` prop
4. **Use Stack** for consistent spacing instead of manual margins
5. **Use Container** for page-level layouts

---

## Future Additions

- Checkbox
- Radio Group
- Date Picker
- Modal
- Toast
- Alert
- Card
- Badge
- Spinner
