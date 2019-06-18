import { CompletionItem, MarkupContent, MarkupKind, TextDocument, Position, SymbolInformation, SymbolKind, CompletionItemKind, TextDocumentPositionParams, SignatureHelp, ParameterInformation } from 'vscode-languageserver'
import { Syntax, OWKind } from './syntax'
import { posix } from 'path';
var balanced = require('node-balanced');
var bmatch = require('balanced-match');
var parse = require('parenthesis')

const functionsRegExp = new RegExp(/A|Absolute Value|Add|Allowed Heroes|Altitude Of|And|Angle Difference|Append To Array|Array Contains|Array Slice|Closest Player To|Compare|Cosine From Degrees|Cosine From Radians|Count Of|Cross Product|Current Array Element|Direction From Angles|Direction Towards|Distance Between|Divide|Dot Product|Entity Exists|Eye Position|Facing Direction Of|Farthest Player From|Filtered Array|First Of|Global Variable|Has Spawned|Has Status|Health|Health Percent|Hero|Hero Icon String|Hero Of|Horizontal Angle From Direction|Horizontal Angle Towards|Horizontal Facing Angle Of|Horizontal Speed Of|Index Of Array Value|Is Alive|Is Button Held|Is Communicating|Is Communicating Any|Is Communicating Any Emote|Is Communicating Any Voice Line|Is Crouching|Is Dead|Is Firing Primary|Is Firing Secondary|Is In Air|Is In Line Of Sight|Is In Spawn Room|Is In View Angle|Is Moving|Is On Ground|Is On Objective|Is On Wall|Is Portrait On Fire|Is Standing|Is True For All|Is True For Any|Is Using Ability 1|Is Using Ability 2|Is Using Ultimate|Last Of|Local Vector Of|Max|Max Health|Min|Modulo|Multiply|Nearest Walkable Position|Normalize|Not|Number|Number Of Deaths|Number Of Eliminations|Number Of Final Blows|Opposite Team Of|Or|Player Closest To Reticle|Player Variable|Players In Slot|Players In View Angle|Players Within Radius|Position Of|Raise To Power|Random Integer|Random Real|Random Value In Array|Randomized Array|Ray Cast Hit Normal|Ray Cast Hit Player|Ray Cast Hit Position|Remove From Array|Round To Integer|Score Of|Sine From Degrees|Sine From Radians|Slot Of|Sorted Array|Speed Of|Speed Of In Direction|Square Root|String|Subtract|Team|Team Of|Team Score|Throttle Of|Ultimate Charge Percent|Value In Array|Vector|Vector Towards|Velocity Of|Vertical Angle From Direction|Vertical Angle Towards|Vertical Facing Angle Of|Vertical Speed Of|World Vector Of|X Component Of|Y Component Of|Z Component Of/g);

interface looseObj {
	[key: string]: any
}

import * as ow from './workshop.json';
import { type } from 'os';
var owAll = [...ow.actions, ...ow.values];
var owNameStrings = [...ow.actions.map((d)=>d.name), ...ow.values.map((d)=>d.name)].sort().reverse().join('|')
var nameStringRE = new RegExp(owNameStrings, "g")
var functionsRE = new RegExp('('+ owNameStrings +')\\(', "g")



Object.defineProperty(Array.prototype, 'flat', {
    value: function(depth: number = 1) {
		//@ts-ignore
      return this.reduce(function (flat, toFlatten) {
        return flat.concat((Array.isArray(toFlatten) && (depth>1)) ? toFlatten.flat(depth-1) : toFlatten);
      }, []);
    }
});

function getArgString(method: string) {
	//@ts-ignore
	var methodRef = owAll.find((d) => {
		return d.name == method
	})
	if(methodRef == null) { return ""}
	//@ts-ignore
	var argsString = methodRef.args.map((d) => {
		return d.name + ': ' + d.type + ', '
	});
	//@ts-ignore
	return methodRef.name + '(' + argsString.join('') + ')'
}


export function getCompletionItems() {

	let ActionItems: CompletionItem[] = ow.actions.map((d) : CompletionItem => {
		return {
			label: d.name,
			kind: CompletionItemKind.Method,
		}
	})

	let ValueItems: CompletionItem[] = ow.values.map((d) : CompletionItem => {
		return {
			label: d.name,
			kind: CompletionItemKind.Value,
		}
	})
		
	var types = ow.types.map((d) => {return d.values}) as []
	
	var flat = types.flat();
	
	let TypeItems: CompletionItem[] = flat.map((d) : CompletionItem => {
		return {
			label: d as string,
			kind: CompletionItemKind.Constant,
		}
	})

	return [...ActionItems, ...ValueItems, ...TypeItems];
}


export function completionRequiresContext(doc: TextDocument, pos: Position) {

	var {matchLabel, argNumber} = getSignatureInfo(doc, pos)

	if(matchLabel==null||argNumber==null){
		return false
	}

	var signature = owAll.find((d) => d.name==matchLabel)
	if(signature == null || signature.args == null){return false}
	//@ts-ignore
	var typeRef = ow.types.find((d) => d.name == signature.args[argNumber].type)

	//@ts-ignore
	var items = [...typeRef.extends.filter((d) => d != "Any").map((d) => ow.types.find((e) => e.name == d).values).flat(), ...typeRef.values]

	return items
}

export function getCompletionItemsWithContext() {
	return [] as CompletionItem[]
}

export function resolveCompletionItem(item: CompletionItem): CompletionItem {

	let CompletedItem: CompletionItem = owAll.filter((d)=>d.name==item.label).map((d) : CompletionItem => {
		
		var returnObj: looseObj = {
			label: item.label,
			kind: item.kind
		}
		var argString = getArgString(item.label);

		if(d.description) { 
			let markdown: MarkupContent = {
				kind: MarkupKind.Markdown,
				value: ['```ow', argString, '```', '-----', d.description].join('\n')
			};
			returnObj.documentation = markdown
		}

		return returnObj as CompletionItem;
	
	})[0]
	return CompletedItem;
}


function getSignatureInfo(doc: TextDocument, pos: Position) : looseObj {
	try{
	var parseToLastRE = new RegExp(/[^(,]*\(___\d___\)/)
	var matches = [];

	var text = doc.getText({
		start: { line: pos.line, character: 0 },
		end: { line: pos.line, character: 999999 }
	});

	var sliced = text.slice(0, pos.character)

	var parsed = parse(sliced, {
		brackets: ['()'],
		flat: true
	})

	var finalText = parsed[0].replace(/[^(,]*\(___\d___\)/g, '')

	do {
		var m = functionsRE.exec(finalText);
		if(m==null) break;
		
		matches.push({
			//@ts-ignore
			match: m[0],
			index: m.index
		})
	} while (m);

	console.log('testing');
	var argStr = sliced.split(matches[matches.length-1].match)[1]
	if(argStr == '') {
		var argNumber  = 0;
	} else {
		var argStrMatch = argStr.match(/,/g);
		if(argStrMatch==null) {
			var argNumber = 0;
		} else {
			var argNumber = argStrMatch.length
		}
	}

	var matchLabel = matches[matches.length-1].match.slice(0, matches[matches.length-1].match.length - 1)

	return {
		matchLabel: matchLabel,
		argNumber: argNumber
	}

	} catch (e) {
		return {matchLabel: null, argNumber: null}
	}
}

export function signatureHelp(params: TextDocumentPositionParams, doc: TextDocument, pos: Position) : SignatureHelp {
	var { matchLabel, argNumber } = getSignatureInfo(doc, pos);
	if(matchLabel==null||argNumber==null) {return {} as SignatureHelp}

	var signature = owAll.find((d) => d.name==matchLabel)
	if(signature==null){return {} as SignatureHelp}

	var returnObj: looseObj = {
		label: matchLabel,
		parameters: []
	}
	var argString = getArgString(matchLabel);

	signature.args.forEach((d) => {
		var typeMatch = ow.types.find((e) => e.name == d.type)
		var possibleTypes;
		if(typeMatch) {
			possibleTypes = typeMatch.values.join(',  ')
		}
		let markdown: MarkupContent = {
			kind: MarkupKind.Markdown,
			value: ['```ow',
					 d.name + ': ' + d.type,
					'```',
					'-----',
					d.description,'',
					'-----',
					'### Possible Values',
					'```ow',
					possibleTypes,
					'```'
				].join('\n')
		};
		returnObj.parameters.push({
			label: d.name,
			documentation: markdown
		})
	})
		
	

	return {
		signatures: [returnObj],
		activeSignature: 0,
		activeParameter: argNumber
	} as SignatureHelp
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


function resolveSymbolFromPosition(doc: TextDocument, pos: Position) {

}

export function resolveSymbols(uri: string, doc: TextDocument): SymbolInformation[] {

	var text = doc.getText();
	var matches = balanced.matches({
		source: text,
		head: /rule/,
		open: '{',
		close: '}'
	});
	


	return []
}