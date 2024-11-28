# Test API using JavaScript (`fetch`)
Effortlessly manage and execute API requests directly in your JavaScript codebase using
`fetch`. This library is designed for modular and reusable API development, with centralized
configurations and a developer-friendly structure. It serves as an alternative to [Huachao/vscode-restclient: REST Client Extension for Visual Studio Code](https://github.com/Huachao/vscode-restclient).

## Features
- Execute API requests directly through JavaScript.
- Centralized configuration for URLs, headers, and environment variables (moreover if you already
  use JavaScript in your project).
- Modular and reusable structure for managing API endpoints.
- Leverage plain JavaScript constants, variables, and functions.

## Installation (TBD)
To start using the library, install the required dependency:
```bash
# TBD
```

## Usage
While there is no strict pattern, a typical file structure for this library might look like this:

```
api/
├── .api.js
├── .config.js (or .config.json)
├── .env.js (or .env, .env.json)
├── .gitignore
├── auth.js
└── user/
    ├── .config.js
    ├── get.js
    └── post.js
```

### File Conventions
- **Executable Files**: Files not prefixed with a dot (e.g., `auth.js`) contain API logic and can
  be executed directly.
- **Configuration files** (`.config.js`, `.env.js`): store reusable settings. You may prefer
  replacing them with already existing configuration/env files in your project. In case
  of `.env` you may also need to install [dotenv](https://www.npmjs.com/package/dotenv).

### `.gitignore` example
Your `.gitignore` file might look like this:

```
.env.js
response.js
response-*.js
```

### Configuration Files
Both `.config.js` and `.env.js` can be used for configuration. Here are examples of what they might
contain:
```JavaScript
// .config.js
export const url = "https://api.example.com/";
export const headers= {
	"content-type": "application/json",
	"accept": "application/json, plain/text, */*"
};
// Additional configurations like version, etc.

// .env.js
export const token = "secret";
// Additional credentials like client_id, client_secret, etc.
```

### Common Utilities (`.api.js`)
The `.api.js` file consolidates configurations and provides utility imports for streamlined API
requests:
```JavaScript
// .api.js
import { readJSONFile, setPathRoot, fetch, fetchSave } from 'fetch-test-api';
export { readJSONFile, setPathRoot, fetch, fetchSave };
setPathRoot(import.meta.url);

import { url as base, headers } from "./.config.mjs";
const { version= "v1" }= process.env;
const url= base+version+"/";
export { url, headers };
```

This structure simplifies imports in your executable files by centralizing configurations.

A specific configuration (let’s say `version`) can also be defined in the `.config.js` file,
or defined depending on the environment variable (`export const version= process.env.DEV ? "dev" :
"v1"`).


### `auth.js` example
Now lets take a look at the `auth.js` file. This is first executable file, in wich we define the
login logic:
1. **Direct Execution**: Handles login logic and saves the response locally.
1. **Import Usage**: Uses stored credentials to set authorization headers.

```JavaScript
#!/bin/env node
import { argv, exit } from "node:process";
import { pathToFileURL } from "node:url";
import { fetch, fetchSave, url, headers, readJSONFile } from "./api.mjs";
const file_login= "./response-login.json";

// 1. Login Logic (Direct Execution)
if(import.meta.url === pathToFileURL(argv[1]).href){
	const { client_id, client_secret }= readJSONFile("./.env.json");
	await fetch(url+"auth/token", {
		method: "POST",
		headers,
		body: JSON.stringify({
			client_id,
			client_secret,
		})
	})
	.then(fetchSave({
		path: file_login
	}));
	exit(0);
}

// 2. Use Credentials (Import Usage)
const { data }= readJSONFile(file_login, import.meta.url);
headers["Authorization"]= `Bearer ${data.access_token}`;
```

### Recommended Practices
1. **Organize Your Code**: Group related endpoints under directories (e.g. `user/get.js`, `user/post.js`).
1. **Centralize Configuration**: Use `.api.js` to avoid repetitive imports and ensure consistent configurations.
1. **Secure Sensitive Data**: Keep sensitive files (e.g. `.env.js`) out of version control with `.gitignore`.


### `user/*` inspiration
```JavaScript
// user/.config.js
export const endpoint= "user";
```

```JavaScript
// user/get.js
import { fetch, fetchSave, url, headers } from "../.api.js";
import { endpoint } from "./.config.js";
import "../auth.js";

await fetch(url+endpoint, { headers })
	.then(fetchSave());
```

```JavaScript
// user/post.js
import { fetch, fetchSave, url, headers } from "../.api.js";
import { endpoint } from "./.config.js";
import "../auth.js";

await fetch(url+endpoint, {
	method: "POST",
	headers,
	body: JSON.stringify({ name: "John Doe" })
})
	.then(fetchSave());
```
