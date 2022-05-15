# OpenMFE Eleventy Plugin


This is a plugin for the Eleventy Static Site Generator (SSG). It allows embedding a microfrontend into an Eleventy page via Shortcode.

The tag name is `openmfe`, the first parameter is the microfrontend’s tag name, the second parameter is a map of attributes and their values, the third parameter is a map of configuration options.

For example, assuming there is a microfrontend which offers the `hotel-offers` tag and accepts the `region` attribute, you would place the following code anywhere in your template:

```
{% openmfe "hotel-offers", { region: region.id } %}
```

Please note that currently only the Nunjucks language is supported.

For instance, to create a full-blown instance of the `hotel-offers` microfrontend, you can use the following Nunjucks snippet:

```liquid
{\% openmfe "hotel-offers", { region: 1197 }, { semantic: true } %}
```

This generates the following output:

```html
<script type="application/ld+json">
    // … full block of JSON-LD …
</script>
<hotel-offers region='1197'>
    <div class=main style=all:initial;display:block;overflow:hidden>
        <!-- full block of prerendered HTML (plus a bit of SVG for loading animation) -->
    </div>
</hotel-offers>
<script src="http://localhost:9081/main.js" async></script>
```

# Installation 

You need to install the `openmfe` eleventy plugin by adding this code into the `.eleventy.js` file.

```js 
const openmfe = require('@openmfe/eleventy-plugin');

eleventyConfig.addPlugin(openmfe, { manifest: 'https://<MFE_CDN_FOLDER>/openmfe/manifest.yaml' });
```

If you have multiple MFE's in your application: 

```js 
const openmfe = require('@openmfe/eleventy-plugin');

eleventyConfig.addPlugin(openmfe, {
    manifests: [
        {
            mfe: "mfe-demo",
            manifest: "https://<MFE_DEMO_CDN_FOLDER>/openmfe/manifest.yaml",
        },
        {
            mfe: "mfe-example",
            manifest: "https://<MFE_EXAMPLE_CDN_FOLDER>/openmfe/manifest.yaml",
        },
    ],
});
```