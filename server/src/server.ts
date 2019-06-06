import {
	IPCMessageReader,
	IPCMessageWriter,
	createConnection,
	IConnection,
	TextDocuments,
	InitializeResult,
	TextDocumentPositionParams,
	CompletionItem,
	CompletionItemKind,
	TextDocumentSyncKind,
	Hover,
	CancellationToken,
} from 'vscode-languageserver'

import {
	TextDocument, Position, CompletionList, Range, SymbolInformation, Diagnostic,
	TextEdit, FormattingOptions, MarkedString, DocumentSymbol, MarkupContent, MarkupKind
} from 'vscode-languageserver-types';

import { getCompletionItems, resolveCompletionItem, hoverHandler} from './overwatch'

const connection: IConnection = createConnection(	
	new IPCMessageReader(process),
	new IPCMessageWriter(process)
  )

const documents: TextDocuments = new TextDocuments()
documents.listen(connection)
  
const completionItems = getCompletionItems();

connection.onInitialize((params): InitializeResult => {
	return {
	  capabilities: {
		textDocumentSync: TextDocumentSyncKind.Full,
		hoverProvider: true,
		signatureHelpProvider: {
			triggerCharacters: ['('],
	  	},
		completionProvider: {
		  resolveProvider: true
		}
	  }
	}
})
  
connection.onDidChangeWatchedFiles(change => {
	console.log('didChangeWatchedFiles')
})


connection.onCompletion(
	(): CompletionItem[] => {

		return completionItems

	}
)

connection.onHover(
	(params: TextDocumentPositionParams): Hover => {
		let doc = documents.get(params.textDocument.uri);
		if (doc == null) {return {contents:""}}

		let pos = params.position;
	
		var contents = hoverHandler(pos, doc);
		
		return {
			contents: contents
		}
	}
)

  
connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
	return resolveCompletionItem(item.data)
})

  
connection.onDidChangeTextDocument(params => {
	console.log(`${params.textDocument.uri} changed`)
	console.log(`${JSON.stringify(params.contentChanges, null, 2)}`)
})
  
connection.listen()