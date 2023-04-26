## Modules

<dl>
<dt><a href="#module_transifex-config/lib/errors">transifex-config/lib/errors</a></dt>
<dd></dd>
<dt><a href="#module_transifex-config/lib/load-config">transifex-config/lib/load-config</a></dt>
<dd></dd>
<dt><a href="#module_transifex-config/lib/match-resource">transifex-config/lib/match-resource</a> ⇒ <code>string</code> | <code>boolean</code></dt>
<dd></dd>
<dt><a href="#module_transifex-config/lib/parse-langmap">transifex-config/lib/parse-langmap</a> ⇒ <code>Record.&lt;string, string&gt;</code></dt>
<dd><p>Parses the language map.</p>
</dd>
<dt><a href="#module_transifex-config/lib/parse-rc">transifex-config/lib/parse-rc</a> ⇒ <code>module:transifex-config~ParsedConfig</code></dt>
<dd><p>Parse a transifex client configuration file. Looks at the file line by line.</p>
</dd>
</dl>

## Classes

<dl>
<dt><a href="#transifex-config">transifex-config</a></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#MAP_MIN_LENGTH">MAP_MIN_LENGTH</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#_getRC">_getRC([service])</a> ⇒ <code>module:transifex-config~ParsedConfig</code></dt>
<dd></dd>
<dt><a href="#matchFileFilter">matchFileFilter(basePath, localPath, fileFilter)</a> ⇒ <code>string</code> | <code>boolean</code></dt>
<dd><p>Check if a file matches the file_filter rule.</p>
</dd>
<dt><a href="#ensureObjectKeyPath">ensureObjectKeyPath(keyPath, object)</a> ⇒ <code>object</code></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#ConfigSection">ConfigSection</a> : <code>Record.&lt;string, string&gt;</code></dt>
<dd><p>Has a property for each key in the section, with trimmed name and value.</p>
</dd>
<dt><a href="#ParsedConfig">ParsedConfig</a> : <code>Record.&lt;string, module:transifex-config~ConfigSection&gt;</code></dt>
<dd><p>Has a property for each section in the config. Each section has a property
named after the key with its value assigned.</p>
</dd>
</dl>

<a name="module_transifex-config/lib/errors"></a>

## transifex-config/lib/errors
**Author**: Martin Giger  
**License**: MIT  

* [transifex-config/lib/errors](#module_transifex-config/lib/errors)
    * [.NoMatchingResourceError](#module_transifex-config/lib/errors.NoMatchingResourceError)
        * [new exports.NoMatchingResourceError(resource)](#new_module_transifex-config/lib/errors.NoMatchingResourceError_new)
    * [.MatchesSourceError](#module_transifex-config/lib/errors.MatchesSourceError)
        * [new exports.MatchesSourceError(resource)](#new_module_transifex-config/lib/errors.MatchesSourceError_new)

<a name="module_transifex-config/lib/errors.NoMatchingResourceError"></a>

### transifex-config/lib/errors.NoMatchingResourceError
**Kind**: static class of [<code>transifex-config/lib/errors</code>](#module_transifex-config/lib/errors)  
**Implements**: <code>Error</code>  
<a name="new_module_transifex-config/lib/errors.NoMatchingResourceError_new"></a>

#### new exports.NoMatchingResourceError(resource)

| Param | Type | Description |
| --- | --- | --- |
| resource | <code>string</code> | Path to the resource that has no matching config entry. |

<a name="module_transifex-config/lib/errors.MatchesSourceError"></a>

### transifex-config/lib/errors.MatchesSourceError
**Kind**: static class of [<code>transifex-config/lib/errors</code>](#module_transifex-config/lib/errors)  
**Implements**: <code>Error</code>  
<a name="new_module_transifex-config/lib/errors.MatchesSourceError_new"></a>

#### new exports.MatchesSourceError(resource)

| Param | Type | Description |
| --- | --- | --- |
| resource | <code>string</code> | Path to the resource that is the source file. |

<a name="module_transifex-config/lib/load-config"></a>

## transifex-config/lib/load-config
**Author**: Martin Giger  
**License**: MIT  

* [transifex-config/lib/load-config](#module_transifex-config/lib/load-config)
    * _static_
        * [.TRANSIFEXRC](#module_transifex-config/lib/load-config.TRANSIFEXRC) : <code>string</code>
        * [.TXCONFIG](#module_transifex-config/lib/load-config.TXCONFIG) : <code>string</code>
        * [.txconfig(basePath)](#module_transifex-config/lib/load-config.txconfig) ⇒ <code>module:transifex-config~ParsedConfig</code>
        * [.transifexrc(basePath, [service])](#module_transifex-config/lib/load-config.transifexrc) ⇒ <code>module:transifex-config~ParsedConfig</code>
    * _inner_
        * [~loadConfig(configPath)](#module_transifex-config/lib/load-config..loadConfig) ⇒ <code>string</code>
        * [~normalizeRC(rc)](#module_transifex-config/lib/load-config..normalizeRC) ⇒ <code>module:transifex-config~ParsedConfig</code>

<a name="module_transifex-config/lib/load-config.TRANSIFEXRC"></a>

### transifex-config/lib/load-config.TRANSIFEXRC : <code>string</code>
File name of the config file from the base path.

**Kind**: static constant of [<code>transifex-config/lib/load-config</code>](#module_transifex-config/lib/load-config)  
**Read only**: true  
<a name="module_transifex-config/lib/load-config.TXCONFIG"></a>

### transifex-config/lib/load-config.TXCONFIG : <code>string</code>
File name of the rc file from the base path.

**Kind**: static constant of [<code>transifex-config/lib/load-config</code>](#module_transifex-config/lib/load-config)  
**Read only**: true  
<a name="module_transifex-config/lib/load-config.txconfig"></a>

### transifex-config/lib/load-config.txconfig(basePath) ⇒ <code>module:transifex-config~ParsedConfig</code>
Loads and parses the transifex client config.

**Kind**: static method of [<code>transifex-config/lib/load-config</code>](#module_transifex-config/lib/load-config)  
**Returns**: <code>module:transifex-config~ParsedConfig</code> - Parsed contents of the config.  
**Throws**:

- The config could not be read.


| Param | Type | Description |
| --- | --- | --- |
| basePath | <code>string</code> | Path the config is in. |

<a name="module_transifex-config/lib/load-config.transifexrc"></a>

### transifex-config/lib/load-config.transifexrc(basePath, [service]) ⇒ <code>module:transifex-config~ParsedConfig</code>
Loads and parses the transifex login info.

**Kind**: static method of [<code>transifex-config/lib/load-config</code>](#module_transifex-config/lib/load-config)  
**Returns**: <code>module:transifex-config~ParsedConfig</code> - Parsed contents of the rc.  
**Throws**:

- The rc could not be read.


| Param | Type | Description |
| --- | --- | --- |
| basePath | <code>string</code> | Path the rc is in. |
| [service] | <code>string</code> | Service host the RC should contain. |

<a name="module_transifex-config/lib/load-config..loadConfig"></a>

### transifex-config/lib/load-config~loadConfig(configPath) ⇒ <code>string</code>
Loads a file from the given path and returns its contents.

**Kind**: inner method of [<code>transifex-config/lib/load-config</code>](#module_transifex-config/lib/load-config)  
**Returns**: <code>string</code> - Contents of the file.  
**Throws**:

- The file could not be read.


| Param | Type | Description |
| --- | --- | --- |
| configPath | <code>string</code> | Path to the file to load. |

<a name="module_transifex-config/lib/load-config..normalizeRC"></a>

### transifex-config/lib/load-config~normalizeRC(rc) ⇒ <code>module:transifex-config~ParsedConfig</code>
Fixes the header names of the RC by re-assembling the host names instead of
each domain part being a subsection.

**Kind**: inner method of [<code>transifex-config/lib/load-config</code>](#module_transifex-config/lib/load-config)  
**Returns**: <code>module:transifex-config~ParsedConfig</code> - Normalized RC.  

| Param | Type | Description |
| --- | --- | --- |
| rc | <code>object</code> | RC to normalize. |

<a name="module_transifex-config/lib/match-resource"></a>

## transifex-config/lib/match-resource ⇒ <code>string</code> \| <code>boolean</code>
**Returns**: <code>string</code> \| <code>boolean</code> - Returns the language if the file matches the
         resource, else returns false.  

| Param | Type | Description |
| --- | --- | --- |
| basePath | <code>string</code> | Base path to the transifex config. |
| localPath | <code>string</code> | Full path to the resource file to match. |
| resource | <code>string</code> | Resource to check if the local file matches. |

<a name="module_transifex-config/lib/parse-langmap"></a>

## transifex-config/lib/parse-langmap ⇒ <code>Record.&lt;string, string&gt;</code>
Parses the language map.

**Returns**: <code>Record.&lt;string, string&gt;</code> - A map of the language, with the local
         language code as key and the remote language code as value.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [langMapString] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | Language map specification. |
| [langMap] | <code>object</code> | <code>{}</code> | Language map to inherit from. |

<a name="module_transifex-config/lib/parse-rc"></a>

## transifex-config/lib/parse-rc ⇒ <code>module:transifex-config~ParsedConfig</code>
Parse a transifex client configuration file. Looks at the file line by line.

**Returns**: <code>module:transifex-config~ParsedConfig</code> - Configuration file
         represented as an object.  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>string</code> | Configuration file contents. |

<a name="transifex-config"></a>

## transifex-config
**Kind**: global class  

* [transifex-config](#transifex-config)
    * [new TransifexConfig([basePath])](#new_transifex-config_new)
    * [.basePath](#transifex-config+basePath) : <code>string</code>
    * [.getRC](#transifex-config+getRC) ⇐ <code>module:transifex-config~\_getRC</code>
    * [.getConfig()](#transifex-config+getConfig) ⇒ <code>module:transifex-config~ParsedConfig</code>
    * [.getResources()](#transifex-config+getResources) ⇒ <code>Array.&lt;module:transifex-config~ConfigSection&gt;</code>
    * [.getResource(localPath, [matchSourceLang])](#transifex-config+getResource) ⇒ <code>module:transifex-config~ConfigSection</code>
    * [.isSourceResource(resourcePath)](#transifex-config+isSourceResource) ⇒ <code>boolean</code>
    * [.getMappedLang(lang, resource)](#transifex-config+getMappedLang) ⇒ <code>string</code>

<a name="new_transifex-config_new"></a>

### new TransifexConfig([basePath])
**Throws**:

- The .transifexrc or .tx/config can not be found.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [basePath] | <code>string</code> | <code>&quot;require(\&quot;app-root-path\&quot;)&quot;</code> | Path the transifex configuration is in. Defaults                              to the best guess of the package root. |

<a name="transifex-config+basePath"></a>

### transifex-config.basePath : <code>string</code>
Base path the config is read from.

**Kind**: instance property of [<code>transifex-config</code>](#transifex-config)  
<a name="transifex-config+getRC"></a>

### transifex-config.getRC ⇐ <code>module:transifex-config~\_getRC</code>
Memoized version of [module:transifex-config~_getRC](module:transifex-config~_getRC).

**Kind**: instance property of [<code>transifex-config</code>](#transifex-config)  
**Extends**: <code>module:transifex-config~\_getRC</code>  
<a name="transifex-config+getConfig"></a>

### transifex-config.getConfig() ⇒ <code>module:transifex-config~ParsedConfig</code>
**Kind**: instance method of [<code>transifex-config</code>](#transifex-config)  
**Returns**: <code>module:transifex-config~ParsedConfig</code> - Parsed .tx/config as an
         object. Will be cached.  
**Throws**:

- The config could not be read.

<a name="transifex-config+getResources"></a>

### transifex-config.getResources() ⇒ <code>Array.&lt;module:transifex-config~ConfigSection&gt;</code>
**Kind**: instance method of [<code>transifex-config</code>](#transifex-config)  
**Returns**: <code>Array.&lt;module:transifex-config~ConfigSection&gt;</code> - Array of resources.  
**Throws**:

- The config could not be read.

<a name="transifex-config+getResource"></a>

### transifex-config.getResource(localPath, [matchSourceLang]) ⇒ <code>module:transifex-config~ConfigSection</code>
**Kind**: instance method of [<code>transifex-config</code>](#transifex-config)  
**Returns**: <code>module:transifex-config~ConfigSection</code> - Config section for the
         resource.  
**Throws**:

- [<code>NoMatchingResourceError</code>](#module_transifex-config/lib/errors.NoMatchingResourceError) There
        is no matching resource.
- The config could not be read.


| Param | Type | Description |
| --- | --- | --- |
| localPath | <code>string</code> | Absolute local path of the resource to return the                             config entry of. |
| [matchSourceLang] | <code>boolean</code> | If the resource should be returned                                            when the path is for the source                                            language of the resource. |

<a name="transifex-config+isSourceResource"></a>

### transifex-config.isSourceResource(resourcePath) ⇒ <code>boolean</code>
Check if a resource is the source resource.

**Kind**: instance method of [<code>transifex-config</code>](#transifex-config)  
**Returns**: <code>boolean</code> - If the resource is the source.  
**Throws**:

- The config could not be read.


| Param | Type | Description |
| --- | --- | --- |
| resourcePath | <code>string</code> | Path to check. |

<a name="transifex-config+getMappedLang"></a>

### transifex-config.getMappedLang(lang, resource) ⇒ <code>string</code>
**Kind**: instance method of [<code>transifex-config</code>](#transifex-config)  
**Returns**: <code>string</code> - Mapped language code.  
**Throws**:

- The config could not be read.


| Param | Type | Description |
| --- | --- | --- |
| lang | <code>string</code> | Language code to map from local to external. |
| resource | <code>module:transifex-config~ConfigSection</code> | Resource to get map                                                           the language for. |

<a name="MAP_MIN_LENGTH"></a>

## MAP\_MIN\_LENGTH
**Kind**: global constant  
**Author**: Martin Giger  
**License**: MIT  
<a name="_getRC"></a>

## \_getRC([service]) ⇒ <code>module:transifex-config~ParsedConfig</code>
**Kind**: global function  
**Returns**: <code>module:transifex-config~ParsedConfig</code> - Parsed .transifexrc as an
         object. Will be cached.  
**Throws**:

- The .transifexrc could not be read.

**this**: <code>{TransifexConfig}</code>  

| Param | Type | Description |
| --- | --- | --- |
| [service] | <code>string</code> | The config should contain this service URL. |

<a name="matchFileFilter"></a>

## matchFileFilter(basePath, localPath, fileFilter) ⇒ <code>string</code> \| <code>boolean</code>
Check if a file matches the file_filter rule.

**Kind**: global function  
**Returns**: <code>string</code> \| <code>boolean</code> - REturns the language the file matches or false.  

| Param | Type | Description |
| --- | --- | --- |
| basePath | <code>string</code> | Base path to the transifex config. |
| localPath | <code>string</code> | Full path to the resource file to match. |
| fileFilter | <code>string</code> | File filter the resource should match. |

<a name="ensureObjectKeyPath"></a>

## ensureObjectKeyPath(keyPath, object) ⇒ <code>object</code>
**Kind**: global function  
**Returns**: <code>object</code> - Reference to the object with the requested keys.  

| Param | Type | Description |
| --- | --- | --- |
| keyPath | <code>Array.&lt;string&gt;</code> | Path of keys that should be present in the nested object. |
| object | <code>object</code> | Object to ensure the keys exist on. |

<a name="ConfigSection"></a>

## ConfigSection : <code>Record.&lt;string, string&gt;</code>
Has a property for each key in the section, with trimmed name and value.

**Kind**: global typedef  
<a name="ParsedConfig"></a>

## ParsedConfig : <code>Record.&lt;string, module:transifex-config~ConfigSection&gt;</code>
Has a property for each section in the config. Each section has a property
named after the key with its value assigned.

**Kind**: global typedef  
