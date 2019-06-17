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
	CompletionParams,
} from 'vscode-languageserver'

import {
	TextDocument, Position, CompletionList, Range, SymbolInformation, Diagnostic,
	TextEdit, FormattingOptions, MarkedString, DocumentSymbol, MarkupContent, MarkupKind, DocumentSymbolParams, SymbolKind, SignatureHelp
} from 'vscode-languageserver-types';

import { getCompletionItems, resolveCompletionItem, hoverHandler, resolveSymbols, signatureHelp, completionRequiresContext, getCompletionItemsWithContext} from './overwatch'

const connection: IConnection = createConnection(	
	new IPCMessageReader(process),
	new IPCMessageWriter(process)
  )

var documents: TextDocuments = new TextDocuments();
  
const completionItems = getCompletionItems();

connection.onInitialize((params): InitializeResult => {
	return {
	  capabilities: {
		textDocumentSync: documents.syncKind,
		hoverProvider: true,
		documentSymbolProvider: true,
		signatureHelpProvider: {
			triggerCharacters: ['(', ','],
	  	},
		completionProvider: {
		  resolveProvider: true
		}
	  }
	}
})
  

documents.onDidChangeContent((change) => {
	console.log(change);
})
connection.onDidChangeWatchedFiles(change => {
	console.log('didChangeWatchedFiles')
})


connection.onCompletion(
	(params: CompletionParams): CompletionItem[] => {
		var doc = documents.get(params.textDocument.uri);
		if(doc == null) { return [] }
		var types = completionRequiresContext(doc, params.position);
		
		if(types != false){
			return types.map((d) : CompletionItem => {
				return {
					label: d as string,
					kind: CompletionItemKind.Constant,
				}
			})
		} else {
			return completionItems
		}
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

connection.onSignatureHelp((params: TextDocumentPositionParams) : SignatureHelp => {
	var doc = documents.get(params.textDocument.uri);
	let pos = params.position;

	if(doc == null || pos == null) {return {signatures:[],activeParameter:null,activeSignature:null}}

	return signatureHelp(params, doc, pos)
})

connection.onDocumentSymbol((params: DocumentSymbolParams) : SymbolInformation[] => {
	var doc = documents.get(params.textDocument.uri);
	if(doc==null) {return []}

	var symbols = resolveSymbols(params.textDocument.uri, doc)
	return symbols;
})


  
connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
	return resolveCompletionItem(item)
})

  
connection.onDidChangeTextDocument(params => {

})
documents.listen(connection)

connection.listen()