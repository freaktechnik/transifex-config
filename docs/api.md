## Modules

<dl>
<dt><a href="#module_transifex-config">transifex-config</a></dt>
<dd></dd>
<dt><a href="#module_transifex-config/lib/errors">transifex-config/lib/errors</a></dt>
<dd></dd>
<dt><a href="#module_transifex-config/lib/load-config">transifex-config/lib/load-config</a></dt>
<dd></dd>
<dt><a href="#module_transifex-config/lib/parse-langmap">transifex-config/lib/parse-langmap</a> ⇒ <code>Object.&lt;string, string&gt;</code></dt>
<dd><p>Parses the language map.</p>
</dd>
<dt><a href="#module_transifex-config/lib/parse-rc">transifex-config/lib/parse-rc</a> ⇒ <code><a href="#module_transifex-config..ParsedConfig">ParsedConfig</a></code></dt>
<dd><p>Parse a transifex client configuration file. Looks at the file line by line.</p>
</dd>
</dl>

<a name="module_transifex-config"></a>

## transifex-config
**Throws**:

- The .transifexrc or .tx/config can not be found in the base path.


| Param | Type | Description |
| --- | --- | --- |
| [basePath] | <code>string</code> | Path the transifex configuration is in. Defaults                              to the best guess of the package root. |


* [transifex-config](#module_transifex-config)
    * _instance_
        * [.basePath](#module_transifex-config+basePath) : <code>string</code>
        * [.getConfig()](#module_transifex-config+getConfig) ⇒ <code>[ParsedConfig](#module_transifex-config..ParsedConfig)</code>
        * [.getRC()](#module_transifex-config+getRC) ⇒ <code>[ParsedConfig](#module_transifex-config..ParsedConfig)</code>
        * [.getResources()](#module_transifex-config+getResources) ⇒ <code>[Array.&lt;ConfigSection&gt;](#module_transifex-config..ConfigSection)</code>
        * [.getResource(localPath, [matchSourceLang])](#module_transifex-config+getResource) ⇒ <code>[ConfigSection](#module_transifex-config..ConfigSection)</code>
        * [.getMappedLang(lang, resource)](#module_transifex-config+getMappedLang) ⇒ <code>string</code>
    * _inner_
        * [~ConfigSection](#module_transifex-config..ConfigSection) : <code>Object.&lt;string, string&gt;</code>
        * [~ParsedConfig](#module_transifex-config..ParsedConfig) : <code>Object.&lt;string, module:transifex-config~ConfigSection&gt;</code>

<a name="module_transifex-config+basePath"></a>

### transifex-config.basePath : <code>string</code>
Base path the config is read from

**Kind**: instance property of <code>[transifex-config](#module_transifex-config)</code>  
<a name="module_transifex-config+getConfig"></a>

### transifex-config.getConfig() ⇒ <code>[ParsedConfig](#module_transifex-config..ParsedConfig)</code>
**Kind**: instance method of <code>[transifex-config](#module_transifex-config)</code>  
**Returns**: <code>[ParsedConfig](#module_transifex-config..ParsedConfig)</code> - Parsed .tx/config as an
         object. Will be cached.  
**Throws**:

- The config could not be read.

**Async**:   
<a name="module_transifex-config+getRC"></a>

### transifex-config.getRC() ⇒ <code>[ParsedConfig](#module_transifex-config..ParsedConfig)</code>
**Kind**: instance method of <code>[transifex-config](#module_transifex-config)</code>  
**Returns**: <code>[ParsedConfig](#module_transifex-config..ParsedConfig)</code> - Parsed .transifexrc as an
         object. Will be cached.  
**Throws**:

- The .transifexrc could not be read.

**Async**:   
<a name="module_transifex-config+getResources"></a>

### transifex-config.getResources() ⇒ <code>[Array.&lt;ConfigSection&gt;](#module_transifex-config..ConfigSection)</code>
**Kind**: instance method of <code>[transifex-config](#module_transifex-config)</code>  
**Returns**: <code>[Array.&lt;ConfigSection&gt;](#module_transifex-config..ConfigSection)</code> - Array of resources.  
**Throws**:

- The config could not be read.

**Async**:   
<a name="module_transifex-config+getResource"></a>

### transifex-config.getResource(localPath, [matchSourceLang]) ⇒ <code>[ConfigSection](#module_transifex-config..ConfigSection)</code>
**Kind**: instance method of <code>[transifex-config](#module_transifex-config)</code>  
**Returns**: <code>[ConfigSection](#module_transifex-config..ConfigSection)</code> - Config section for the
         resource.  
**Throws**:

- <code>[NoMatchingResourceError](#module_transifex-config/lib/errors.NoMatchingResourceError)</code> There
        is no matching resource.
- The config could not be read.

**Async**:   

| Param | Type | Description |
| --- | --- | --- |
| localPath | <code>string</code> | Absolute local path of the resource to return the                             config entry of. |
| [matchSourceLang] | <code>boolean</code> | If the resource should be returned                                            when the path is for the source                                            language of the resource. |

<a name="module_transifex-config+getMappedLang"></a>

### transifex-config.getMappedLang(lang, resource) ⇒ <code>string</code>
**Kind**: instance method of <code>[transifex-config](#module_transifex-config)</code>  
**Returns**: <code>string</code> - Mapped language code.  
**Throws**:

- The config could not be read.

**Async**:   

| Param | Type | Description |
| --- | --- | --- |
| lang | <code>string</code> | Language code to map from local to external. |
| resource | <code>[ConfigSection](#module_transifex-config..ConfigSection)</code> | Resource to get map                                                           the language for. |

<a name="module_transifex-config..ConfigSection"></a>

### transifex-config~ConfigSection : <code>Object.&lt;string, string&gt;</code>
Has a property for each key in the section, with trimmed name and value.

**Kind**: inner typedef of <code>[transifex-config](#module_transifex-config)</code>  
<a name="module_transifex-config..ParsedConfig"></a>

### transifex-config~ParsedConfig : <code>Object.&lt;string, module:transifex-config~ConfigSection&gt;</code>
Has a property for each section in the config. Each section has a property
named after the key with its value assigned.

**Kind**: inner typedef of <code>[transifex-config](#module_transifex-config)</code>  
<a name="module_transifex-config/lib/errors"></a>

## transifex-config/lib/errors
**Author:** Martin Giger  
**License**: MIT  

* [transifex-config/lib/errors](#module_transifex-config/lib/errors)
    * [.NoMatchingResourceError](#module_transifex-config/lib/errors.NoMatchingResourceError)
        * [new NoMatchingResourceError(resource)](#new_module_transifex-config/lib/errors.NoMatchingResourceError_new)

<a name="module_transifex-config/lib/errors.NoMatchingResourceError"></a>

### transifex-config/lib/errors.NoMatchingResourceError
**Kind**: static class of <code>[transifex-config/lib/errors](#module_transifex-config/lib/errors)</code>  
**Implements:** <code>Error</code>  
<a name="new_module_transifex-config/lib/errors.NoMatchingResourceError_new"></a>

#### new NoMatchingResourceError(resource)

| Param | Type | Description |
| --- | --- | --- |
| resource | <code>string</code> | Path to the resource that has no matching config                            entry. |

<a name="module_transifex-config/lib/load-config"></a>

## transifex-config/lib/load-config
**Author:** Martin Giger  
**License**: MIT  

* [transifex-config/lib/load-config](#module_transifex-config/lib/load-config)
    * _static_
        * [.TXCONFIG](#module_transifex-config/lib/load-config.TXCONFIG) : <code>string</code>
        * [.TRANSIFEXRC](#module_transifex-config/lib/load-config.TRANSIFEXRC) : <code>string</code>
        * [.txconfig(basePath)](#module_transifex-config/lib/load-config.txconfig) ⇒ <code>[ParsedConfig](#module_transifex-config..ParsedConfig)</code>
        * [.transifexrc(basePath)](#module_transifex-config/lib/load-config.transifexrc) ⇒ <code>[ParsedConfig](#module_transifex-config..ParsedConfig)</code>
    * _inner_
        * [~loadConfig(path)](#module_transifex-config/lib/load-config..loadConfig) ⇒ <code>string</code>

<a name="module_transifex-config/lib/load-config.TXCONFIG"></a>

### transifex-config/lib/load-config.TXCONFIG : <code>string</code>
File name of the config file from the base path.

**Kind**: static constant of <code>[transifex-config/lib/load-config](#module_transifex-config/lib/load-config)</code>  
**Read only**: true  
<a name="module_transifex-config/lib/load-config.TRANSIFEXRC"></a>

### transifex-config/lib/load-config.TRANSIFEXRC : <code>string</code>
File name of the rc file from the base path.

**Kind**: static constant of <code>[transifex-config/lib/load-config](#module_transifex-config/lib/load-config)</code>  
**Read only**: true  
<a name="module_transifex-config/lib/load-config.txconfig"></a>

### transifex-config/lib/load-config.txconfig(basePath) ⇒ <code>[ParsedConfig](#module_transifex-config..ParsedConfig)</code>
Loads and parses the transifex client config.

**Kind**: static method of <code>[transifex-config/lib/load-config](#module_transifex-config/lib/load-config)</code>  
**Returns**: <code>[ParsedConfig](#module_transifex-config..ParsedConfig)</code> - Parsed contents of the config.  
**Throws**:

- The config could not be read.

**Async**:   

| Param | Type | Description |
| --- | --- | --- |
| basePath | <code>string</code> | Path the config is in. |

<a name="module_transifex-config/lib/load-config.transifexrc"></a>

### transifex-config/lib/load-config.transifexrc(basePath) ⇒ <code>[ParsedConfig](#module_transifex-config..ParsedConfig)</code>
Loads and parses the transifex login info.

**Kind**: static method of <code>[transifex-config/lib/load-config](#module_transifex-config/lib/load-config)</code>  
**Returns**: <code>[ParsedConfig](#module_transifex-config..ParsedConfig)</code> - Parsed contents of the rc.  
**Throws**:

- The rc could not be read.

**Async**:   

| Param | Type | Description |
| --- | --- | --- |
| basePath | <code>string</code> | Path the rc is in. |

<a name="module_transifex-config/lib/load-config..loadConfig"></a>

### transifex-config/lib/load-config~loadConfig(path) ⇒ <code>string</code>
Loads a file from the given path and returns its contents.

**Kind**: inner method of <code>[transifex-config/lib/load-config](#module_transifex-config/lib/load-config)</code>  
**Returns**: <code>string</code> - Contents of the file.  
**Throws**:

- The file could not be read.

**Async**:   

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Path to the file to load. |

<a name="module_transifex-config/lib/parse-langmap"></a>

## transifex-config/lib/parse-langmap ⇒ <code>Object.&lt;string, string&gt;</code>
Parses the language map.

**Returns**: <code>Object.&lt;string, string&gt;</code> - A map of the language, with the local
         language code as key and the remote language code as value.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [langMapString] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | Language map specification. |
| [langMap] | <code>Object</code> | <code>{}</code> | Language map to inherit from. |

<a name="module_transifex-config/lib/parse-rc"></a>

## transifex-config/lib/parse-rc ⇒ <code>[ParsedConfig](#module_transifex-config..ParsedConfig)</code>
Parse a transifex client configuration file. Looks at the file line by line.

**Returns**: <code>[ParsedConfig](#module_transifex-config..ParsedConfig)</code> - Configuration file
         represented as an object.  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>string</code> | Configuration file contents. |

