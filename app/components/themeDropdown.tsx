import Select from "react-select";
import monacoThemes from "monaco-themes/themes/themelist.json";
import { ThemeProps, Theme, MonacoThemeObj } from "../lib/types";

export default function ThemeDropdown(themeProps: ThemeProps) {
  const { theme, handleThemeChange } = themeProps;

  function themeOptions(monacoThemes: MonacoThemeObj): Theme[] {
    return Object.entries(monacoThemes).map(([themeId, themeName]) => ({
      value: themeId,
      label: themeName,
    }))
  }

  return (
    <Select
      instanceId={`select-box`}
      placeholder={`Select Theme`}
      options={themeOptions(monacoThemes)}
      value={theme}
      onChange={handleThemeChange}
    />
  )
}
