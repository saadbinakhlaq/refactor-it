"use client"

import TerminalUI from "../components/terminal";
import React, { useEffect, useState } from "react";
import { defineTheme } from "../lib/defineTheme";
import ThemeDropdown from "../components/themeDropdown";
import { Theme } from "../lib/types";
import { DARK_THEME, DEFAULT_THEME, LIGHT_THEME } from "../lib/constants";

export default function Dashboard() {
  const [theme, setTheme] = useState(DEFAULT_THEME);

  useEffect(() => {
    defineTheme(DEFAULT_THEME.value).then((_) =>
      setTheme(DEFAULT_THEME)
    );
  }, []);

  function handleThemeChange(th: Theme | null) {
    const theme = th ?? DEFAULT_THEME;

    if ([LIGHT_THEME.value, DARK_THEME.value].includes(theme.value)) {
      setTheme({value: theme.value, label: theme.label});
    } else {
      defineTheme(theme.value).then((_) => setTheme(
        {value: theme.value, label: theme.label}
      ));
    }
  }

  return (
    <div>
      <div className="flex flex-row">
        <div className="px-4 py-2 w-72">
          <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
        </div>
      </div>
      <TerminalUI
        theme={theme}
      />
    </div>
  )
}