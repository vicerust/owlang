# Overwatch Language Support for Visual Studio Code
### (and possibly other editors)

Install this extension from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=vicerust.overwatch&ssr=false).

This project intends to extend VSC to be a fully featured IDE for text-based workshop scripts. With the way extensions like this work, adding support for other editors should be relatively trivial, but I'm focusing on the VSC extension for now. Because it's the best, fight me.

Message me at `Vice#5333` on Discord if you have any questions (as I probably won't respond quickly here), or come hang out in [Jayne's workshop Discord](https://discord.gg/qft8x2X), where I'll also be posting updates.

## Instructions

- Download and install the extension from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=vicerust.overwatch&ssr=false).
- Make a new file, and save it as `test.ow`. The `.ow` extension is necessary.
- VS Code should recognize the extension and activate the language server. If it doesn't, you may have to manually change the language in the bottom right corner.
- Code away

## To-do List

As it stands, the extension is fairly complete, save for a few minor bugs, annoyances, etc. If there's something weird and fucked up, it's probably just me forgetting something, so let me know.

- [x] [Set up Autocomplete](https://streamable.com/oo22t)
- [x] Basic syntax highlighting w/ custom theme
- [x] Hook up `connection.onCompletion` to JSON syntax file
- [x] Populate syntax database
- [x] Full syntax highlighting
- [x] Write tooltips
- [x] Type checking
- [ ] Document Outline
- [ ] Fix all the bugs lol

## Known Bugs

- The theme is really janky and seems to change the theme throughout VS Code. I'll work on fixing it, but this language needs a custom theme for proper highlighting.
- Function scopes glitch out sometimes because the script for detecting them is an ungodly mess. I may consider rewriting it, but I need more booze.
- Probably a lot of other stuff I'm sure I'll hear about

## Running the Extension

You should just install it from [the marketplace](https://marketplace.visualstudio.com/items?itemName=vicerust.overwatch&ssr=false), but if you insist:
- Run `npm install` in this folder. This installs all necessary npm modules in both the client and server folder
- Open VS Code on this folder.
- Press Ctrl+Shift+B to compile the client and server.
- Switch to the Debug viewlet.
- Select `Launch Client` from the drop down.
- Run the launch config.
- If you want to debug the server as well use the launch configuration `Attach to Server`
- In the [Extension Development Host] instance of VSCode, open a new `.ow` document, and you should be able to use all the fancy tools provided to you.
- If you make any changes, you'll need to run `tsc -w --skipLibCheck` in the `./server` folder.
