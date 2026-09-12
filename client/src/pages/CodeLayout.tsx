import React from "react";
import CodeEditor from "../components/CodeEditor";
import { CodeProvider } from "../context/globalCode";

function CodeLayout() {
  return (
    <CodeProvider>
      <div className="w-full h-full flex justify-between gap-2 bg-slate-950">
        {/* Code editor box */}
        <div className="w-full rounded-md">
          <CodeEditor />
        </div>
      </div>
    </CodeProvider>
  );
}

export default CodeLayout;
