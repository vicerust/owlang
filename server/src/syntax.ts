import {CompletionItemKind} from 'vscode-languageserver-types'

export var OWKind = {
	Wildcard: 0,
    Number: 1,
	Vector: 2,
	Variable: 3,
}

export interface Syntax {
	label: string,
	detail: string,
	documentation?: string[],
	kind: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25,
	args?: object[] | null,
	returns: number | null,
	data: number,
	insertText?: string
}

export var Syntax: Syntax[] = [
	{
		label: "Distance Between",
		detail: "Distance Between(Vector, Vector)",
		documentation: [
			'### Distance Between',
			'Distance Between takes two positions (`Vectors`) and calculates the distance (`Number`) between them.',
			'**Returns a `Number`**',
		],
		kind: CompletionItemKind.Function,
		args: [
			{ returns: OWKind.Vector },
			{ returns: OWKind.Vector }
		],
		returns: OWKind.Number,
		data: 1
	},
	{
		label: "Global Variable",
		detail: "Global Variable(Variable)",
		documentation: [
			'### Global Variable',
			'Global Variable returns the value of a variable belonging to the game itself. Supports variables A-Z',
			'**Returns a `Wildcard`**',
		],
		kind: CompletionItemKind.Function,
		args: [
			{ returns: OWKind.Variable },
		],
		returns: OWKind.Wildcard,
		data: 2
	},
	{
		label: "A (Global Variable)",
		detail: "A Reference to Global Variable A",
		insertText: "A",
		kind: CompletionItemKind.Variable,
		returns: OWKind.Wildcard,
		data: 3
	},
]

