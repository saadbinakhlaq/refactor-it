"use client"

import TerminalUI from "../components/terminal";
import React, { useEffect, useState } from "react";
import { defineTheme } from "../lib/defineTheme";
import ThemeDropdown from "../components/themeDropdown";
import { classnames } from "../utils/general";
import { Theme } from "../lib/types";
import { DARK_THEME, DEFAULT_THEME, LIGHT_THEME, PYTHON_DEFAULT } from "../lib/constants";

export default function Dashboard() {
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [code, setCode] = useState(PYTHON_DEFAULT);
  const [processing, setProcessing] = useState(false);


  function checkStatus(token: string) {

  }

  function handleCompile() {
    setProcessing(true);
    const formData = {
      language_id: 71,
      source_code: btoa(code)
    };
    const url = "https://" + process.env.NEXT_PUBLIC_RAPID_API_HOST + "/submissions?base64_encoded=true&fields=*";

    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY || "",
        "X-RapidAPI-Host": process.env.NEXT_PUBLIC_RAPID_API_HOST || ""
      },
      body: JSON.stringify(formData),
    }

    fetch(url, options)
    .then((response) => response.json())
    .then(json => {
      console.log(json)
    })
    .catch(function(err) {
      console.log(err)
    })
  }

  function onChange(action: string, data: string) {
    switch(action) {
      case "code": {
        setCode(data);
        break;
      }
      default: {
        console.warn("case not loaded", action, data);
      }
    }
  }


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
        onChange={onChange}
      />
      <button
        onClick={handleCompile}
        disabled={!code}
        className={classnames(
          "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0",
          !code ? "opacity-50" : ""
        )}
      >
        {processing ? "Processing..." : "Compile and Execute"}
      </button>
    </div>
  )
}
