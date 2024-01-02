import { loader } from "@monaco-editor/react";
import monacoThemes from "monaco-themes/themes/themelist.json";

function isThemeKey(key: string): key is keyof typeof monacoThemes {
  return monacoThemes.hasOwnProperty(key);
}

function getMonacoTheme(key: string) {
  if (isThemeKey(key)) {
    return monacoThemes[key]
  } else {
    return
  }
}

const defineTheme = (theme: string) => {
  return new Promise<void>((res) => {
    Promise.all([
      loader.init(),
      import(`monaco-themes/themes/${getMonacoTheme(theme)}.json`),
    ]).then(([monaco, themeData]) => {
      monaco.editor.defineTheme(theme, themeData);
      res();
    });
  });
};

export { defineTheme };