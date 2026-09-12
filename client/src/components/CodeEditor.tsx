import React, { useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import type { OnMount } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import LanguageSelector from "./LanguageSelector";
import { useCode, type FileType } from "../context/globalCode";
import { Play, Terminal, X } from "lucide-react";
import {executeCodeFromBackend as executeCode} from  "../factory/codeFactory.ts";

function CodeEditor() {
  const { file, setFile, files, setFiles } = useCode();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [terminalHeight, setTerminalHeight] = useState(0);
  const [output, setOutput] = useState<string>("");

  //ref for timestamp ratelimiter
  const lastCalledRunCodeRef = useRef<number>(0);
  const [coolDownState, setCoolDownState] = useState<boolean>(false); //for button disable state

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleTabClick = (f: FileType) => {
    setFile(f);
  };

  const handleCodeChange = (value: string | undefined) => {
    if (!file) return;
    const newValue = value ?? "";

    setFiles((prev: FileType[]) =>
      prev.map((f: FileType) => (f === file ? { ...f, value: newValue } : f))
    );
    setFile((prev) => (prev ? { ...prev, value: newValue } : prev));
  };

  const handleLanguageSelect = (language: string) => {
    if (!file) return;
    setFiles((prev: FileType[]) =>
      prev.map((f: FileType) => (f === file ? { ...f, language } : f))
    );
    setFile((prev) => (prev ? { ...prev, language } : prev));
  };

  const toggleTerminal = () => {
    setIsTerminalOpen(!isTerminalOpen);
    setTerminalHeight(isTerminalOpen ? 0 : 300);
  };


  const runCode = async () => {
    if (!file) return;
    console.log("Running code:", file.value); //file.value is the source code
    try {
      // using the executeCode function which hits the backend API
      const response = await executeCode(file.value);
      console.log("Execution response:", response);
      if (response?.error) {
        if(response.error === "Blacklisted keywords in code"){
          setOutput("Error: Your code contains blacklisted keywords and cannot be executed.");
        }else{
          setOutput(response.error);

        }
      } else {
        setOutput(response?.output ?? "");
      }
    } catch (err: any) {
      setOutput(`Error: ${err?.message || String(err)}`);
      console.error("Error executing code:", err);
    }
    if (!isTerminalOpen) {
      toggleTerminal();
    }
  };

  const rateLimitRunCode = async () => {
    //timestamp based rate limiter , in ts one we use  5 second cooldown between executions
    const now = Date.now();
    if(now - lastCalledRunCodeRef.current < 5000){
      setCoolDownState(true);
      // Reset cooldown state after 5 seconds
      setTimeout(() => {
        setCoolDownState(false);
      }, 5000 - (now - lastCalledRunCodeRef.current));
    }else{
      setCoolDownState(false); 
      lastCalledRunCodeRef.current = now;//updating the ref
      await runCode();
    }
    
  }

  // Move the conditional rendering AFTER all hooks,  react chacha ke rules
  if (!file) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="text-white text-lg mb-2">Loading CodeSpace...</div>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-gray-900">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {files.map((f: FileType, idx: number) => (
              <button
                key={idx}
                className={`px-3 py-1 rounded-t text-sm ${f === file
                  ? "bg-gray-900 text-white border-b-2 border-blue-500"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                onClick={() => handleTabClick(f)}
              >
                {f.name || `File ${idx + 1}`}
              </button>
            ))}
          </div>

          <LanguageSelector
            language={file.language}
            onSelect={handleLanguageSelect}
            setLanguage={() => { }}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={rateLimitRunCode}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            disabled = {coolDownState}
          >
            <Play className="w-4 h-4" />
            Run
          </button>

          <button
            onClick={toggleTerminal}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${isTerminalOpen
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
          >
            <Terminal className="w-4 h-4" />
            Terminal
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor Area */}
        <div className="flex-1 flex flex-col">
          <Editor
            className="flex-1"
            height="100%"
            width="100%"
            value={file.value}
            language={file.language}
            theme="vs-dark"
            onMount={handleEditorDidMount}
            onChange={handleCodeChange}
            options={{
              tabSize: 4,
              automaticLayout: true,
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: "on",
              scrollBeyondLastLine: false,
              renderLineHighlight: "line",
              cursorBlinking: "blink",
              cursorStyle: "line",
            }}
          />
        </div>
      </div>

      {/* Slide-up Terminal */}
      <div
        className="bg-gray-900 border-t border-gray-700 transition-all duration-300 ease-in-out overflow-hidden"
        style={{ height: `${terminalHeight}px` }}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-2 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">Terminal Output</span>
            </div>
            <button
              onClick={toggleTerminal}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-auto">
            <pre className="text-gray-300 text-xs font-mono whitespace-pre-wrap break-words">
              {output || "Run code to see output here..."}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;
