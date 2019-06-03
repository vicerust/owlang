import * as path from 'path'
import * as vscode from 'vscode'

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind
} from 'vscode-languageclient'

export function activate(context: vscode.ExtensionContext) {
  console.log("activated")
  const serverModule = context.asAbsolutePath(path.join('server', 'out', 'server.js'))
  const debugOptions = { execArgv: ['--nolazy', '--inspect=6006'] }

  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: debugOptions
    }
  }

  const clientOptions: LanguageClientOptions = {
    documentSelector: [
      { scheme: 'file', language: 'ow' },
    ],
    synchronize: {
      configurationSection: []
    }
  }

  const client = new LanguageClient('ow', 'Overwatch Language Server', serverOptions, clientOptions)

  const disposable = client.start()
  context.subscriptions.push(disposable)
}