import React, { useState, useEffect, useRef } from "react";
import { executeCode, getLanguages } from "../services/api";
import { Play, X, Terminal, Loader2, AlertCircle, CheckCircle } from "lucide-react";

interface OutputProps {
  value: string;
  language: string;
}

function Output({ value, language }: OutputProps) {
  const [output, setOutput] = useState<string | null>(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [hasError, setHasError] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getLanguages();
  }, []);

  useEffect(() => {
    if (isTerminalOpen && terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output, isTerminalOpen]);

  const runCode = async () => {
    console.log("Running code...");
    setIsRunning(true);
    setOutput(null);
    setHasError(false);
    setExecutionTime(null);

    if (!isTerminalOpen) {
      setIsTerminalOpen(true);
    }

    const sourceCode = value;
    if (!sourceCode) {
      setOutput("No code to execute");
      setIsRunning(false);
      return;
    }

    const startTime = Date.now();

    try {
      const { run: result } = await executeCode(language, sourceCode);
      const endTime = Date.now();
      setExecutionTime(endTime - startTime);
      setOutput(result.output || "Code executed successfully with no output");
      setHasError(false);
    } catch (err: unknown) {
      const endTime = Date.now();
      setExecutionTime(endTime - startTime);
      setHasError(true);
      const errorMessage = err instanceof Error ? err.message : "An error occurred while executing the code";
      setOutput(`Error: ${errorMessage}`);
      console.error("Error at output.tsx in runcode function: ", errorMessage);
    } finally {
      setIsRunning(false);
    }
  };

  const closeTerminal = () => {
    setIsTerminalOpen(false);
    setTimeout(() => {
      setOutput(null);
      setExecutionTime(null);
      setHasError(false);
    }, 300);
  };

  const getStatusIcon = () => {
    if (isRunning) return <Loader2 className="w-4 h-4 animate-spin text-yellow-400" />;
    if (hasError) return <AlertCircle className="w-4 h-4 text-red-400" />;
    if (output && !hasError) return <CheckCircle className="w-4 h-4 text-green-400" />;
    return <Terminal className="w-4 h-4 text-gray-400" />;
  };

  const getStatusText = () => {
    if (isRunning) return "Executing...";
    if (hasError) return "Error";
    if (output && !hasError) return "Success";
    return "Ready";
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#1e1e1e] border border-gray-700 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-[#2d2d30]">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-300">Output Terminal</span>
        </div>

        <button
          onClick={runCode}
          disabled={isRunning || !value.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm rounded transition-colors duration-200"
        >
          {isRunning ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          {isRunning ? "Running..." : "Run Code"}
        </button>
      </div>

      {/* Terminal Panel */}
      <div className={`relative flex-1 transition-all duration-300 ease-in-out ${isTerminalOpen
          ? 'opacity-100 transform translate-y-0'
          : 'opacity-0 transform translate-y-full'
        }`}>
        {isTerminalOpen && (
          <div className="absolute inset-0 flex flex-col bg-[#0c0c0c] border-t border-gray-600">
            {/* Terminal Header */}
            <div className="flex items-center justify-between p-2 bg-[#1e1e1e] border-b border-gray-600">
              <div className="flex items-center gap-2">
                {getStatusIcon()}
                <span className="text-xs text-gray-400">{getStatusText()}</span>
                {executionTime && (
                  <span className="text-xs text-gray-500">
                    ({executionTime}ms)
                  </span>
                )}
              </div>

              <button
                onClick={closeTerminal}
                className="p-1 hover:bg-gray-700 rounded transition-colors duration-200"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-white" />
              </button>
            </div>

            {/* Terminal Content */}
            <div
              ref={terminalRef}
              className="flex-1 p-3 overflow-auto font-mono text-sm bg-[#0c0c0c]"
            >
              {isRunning ? (
                <div className="flex items-center gap-2 text-yellow-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Executing {language} code...</span>
                </div>
              ) : output ? (
                <pre className={`whitespace-pre-wrap ${hasError ? 'text-red-400' : 'text-green-400'
                  }`}>
                  {output}
                </pre>
              ) : (
                <div className="text-gray-500 italic">
                  Click "Run Code" to see output here
                </div>
              )}
            </div>

            {/* Terminal Footer */}
            <div className="p-2 bg-[#1e1e1e] border-t border-gray-600">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Language: {language}</span>
                <span>
                  {output ? `${output.split('\n').length} lines` : 'No output'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Placeholder when terminal is closed */}
      {!isTerminalOpen && (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <Terminal className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 text-sm mb-2">Terminal is closed</p>
            <p className="text-gray-600 text-xs">
              Click "Run Code" to execute your {language} code
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Output;
