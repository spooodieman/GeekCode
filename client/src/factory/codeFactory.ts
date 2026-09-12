import { fetchData } from "../services/backendApi.ts";


export const executeCodeFromBackend = async (sourceCode: string) => {
  console.log("Reached ExecuteCode from frontend");

  try {
    const response = await fetchData.post("/execute", {
      code: sourceCode,
    });
    // Axios returns { data, status, headers, ... }
    console.log("Response from python backend received: ", response);
    return response.data; // { output?: string, error?: string }
  } catch (error: any) {
    console.error("Error executing code: ", error);
    if (error.response && error.response.data && error.response.data.detail) {
      return { error: error.response.data.detail };
    }
    throw error;
  } finally {
    console.log("ExecuteCodeFromBackend work is over");
  }
};
