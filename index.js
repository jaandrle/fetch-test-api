import { readFileSync, writeFileSync } from 'node:fs';
import { argv, exit, stdout } from "node:process";
import { pathToFileURL } from "node:url";
import { handleEcho, isNotFTA, registerEcho } from "./src/as.js";

export { isNotFTA, registerEcho };

let path_root= pathToFileURL(argv[1]);
export function setPathRoot(path_root_new){
	path_root= path_root_new;
}
export function readJSONFile(file, root= path_root){
	return JSON.parse(readFileSync(new URL(file, root), "utf8"));
}

const tmp= new WeakMap();
const fetchOriginal= globalThis.fetch;
export const fetch= function(url, { method, headers, body, ...options }= {}){
	const to_log= {
		argv,
		duration_ms: -Date.now(),
		request: {
			method,
			url,
			headers,
			body
		}
	};
	const echo= handleEcho(argv);
	if(echo){
		echo(to_log.request, options);
		return exit(0);
	}
	return fetchOriginal(url, {
		headers,
		method,
		body,
		...options
	}).then(res=> {
		tmp.set(res, to_log);
		return res;
	});
}
export function fetchSave({
	then= res=> res.json(),
	path= "response.json",
	exit: exitOnEnd= false,
}= {}){
	const path_url= new URL(path, path_root);
	return res=> {
		const res_clone= res.clone();
		let to_log= tmp.get(res);
		to_log.duration_ms+= Date.now();
		to_log= Object.assign(to_log, {
			response: responseToObject(res, path),
		});
		console.log(!stdout.isTTY ? JSON.stringify(to_log, null, "	") : to_log);
		return then(res)
			.catch(err=> err)
			.then(async body=> {
				let is_error= false;
				if(body instanceof Error){
					is_error= true;
					body= { name: body.name, message: body.message, stack: body.stack };
				}
				if(body.name==="SyntaxError")
					body.rawText= await res_clone.text();

				writeFileSync(path_url, JSON.stringify(body, null, "	"));
				if(is_error) throw body;
				if(exitOnEnd) exit(0);
				return body;
			});
	};
}
function responseToObject(res, file_out){
	return {
		ok: res.ok,
		status: res.status,
		statusText: res.statusText,
		headers: Object.fromEntries(res.headers.entries()),
		body: `Body saved to '${file_out}'`
	};
}
