'use client'
import { useRef, useEffect, useState } from 'react';

import MonacoEditor from "@monaco-editor/react";
import { type Monaco } from "@monaco-editor/react";
import { type editor } from "monaco-editor";
import { EditorProps } from '../lib/types';

export default function TerminalUI(editorProps: EditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const { theme, onChange, code } = editorProps
  const [ value, setValue ] = useState(code || "");

  function handleEditorDidMount(codeEditor: editor.IStandaloneCodeEditor, monaco: Monaco) {
    editorRef.current = codeEditor;
  }

  function handleEditorChange(value: string | undefined) {
    const valueOrNull = value ?? ""
    setValue(valueOrNull);
    onChange("code", valueOrNull);
  }

  return (
    <>
      <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
        <MonacoEditor
            height="60vh"
            width={`100%`}
            defaultLanguage="python"
            onMount={handleEditorDidMount}
            theme={theme.value}
            onChange={handleEditorChange}
            value={value}
          />
      </div>
    </>
  )
}
