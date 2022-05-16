const getManifest = require('@openmfe/manifest')
const fetch = require('node-fetch')

module.exports = {
    initArguments: {},
    configFunction: function(eleventyConfig, options = {}) {
        if (!options.manifest && !options.manifests) {
            throw new Error(`A manifest URL must be passed as an option to the OpenMFE plugin.`)
        }

        if (options.manifest && options.manifests) {
            throw new Error('You can`t use the manifest and manifests option at the same time.')
        }

        // Manifests cache
        const manifestMap = new Map();

        eleventyConfig.addNunjucksAsyncShortcode('openmfe', async (tag, attributes = {}, config = {}) => {

            const manifestUrl = options.manifest ? options.manifest : options.manifests.find(({ mfe }) => mfe === tag).manifest;

            // we need to load the manifest here, because the configFunction can’t be async
            const manifest = manifestMap.get(tag) ? manifestMap.get(tag) : await getManifest(manifestUrl);

            manifestMap.set(tag, manifest);

            const params = new URLSearchParams(attributes)

            const [ prerendered, semantic ] = await Promise.all([
                fetchAsText(`${manifest.url.prerender}?${params}`),
                config.semantic && manifest.url.semantic ? fetchAsText(`${manifest.url.semantic}?${params}`) : Promise.resolve('')
            ])

            return `
                ${semantic ? `<script type="application/ld+json">${semantic}</script>` : ""}
                <${tag} ${Object.entries(attributes).map(attr => `${attr[0]}='${attr[1]}'`).join(' ')}>
                    ${prerendered}
                </${tag}>
                <script src="${manifest.url.frontend}" async></script>`
        })
    }
}

async function fetchAsText(url) {
    return await (await fetch(url)).text()
}
