import { readFileSync, writeFileSync } from 'node:fs';
import { argv, stdout } from "node:process";
import { pathToFileURL } from "node:url";
const tmp= new WeakMap();
const fetchOriginal= globalThis.fetch;
let path_root= pathToFileURL(argv[1]);
export function setPathRoot(path_root_new){
	path_root= path_root_new;
}
export const fetch= function(url, { method, headers, body, ...rest_body }= {}){
	const to_log= {
		argv: argv,
		duration_ms: -Date.now(),
		request: {
			method,
			url,
			headers,
			body
		}
	};
	return fetchOriginal(url, {
		headers,
		method,
		body,
		...rest_body
	}).then(res=> {
		tmp.set(res, to_log);
		return res;
	});
}
/**
 * This is helper function for saving {@link fetch} response into the file
 * and printing request and response info it to the console.
 * ```js
 * // by default save json reposonse to `response.json`
 * fetch(url, options)
 * .then(fetchSave());
 * fetch(url, options)
 * .then(fetchSave({ path: "response-my.json" }));
 *
 * // save text response to `response.txt`
 * fetch(url, options)
 * .then(fetchSave({
 * 	then: res=> res.text(),
 * 	path: "response.txt"
 * }));
 * ```
 * */
export function fetchSave({
	then= res=> res.json(),
	path= "response.json"
}= {}){
	const path_url= new URL(path, path_root);
	return res=> {
		let to_log= tmp.get(res);
		to_log.duration_ms+= Date.now();
		to_log= Object.assign(to_log, {
			response: responseToObject(res, path),
		});
		console.log(!stdout.isTTY ? JSON.stringify(to_log, null, "	") : to_log);
		return then(res)
			.catch(err=> err)
			.then(body=> {
				let is_error= false;
				if(body instanceof Error){
					is_error= true;
					body= { name: body.name, message: body.message, stack: body.stack };
				}
				writeFileSync(path_url, JSON.stringify(body, null, "	"));
				if(is_error) throw body;
				return body;
			});
	};
}
export function readJSONFile(file, root= path_root){
	return JSON.parse(readFileSync(new URL(file, root), "utf8"));
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
