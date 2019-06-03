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

import { getCompletionItems } from './overwatch'

const connection: IConnection = createConnection(	
	new IPCMessageReader(process),
	new IPCMessageWriter(process)
  )

const documents: TextDocuments = new TextDocuments()
documents.listen(connection)
  
connection.onInitialize((params): InitializeResult => {
	return {
	  capabilities: {
		textDocumentSync: TextDocumentSyncKind.Full,
		hoverProvider: true,
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
		let markdown: MarkupContent = {
			kind: MarkupKind.Markdown,
			value: [
				'## Distance Between',
				'Distance Between takes two positions (`Vectors`) and calculates the distance (`Number`) between them.',
				'**Returns a `Number`**',
			].join('\n')
		};

		return [
			{
				label: 'Distance Between',
				kind: 1,
				detail: 'Distance Between( Vector, Vector ) : Number',
				documentation: markdown,
			},
			{
				label: 'JavaScript',
				kind: 1,
				data: 2
			}
		]

	}
)

connection.onHover(
	(params: TextDocumentPositionParams): Hover => {
		let doc = documents.get(params.textDocument.uri);
		if (doc == null) {return {contents:""}}

		let pos = params.position;
	
		let offset = doc.offsetAt(pos);

		return {
			contents: "hello"
		}
	}
)

  
/*connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
	if (item.data === 1) {
		item.detail = 'TypeScript details'
		item.documentation = 'TypeScript documentation'
	} else if (item.data === 2) {
		item.detail = 'JavaScript details'
		item.documentation = 'JavaScript documentation'
	}
	return item
})*/

  
connection.onDidChangeTextDocument(params => {
	console.log(`${params.textDocument.uri} changed`)
	console.log(`${JSON.stringify(params.contentChanges, null, 2)}`)
})
  
connection.listen()