# transifex-config
Reads the transifex client config and offers utility methods on top of it.

## Installation
```sh
npm install --save transifex-client
```

## Usage
The module exports a single class, that implements methods to read and get
specific parts of the config for the client.

```js
var TransifexConfig = require("transifex-config");

var txc = new TransifexConifg();
```

## API Documentation
See [API Docs](/docs/api.md).

## Caveats
Most of the implementation in this module assumes the documentation from
transifex for their client's configuration is complete. If that is not the case,
please open an issue.

The documentation doesn't specify it, but resource paths are assumed to be
relative.

## License
This module is licensed under the MIT.
