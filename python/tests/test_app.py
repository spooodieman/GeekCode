import pytest
import subprocess
from fastapi.testclient import TestClient
from src.app import app

client = TestClient(app)

def test_execute_code_empty_body():
    response = client.post("/api/execute", json={"code": ""})
    assert response.status_code == 400
    assert response.json() == {"detail": "Code cannot be empty"}# it shoould be this, this is what assert means

def test_execute_code_exceeds_size_limit():
    large_code = "a" * 10001
    response = client.post("/api/execute", json={"code": large_code})
    assert response.status_code == 400
    assert response.json() == {"detail": "Code size exceeds limit"}

def test_execute_code_docker_not_installed(mocker):
    mocker.patch("shutil.which", return_value=None)
    response = client.post("/api/execute", json={"code": "x=1"})
    assert response.status_code == 500
    assert response.json() == {"detail": "Docker is not installed or not found"}

def test_execute_code_success(mocker):
    mock_subprocess = mocker.patch("subprocess.run")
    mock_subprocess.return_value.returncode = 0
    mock_subprocess.return_value.stdout = "Hello, World!"
    mock_subprocess.return_value.stderr = ""

    response = client.post("/api/execute", json={"code": "x=1"})
    assert response.status_code == 200
    assert response.json() == {"output": "Hello, World!"}

def test_execute_code_runtime_error(mocker):
    mock_subprocess = mocker.patch("subprocess.run")
    mock_subprocess.return_value.returncode = 1
    mock_subprocess.return_value.stderr = "SyntaxError: invalid syntax"

    response = client.post("/api/execute", json={"code": "x=1"})
    assert response.status_code == 200
    assert response.json() == {"error": "SyntaxError: invalid syntax"}

def test_execute_code_timeout(mocker):
    mocker.patch("subprocess.run", side_effect=subprocess.TimeoutExpired(cmd="docker run", timeout=30))
    response = client.post("/api/execute", json={"code": "x=1"})
    assert response.status_code == 408
    assert response.json() == {"detail": "Code execution timed out"}

def test_execute_code_blacklisted_keyword():
    response = client.post("/api/execute", json={"code": "import os"})
    assert response.status_code == 400
    assert "Code contains blacklisted keyword" in response.json()["detail"]

def test_execute_code_blacklisted_keyword_frontend_transfer():
    response = client.post("/api/execute", json={"code": "input()"})
    assert response.status_code == 400
    assert "Code contains blacklisted keyword" in response.json()["detail"]



def test_execute_code_blacklisted_keyword():
    # Using a clearly dangerous import we block by default
    response = client.post("/api/execute", json={"code": "import os\nprint('X')"})
    assert response.status_code == 400
    body = response.json()
    assert "detail" in body
    assert "blacklisted" in body["detail"].lower()



