# GUI tool for Proximity

Things may break or change with proximity, I have a life and family so I will do my best to fix it but pull requests are always welcomed! The backend being in rust means its easy to extend this tool to work with almost any language using FFI or sending cli's. 

# Local setup

npm run start
npm run tauri dev (will take a long time first time around!)

# Deploy setup

npm run build
npm run tauri build

# What it does

Creates the command line based on options and file locations

Checks for Java is installed (X)

Figure out how to not use default path for Java (TODO)
Figure out default path for macos for Java in mean time (TODO)

Create cmd object for options selected (X)

Send object to rust (TODO)
Send path to rust (TODO)
Exec command in rust (TODO)

Helps you pick your deck list and ensures it is in the correct format (TODO)

Checks for template zip or folder (TODO)

Generates a xml card list to use with autofill tool (TODO)

# Current proximity options supported

You can find a full list of options [here](https://github.com/Haven-King/Proximity/wiki/Options#built-in-options)

- use_official_art
- reminder_text
- debug
- threads
- border
- artist_outline
- copyright
