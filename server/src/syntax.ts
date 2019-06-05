export var OWKind = {
    Number: 1,
    Vector: 2,
}

export interface Syntax {
	label: string,
	detail: string,
	documentation: string[],
	kind: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25,
	args: object[] | null,
	returns: number | null,
	data: number
}

export var Syntax: Syntax[] = [
	{
		label: "Distance Between",
		detail: "Distance Between(,)",
		documentation: [
			'## Distance Between',
			'Distance Between takes two positions (`Vectors`) and calculates the distance (`Number`) between them.',
			'**Returns a `Number`**',
		],
		kind: 3,
		args: [
			{ returns: OWKind.Vector },
			{ returns: OWKind.Vector }
		],
		returns: OWKind.Number,
		data: 1
	}
]