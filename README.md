# fragments

Cloud Computing for programmers

📖Running the Server
This project includes several helpful npm scripts for development and debugging. Make sure to install dependencies first:

npm install

✅Lint the code
Checks all JavaScript files in the src/ folder for linting errors:

npm run lint

▶️ Start the server (normal mode)
Runs the server normally using Node.js:

npm start

🛠 Development mode with auto-restart (via nodemon)
This uses cross-env to set LOG_LEVEL=debug. Ensure it's installed:

npm install --save-dev cross-env

Runs the server using nodemon, which watches for changes in the src/ directory and restarts the server automatically:

npm run dev

🐞 Debug mode (with VSCode debugger support)
Runs the server in debug mode so you can attach a debugger (like VSCode) to the process:

npm run debug

📝 Notes
Make sure cross-env and nodemon are installed:

npm install --save-dev cross-env nodemon

To stop the server in any mode, press CTRL + C.
