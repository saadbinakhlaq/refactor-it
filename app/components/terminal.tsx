'use client'
import { useRef, useEffect, useState } from 'react';

import MonacoEditor from "@monaco-editor/react";
import { type Monaco } from "@monaco-editor/react";
import { type editor } from "monaco-editor";
import { EditorProps } from '../lib/types';

export default function TerminalUI(editorProps: EditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const { theme } = editorProps

  function handleEditorDidMount(codeEditor: editor.IStandaloneCodeEditor, monaco: Monaco) {
    editorRef.current = codeEditor;
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
          />
      </div>
    </>
  )
}
