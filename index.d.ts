/**
 * Wrapper around native `fetch` internally cathces request to be printed
 * with {@link fetchSave} (don’t forget calling it). Or when script is
 * running with `--FTA-*` arguments are printed out with registered echo
 * functions (see {@link registerEcho}).
 *
 * ```js
 * // by default save json reposonse to `response.json`
 * fetch(url, options).then(fetchSave());
 * ```
 * */
export const fetch: typeof globalThis.fetch;
/** Set path root against which relative paths will be resolved. By default it is `pathToFileURL(process.argv[1])`. */
export function setPathRoot(path_root_new: string): void;
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
export function fetchSave<T>({ then, path }: {
	/** Function that will be called on response. */
	then?: (res: Response) => T
	/** Path to save response to. Defaults to `response.json`. */
	path?: string
}): (res: Response) => Promise<T>;
/**
 * Read JSON file. E.g. `readJSONFile("response.json")`.
 * */
export function readJSONFile(file: string, root?: string | URL): any;
/**
 * Check if argument is not `--FTA-*`.
 * ```JavaScript
 * process.argv.filter(isNotFTA);
 * ```
 * */
export function isNotFTA(arg: string): boolean;

export type EchoRequest = {
	/** A string to set request's url. */
	url: string;
	/** A BodyInit object or null to set request's body. */
	body?: string; //BodyInit | null,
	/** A Headers object, an object literal, or an array of two-item arrays to set request's headers. */
	headers?: HeadersInit;
	/** A string to set request's method. */
	method?: string;
};
export type Echo = (request: EchoRequest) => void;
/**
 * Change or register echo function for `--FTA-*` arguments.
 *
 * ```JavaScript
 * // api.js
 * registerEcho("echo", console.log);
 *
 * fetch(url, options).then(fetchSave());
 * ```
 * ```terminal
 * ./api.js --FTA-echo
 * # prints { url, ...options }
 * ```
 * */
export function registerEcho(key: string, fn: Echo): void;
