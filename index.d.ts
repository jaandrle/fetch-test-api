/**
 * Wrapper around native `fetch` printing request and response to console.
 * And saving body response to `response.json` file.
 *
 *
 * Don’t forget to call {@link fetchSave} after `fetch` call.
 * ```js
 * // by default save json reposonse to `response.json`
 * fetch(url, options)
 * .then(fetchSave());
 * ```
 * */
export const fetch: typeof fetchOriginal;
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
export function fetchSave<T>({
	then= res=> res.json(),
	path= "response.json"
}: {
	/** Function that will be called on response. */
	then?: (res: Response) => T
	/** Path to save response to. Defaults to `response.json`. */
	path?: string
}): (res: Response) => Promise<T>;
/**
 * Read JSON file. E.g. `readJSONFile("response.json")`.
 * */
export function readJSONFile(file: string, root?: string | URL): any;
