const echos= {
	ascurl({ method= "GET", url, headers, body }){
		console.log([
			`curl -X ${method} '${url}'`,
			...Object.entries(headers).map(([k, v])=> `  - H '${k}: ${v}'`),
			body && `  -d '${body}'`
		].filter(Boolean).join("\n"));
	},
	asfetch({ method= "GET", url, headers, body }){
		const headers_str= !headers ? "" : JSON.stringify(headers, null, "	")
			.split("\n")
			.map(line=> "	"+line)
			.join("\n	").trim();
		console.log([
			`const res= await fetch("${url}", {`,
			`	method: "${method}",` + (method=== "GET" ? "// optional" : ""),
			headers_str && `	headers: ${headers_str},`,
			body && `	body: ${body},`,
			`});`
		].join("\n"));
	}
};
export function registerEcho(key, fn){
	echos[key]= fn;
}

const argvKey= "--FTA-";
export function isNotFTA(arg){
	return !arg.startsWith(argvKey);
}
export function handleEcho(argv){
	const { length }= argvKey;
	let echo;
	for(const arg of argv){
		if(!arg.startsWith(argvKey)) continue;

		const key= arg.slice(length);
		echo= echos[key];
		if(!echo) throw new Error(`Unknown echo (argument "${argvKey}${key}")`);
	}
	return echo;
}