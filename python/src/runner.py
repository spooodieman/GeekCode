import sys

pre = "import subprocess\n"

code = sys.stdin.read()
finalCode = pre + code
try:
    exec(finalCode,{})
except Exception as e:
    print(f"Error: {e}")
