import { CompletionItem, MarkupContent, MarkupKind, TextDocument, Position, SymbolInformation, SymbolKind, CompletionItemKind } from 'vscode-languageserver'
import { Syntax, OWKind } from './syntax'
import { posix } from 'path';
var balanced = require('node-balanced');

const functionsRegExp = new RegExp(/A|Absolute Value|Add|Allowed Heroes|Altitude Of|And|Angle Difference|Append To Array|Array Contains|Array Slice|Closest Player To|Compare|Cosine From Degrees|Cosine From Radians|Count Of|Cross Product|Current Array Element|Direction From Angles|Direction Towards|Distance Between|Divide|Dot Product|Entity Exists|Eye Position|Facing Direction Of|Farthest Player From|Filtered Array|First Of|Global Variable|Has Spawned|Has Status|Health|Health Percent|Hero|Hero Icon String|Hero Of|Horizontal Angle From Direction|Horizontal Angle Towards|Horizontal Facing Angle Of|Horizontal Speed Of|Index Of Array Value|Is Alive|Is Button Held|Is Communicating|Is Communicating Any|Is Communicating Any Emote|Is Communicating Any Voice Line|Is Crouching|Is Dead|Is Firing Primary|Is Firing Secondary|Is In Air|Is In Line Of Sight|Is In Spawn Room|Is In View Angle|Is Moving|Is On Ground|Is On Objective|Is On Wall|Is Portrait On Fire|Is Standing|Is True For All|Is True For Any|Is Using Ability 1|Is Using Ability 2|Is Using Ultimate|Last Of|Local Vector Of|Max|Max Health|Min|Modulo|Multiply|Nearest Walkable Position|Normalize|Not|Number|Number Of Deaths|Number Of Eliminations|Number Of Final Blows|Opposite Team Of|Or|Player Closest To Reticle|Player Variable|Players In Slot|Players In View Angle|Players Within Radius|Position Of|Raise To Power|Random Integer|Random Real|Random Value In Array|Randomized Array|Ray Cast Hit Normal|Ray Cast Hit Player|Ray Cast Hit Position|Remove From Array|Round To Integer|Score Of|Sine From Degrees|Sine From Radians|Slot Of|Sorted Array|Speed Of|Speed Of In Direction|Square Root|String|Subtract|Team|Team Of|Team Score|Throttle Of|Ultimate Charge Percent|Value In Array|Vector|Vector Towards|Velocity Of|Vertical Angle From Direction|Vertical Angle Towards|Vertical Facing Angle Of|Vertical Speed Of|World Vector Of|X Component Of|Y Component Of|Z Component Of/g);

interface looseObj {
	[key: string]: any
}

import * as ow from './workshop.json';

Object.defineProperty(Array.prototype, 'flat', {
    value: function(depth: number = 1) {
		//@ts-ignore
      return this.reduce(function (flat, toFlatten) {
        return flat.concat((Array.isArray(toFlatten) && (depth>1)) ? toFlatten.flat(depth-1) : toFlatten);
      }, []);
    }
});

export function getCompletionItems() {
	var oww = ow;

	let ActionItems: CompletionItem[] = oww.actions.map((d) : CompletionItem => {
		return {
			label: d.name,
			detail: d.description,
			kind: CompletionItemKind.Method,
		}
	})

	let ValueItems: CompletionItem[] = oww.values.map((d) : CompletionItem => {
		return {
			label: d.name,
			detail: d.description,
			kind: CompletionItemKind.Value,
		}
	})
		
	var types = oww.types.map((d) => {return d.values}) as []
	
	var flat = types.flat();
	
	let TypeItems: CompletionItem[] = flat.map((d) : CompletionItem => {
		return {
			label: d as string,
			kind: CompletionItemKind.Constant,
		}
	})

	return [...ActionItems, ...ValueItems, ...TypeItems];
}


export function resolveCompletionItem(data: any): CompletionItem {

	let CompletedItem: CompletionItem = Syntax.filter((d)=>d.label==data).map((d) : CompletionItem => {
		
		var returnObj: looseObj = {
			label: d.label,
			kind: d.kind,
			data: d.data,
		}
		if(d.insertText) { returnObj.insertText = d.insertText }
		if(d.detail) { returnObj.detail = d.detail }

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

	return r.detail as string
}


export function resolveSymbols(uri: string, doc: TextDocument): SymbolInformation[] {

	var text = doc.getText();
	var matches = balanced.matches({
		source: text,
		head: /rule/,
		open: '{',
		close: '}'
	});
	


	return [
		{
			name: 'Reset on Floor Touch',
			kind: SymbolKind.Method,
			location: {
				uri: uri,
				range: {
					start: { line: 0, character: 0},
					end: { line: 31, character: 1}
				}
			}
		},
		{
			name: 'Event',
			kind: SymbolKind.EnumMember,
			containerName: 'Reset on Floor Touch',
			location: {
				uri: uri,
				range: {
					start: { line: 2, character: 4},
					end: { line: 7, character: 4}
				}
			}
		},
		{
			name: 'Conditions',
			kind: SymbolKind.Enum,
			containerName: 'Reset on Floor Touch',
			location: {
				uri: uri,
				range: {
					start: { line: 9, character: 4},
					end: { line: 18, character: 4}
				}
			}
		},
		{
			name: 'Actions',
			kind: SymbolKind.String,
			containerName: 'Reset on Floor Touch',
			location: {
				uri: uri,
				range: {
					start: { line: 20, character: 4},
					end: { line: 30, character: 4}
				}
			}
		},
	]
}