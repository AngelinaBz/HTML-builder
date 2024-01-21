const readline = require("readline");
const fs = require("fs");
const path = require("path");

const { stdin: input, stdout: output } = require("process");

const rl = readline.createInterface({ input, output });
const filePath = path.join(__dirname, "text.txt");
fs.writeFile(filePath, "", (err) => {
    if (err) throw err;
  });

rl.setPrompt("How do you feel today? ");
rl.prompt();
rl.on("line", (input) => {
    if (input === "exit") {
        rl.close();
    } else {
        fs.appendFile(filePath, input + "\n", (err) => {
            if (err) throw err;
        });
    }
});

rl.on("close", () => {
  console.log("Goodbye!");
  process.exit(0);
});

rl.prompt();