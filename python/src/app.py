from fastapi import FastAPI, HTTPException
from src.service.types import ExecBody
from src.service.security import find_blacklisted_keyword
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import shutil
import time
import io
import contextlib
import builtins

app = FastAPI(title="Geekcode Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://geek-code.vercel.app", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/")
def get_health():
    return {"status": "Geekcode"}






@app.post("/api/execute")
def execute_code(exec: ExecBody):
    # Basic validations
    if not exec.code.strip():
        raise HTTPException(status_code=400, detail="Code cannot be empty")

    # Limiting code size to 10000 chars
    if len(exec.code) > 10000:
        raise HTTPException(status_code=400, detail="Code size exceeds limit")

    # Blacklist validation (server-side enforcement)
    offender = find_blacklisted_keyword(exec.code)
    if offender:
        raise HTTPException(status_code=400, detail=f"Code contains blacklisted keyword: {offender}")

    print("Reached python backend")
    print("Code to execute: ", exec.code)

    exec_code = exec.code
    start_time = time.time()

    try:
        print("Checking if docker is installed or seen")
        # Check if docker is available on PATH
        if shutil.which("docker") is not None:
            print("Docker is installed")
            # Run the code inside a docker container via subprocess
            print("Running code inside docker container via subprocess module")

            result = subprocess.run(
                [
                    "docker",
                    "run",
                    "--rm",
                    "--network",
                    "none",
                    "--memory",
                    "256m",
                    "--cpus",
                    "1.0",
                    "--pids-limit",
                    "64",
                    "-i",
                    "tanuj-ctf:7.0",
                ],
                input=exec_code,
                capture_output=True,
                text=True,
                timeout=30,
            )

            print("Code executed inside docker from container: ", result)

            # Return structured payload (even on runtime error)
            if result.returncode != 0:
                print("Error during code execution: ", result.stderr)
                return {"error": result.stderr}

            print("Code executed successfully, output will be sent shortly")
            return {"output": result.stdout}
        else:
            print("Docker is not found or not installed, falling back to direct execution")
            # Fallback: execute code directly (less secure but works for development)
            print("Running code directly via exec")
            
            output_buffer = io.StringIO()
            try:
                with contextlib.redirect_stdout(output_buffer):
                    builtins.exec(exec_code, {"__builtins__": builtins})
                output = output_buffer.getvalue()
                print("Code executed successfully, output will be sent shortly")
                return {"output": output}
            except Exception as e:
                error_msg = f"{type(e).__name__}: {str(e)}"
                print(f"Error during code execution: {error_msg}")
                return {"error": error_msg}

    except subprocess.TimeoutExpired:
        print("subprocess execution timed out")
        raise HTTPException(status_code=408, detail="Code execution timed out")
    except subprocess.CalledProcessError as e:
        print("Subprocess called process error: ", e.stderr)
        raise HTTPException(status_code=500, detail=f"Docker error: {e.stderr}")
    except HTTPException as e:
        # Re-raise explicit HTTP exceptions (like docker not installed)
        raise e
    except Exception as e:
        print("An unexpected error occurred: ", str(e))
        raise HTTPException(
            status_code=500, detail=f"An unexpected error occurred: {str(e)}"
        )
    finally:
        # after the whole process is done we will be removing the temp files
        execution_time = time.time() - start_time
        print(f"Execution_time : {execution_time} seconds")
