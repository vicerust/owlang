# Overwatch Language Support for Visual Studio Code
### (and possibly other editors)

This project intends to extend VSC to be a fully featured IDE for text-based workshop scripts. With the way extensions like this work, adding support for other editors should be relatively trivial, but I'm focusing on the VSC extension for now. Because it's the best, fight me.

Currently, it's not much more than boilerplate with a couple autocompletes and a bit of highlighting, but this should change quickly. Just wanted to get the project out there in case anyone wants to help with it. I'll be working on it and committing here, so check back in a couple days.

Message me at `Vice#5333` on Discord if you have any questions (as I probably won't respond quickly here), or come hang out in [Jayne's workshop Discord](https://discord.gg/qft8x2X), where I'll also be posting updates.

## Brief Rundown of How Everything Works

There are two main moving parts - the VSC extension, and the language server. The extension does nothing but connect to the language server, and the language server does most of the grunt work. Like I said, it's all fairly boilerplate right now, I still have to add in most of the syntax.

The extension also registers a custom grammar file, used for syntax highlighting. Not complete yet, but it currently recognizes rules and themes them according to the colors in the workshop editor, which is perhaps what I'm most proud of.

The extension also registers a custom theme file, to get around the TextMate format's scope restrictions.

## Planned Features

Autocompletion for syntax is the major feature here. Being able to type `variable` and be shown a list of matching commands is very nice, especially when there's so many to remember, and some fucking madman at Blizzard decided that we should have spaces in the middle of our goddamn functions.

Type checking rules are planned, to ensure you don't accidentally try to set a variable at index (-122.3, 65.12, 82.9).

Tooltips are a major (and something we could crowdsource). In addition to providing autocomplete, tooltips can put a helpful explanation of what that command does, and what arguments it takes.

![tooltips](https://i.imgur.com/HuaVRjL.png)

Currently not planning on doing any type of preprocessing (except possibly for comments, if I can manage it). I want to keep this purely vanilla syntax; if someone wants to make a preprocessor on top of this, go ahead.

## To-do List

- [x] [Set up Autocomplete](https://streamable.com/oo22t)
- [x] Basic syntax highlighting w/ custom theme
- [ ] Hook up `connection.onCompletion` to JSON syntax file
- [ ] Populate syntax database
- [ ] Full syntax highlighting
- [ ] Write tooltips
- [ ] Type checking


## Running the Extension

- Run `npm install` in this folder. This installs all necessary npm modules in both the client and server folder
- Open VS Code on this folder.
- Press Ctrl+Shift+B to compile the client and server.
- Switch to the Debug viewlet.
- Select `Launch Client` from the drop down.
- Run the launch config.
- If you want to debug the server as well use the launch configuration `Attach to Server`
- In the [Extension Development Host] instance of VSCode, open a new `.ow` document, and you should be able to use all the fancy tools provided to you.
