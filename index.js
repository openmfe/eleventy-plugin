const getManifest = require('@openmfe/manifest')
const fetch = require('node-fetch')

module.exports = {
    initArguments: {},
    configFunction: function(eleventyConfig, options = {}) {
        if (!options.manifest) {
            throw new Error(`A manifest URL must be passed as an option to the OpenMFE plugin.`)
        }

        let manifest

        eleventyConfig.addNunjucksAsyncShortcode("openmfe", async (tag, attributes = {}, config = {}) => {
            // we need to load the manifest here, because the configFunction can’t be async
            if (!manifest) {
                manifest = await getManifest(options.manifest)
            }

            const params = new URLSearchParams(attributes)
            const prerendered = await fetchAsText(`${manifest.url.prerender}?${params}`)
            const semantic = config.semantic && manifest.url.semantic
                ? await fetchAsText(`${manifest.url.semantic}?${params}`)
                : ""

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
