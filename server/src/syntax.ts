export declare namespace OWKind {
    const Number: 1;
    const Vector: 2;
}
export declare type OWKind = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25;

var Syntax = [
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
		returns: OWKind.Number
	},
	{

	}
]

export default Syntax;