# OpenMFE Eleventy Plugin


This is a plugin for the Eleventy Static Site Generator (SSG). It allows embedding a microfrontend into an Eleventy page via Shortcode.

The tag name is `openmfe`, the first parameter is the microfrontend’s tag name, the second parameter is a map of attributes and their values, the third parameter is a map of configuration options.

For example, assuming there is a microfrontend which offers the `hotel-offers` tag and accepts the `region` attribute, you would place the following code anywhere in your template:

```
{% openmfe "hotel-offers", { region: region.id } %}
```

Please note that currently only the Nunjucks language is supported.
