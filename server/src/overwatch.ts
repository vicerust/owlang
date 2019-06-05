import { CompletionItem, MarkupContent, MarkupKind } from 'vscode-languageserver'
import { Syntax, OWKind } from './syntax'


export function getCompletionItems() {
	let CompletionItems: CompletionItem[] = Syntax.map((d) : CompletionItem => {
		return {
			label: d.label,
			detail: d.detail,
			kind: d.kind,
			data: d.data
		}
	})
	return CompletionItems;
}

export function resolveCompletionItem(data: number): CompletionItem {
	let CompletedItem: CompletionItem = Syntax.filter((d)=>d.data==data).map((d) : CompletionItem => {
		let markdown: MarkupContent = {
			kind: MarkupKind.Markdown,
			value: d.documentation.join('\n')
		};

		return {
			label: d.label,
			detail: d.detail,
			kind: d.kind,
			data: d.data,
			documentation: markdown
		}
	
	})[0]
	return CompletedItem;
}