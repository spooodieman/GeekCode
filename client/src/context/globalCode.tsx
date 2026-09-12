import { useContext, createContext, ReactNode, useState, useCallback } from "react";
import * as monaco from "monaco-editor";

export type FileType = {
  name: string;
  value: string;
  language: string;
  model?: monaco.editor.ITextModel;
};

type CodeContextType = {
  files: FileType[];
  setFiles: React.Dispatch<React.SetStateAction<FileType[]>>;
  file: FileType | null;
  setFile: React.Dispatch<React.SetStateAction<FileType | null>>;
  FileTemplates: Omit<FileType, "model">[];
  AddFile: (newFile: Omit<FileType, "model">) => void;
  RemoveFile: (name: string) => void;
};

export const CodeContext = createContext<CodeContextType | undefined>(undefined);

// helper to generate Monaco model for a file
const createFileWithModel = (file: Omit<FileType, "model">): FileType => {
  try {
    return {
      ...file,
      model: monaco.editor.createModel(file.value, file.language),
    };
  } catch (error) {
    // If Monaco fails to create model, return without model
    console.warn("Failed to create Monaco model:", error);
    return {
      ...file,
      model: undefined,
    };
  }
};

const FileTemplates: Omit<FileType, "model">[] = [
  {
    name: "main.py",
    value: "#Write your python code here..\nprint('Hello World!')",
    language: "python",
  },
];

export const CodeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize files without models first
  const [files, setFiles] = useState<FileType[]>(
    FileTemplates.map((f) => ({ ...f, model: undefined }))
  );
  const [file, setFile] = useState<FileType | null>(
    files[0] || null
  );

  const AddFile = useCallback((newFile: Omit<FileType, "model">) => {
    // prevent duplicates
    setFiles((prev) => {
      if (prev.some((f) => f.name === newFile.name)) return prev;
      const fileWithModel = createFileWithModel(newFile);
      return [...prev, fileWithModel];
    });
  }, []);

  const RemoveFile = useCallback((name: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.name === name);
      if (target?.model) {
        target.model.dispose(); // cleanup Monaco model
      }
      return prev.filter((f) => f.name !== name);
    });

    setFile((currentFile) => {
      if (currentFile?.name === name) {
        return null;
      }
      return currentFile;
    });
  }, []);

  return (
    <CodeContext.Provider
      value={{ files, setFiles, file, setFile, FileTemplates, AddFile, RemoveFile }}
    >
      {children}
    </CodeContext.Provider>
  );
};

export const useCode = () => {
  const context = useContext(CodeContext);
  if (!context) {
    throw new Error("useCode must be used within a CodeProvider");
  }
  return context;
};
