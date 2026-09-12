import React, { useState, useEffect, useMemo } from 'react'
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";

import { Editor } from '@monaco-editor/react';
import { useParams } from 'react-router';

function Rooms() {

  const { roomId: roomName } = useParams<{ roomId: string }>();

  const ydoc = useMemo(() => new Y.Doc(), []);
  const [editor, setEditor] = useState<any | null>(null);

  useEffect(() => {
    if (!roomName || !editor) return;

    const provider = new WebsocketProvider(
      `http//localhost:8080/api/ws/${roomName}`,
      `room-${roomName}`, ydoc
    );

    //this gets yjs text type to bind with monaco editor
    const ytext = ydoc.getText("monaco")

    //creating binding between ytext and monaco editor
    const binding = new MonacoBinding(
      ytext,
      editor.getModel(),
      new Set([editor]),
      provider?.awareness
    );
    return () => {
      binding.destroy();
      provider.destroy();
      ydoc.destroy();
    }
  }, [roomName, editor, ydoc]);

  return (
    <div className="bg-blue-900 w-full h-screen">
      <Editor
        className="p-5"
        height="70%"
        theme="vs-dark"
        defaultLanguage="typescript"
        defaultValue="// Start coding collaboratively..."
        onMount={setEditor}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
        }}
      />
    </div>
  )
}

export default Rooms