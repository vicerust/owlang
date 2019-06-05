import { CompletionItem, MarkupContent, MarkupKind, TextDocument, Position } from 'vscode-languageserver'
import { Syntax, OWKind } from './syntax'
import { posix } from 'path';

const functionsRegExp = new RegExp(/Absolute Value|Add|Allowed Heroes|Altitude Of|And|Angle Difference|Append To Array|Array Contains|Array Slice|Closest Player To|Compare|Cosine From Degrees|Cosine From Radians|Count Of|Cross Product|Current Array Element|Direction From Angles|Direction Towards|Distance Between|Divide|Dot Product|Entity Exists|Eye Position|Facing Direction Of|Farthest Player From|Filtered Array|First Of|Global Variable|Has Spawned|Has Status|Health|Health Percent|Hero|Hero Icon String|Hero Of|Horizontal Angle From Direction|Horizontal Angle Towards|Horizontal Facing Angle Of|Horizontal Speed Of|Index Of Array Value|Is Alive|Is Button Held|Is Communicating|Is Communicating Any|Is Communicating Any Emote|Is Communicating Any Voice Line|Is Crouching|Is Dead|Is Firing Primary|Is Firing Secondary|Is In Air|Is In Line Of Sight|Is In Spawn Room|Is In View Angle|Is Moving|Is On Ground|Is On Objective|Is On Wall|Is Portrait On Fire|Is Standing|Is True For All|Is True For Any|Is Using Ability 1|Is Using Ability 2|Is Using Ultimate|Last Of|Local Vector Of|Max|Max Health|Min|Modulo|Multiply|Nearest Walkable Position|Normalize|Not|Number|Number Of Deaths|Number Of Eliminations|Number Of Final Blows|Opposite Team Of|Or|Player Closest To Reticle|Player Variable|Players In Slot|Players In View Angle|Players Within Radius|Position Of|Raise To Power|Random Integer|Random Real|Random Value In Array|Randomized Array|Ray Cast Hit Normal|Ray Cast Hit Player|Ray Cast Hit Position|Remove From Array|Round To Integer|Score Of|Sine From Degrees|Sine From Radians|Slot Of|Sorted Array|Speed Of|Speed Of In Direction|Square Root|String|Subtract|Team|Team Of|Team Score|Throttle Of|Ultimate Charge Percent|Value In Array|Vector|Vector Towards|Velocity Of|Vertical Angle From Direction|Vertical Angle Towards|Vertical Facing Angle Of|Vertical Speed Of|World Vector Of|X Component Of|Y Component Of|Z Component Of/g);

interface looseObj {
	[key: string]: any
}

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
		
		var returnObj: looseObj = {
			label: d.label,
			detail: d.detail,
			kind: d.kind,
			data: d.data,
		}
		if(d.insertText) { returnObj.insertText = d.insertText }

		if(d.documentation) { 
			let markdown: MarkupContent = {
				kind: MarkupKind.Markdown,
				value: d.documentation.join('\n')
			};
			returnObj.documentation = markdown
		}

		return returnObj as CompletionItem;
	
	})[0]
	return CompletedItem;
}





export function hoverHandler(pos: Position, doc: TextDocument): string | MarkupContent {
	var text = doc.getText({
		start: { line: pos.line, character: 0 },
		end: { line: pos.line, character: 99999 }
	})

	var matches = []

	do {
		var m = functionsRegExp.exec(text);
		if(m==null) break;

		matches.push({
			match: m[0],
			index: m.index
		})
	} while (m);

	matches = matches.filter((d) => {
		return d.index < pos.character && pos.character < (d.index + d.match.length)
	})

	if(matches[0] == null) return "";
	var match = matches[0].match;
	
	var r = Syntax.find((d)=>d.label == match)
	if(!r) return "";

	if(r.documentation) {
		let markdown: MarkupContent = {
			kind: MarkupKind.Markdown,
			value: r.documentation.join('\n')
		};
		return markdown
	}

	return r.detail
}