import axios from "axios";
import { LANGUAGE_OPTIONS } from "../utils/constants";

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

export const executeCode = async (language: string, sourceCode: string) => {
  const response = await API.post("/execute", {
    language: language,
    version: LANGUAGE_OPTIONS[language],
    files: [
      {
        content: sourceCode,
      },
    ],
  });

  return response.data;
};

export const getLanguages = async () => {
  const response = await API.get("/runtimes");
  console.log(response.data);
};
