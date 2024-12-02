import { readFileSync } from 'node:fs';
export function readJSONFile(file, root= path_root){
	return JSON.parse(readFileSync(new URL(file, root), "utf8"));
}
