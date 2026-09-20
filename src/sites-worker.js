export default {
  async fetch(request, env) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Not found", { status: 404 });
    }

    const assets = env.ASSETS;
    if (!assets?.fetch) {
      return new Response("Static assets are unavailable.", { status: 503 });
    }

    const assetResponse = await assets.fetch(request);
    if (assetResponse.status !== 404) {
      return assetResponse;
    }

    const url = new URL(request.url);
    url.pathname = "/index.html";
    url.search = "";
    return assets.fetch(new Request(url, request));
  },
};
