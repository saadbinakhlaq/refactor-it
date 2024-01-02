"use client"

import TerminalUI from "../components/terminal";
import React, { useEffect, useState } from "react";
import { defineTheme } from "../lib/defineTheme";
import ThemeDropdown from "../components/themeDropdown";
import OutputDetails from "../components/outputDetails";
import OutputWindow from "../components/outputWindow";
import useKeyPress from "../hooks/useKeypress";
import { classnames } from "../utils/general";
import { Theme } from "../lib/types";
import { DARK_THEME, DEFAULT_THEME, LIGHT_THEME, PYTHON_DEFAULT } from "../lib/constants";

export default function Dashboard() {
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [code, setCode] = useState(PYTHON_DEFAULT);
  const [processing, setProcessing] = useState(false);
  const [outputDetails, setOutputDetails] = useState(null);

  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  useEffect(() => {
    if (enterPress && ctrlPress) {
      console.log("enterPress", enterPress);
      console.log("ctrlPress", ctrlPress);
      handleCompile();
    }
  }, [ctrlPress, enterPress]);


  async function checkStatus(token: string) {
    console.log(token)
    const url = "https://" + process.env.NEXT_PUBLIC_RAPID_API_HOST + "/submissions/" + token
    const params = new URLSearchParams({ base64_encoded: "true", fields: "*" })
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Host": process.env.NEXT_PUBLIC_RAPID_API_HOST || "",
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY || "",
      },
    };

    try {
      console.log(url + "?" + params)
      const response = await fetch(url + "?" + params, options)
      console.log(response)
      const result = await response.json()
      console.log(result)
      let statusId = result.status_id

      if (statusId === 1 || statusId === 2) {
        setTimeout(() => {
          checkStatus(token)
        }, 2000)
        return
      } else {
        setProcessing(false)
        console.log(result)
        setOutputDetails(result)
      }
    } catch (err) {
      console.log(err)
      setProcessing(false)
    }
  }

  async function handleCompile() {
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

    try {
      const response = await fetch(url, options)
      const result = await response.json()
      console.log(result)
      await checkStatus(result.token)
      // await checkStatus("a3a4a793-beef-4423-8473-019717b6a7a3")
    } catch (err) {
      console.log(err)
    }
  }

  function onChange(action: string, data: string) {
    switch(action) {
      case "code": {
        console.log(data)
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
      <div className="flex flex-row space-x-4 items-start px-4 py-4">
        <div className="flex flex-col w-full h-full justify-start items-end">
          <TerminalUI
            code={code}
            theme={theme}
            onChange={onChange}
          />
        </div>

        <div className="right-container flex flex-shrink-0 w-[30%] flex-col">
          <OutputWindow outputDetails={outputDetails} />
          <div className="flex flex-col items-end">
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
          {outputDetails && <OutputDetails outputDetails={outputDetails} />}
        </div>
      </div>
    </div>
  )
}
