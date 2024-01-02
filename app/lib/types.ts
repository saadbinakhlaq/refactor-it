export interface EditorProps {
  theme: Theme,
}

export interface ThemeProps {
  theme: Theme;
  handleThemeChange: (theme: Theme | null) => void
}

export interface MonacoThemeObj {
  [key: string]: string
}

export interface Theme {
  value: string;
  label: string;
}
