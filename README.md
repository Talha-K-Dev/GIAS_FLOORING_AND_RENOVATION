# Gias Flooring & Restoration - HTML version

This folder is a standalone multipage HTML/CSS/JavaScript website. It does not require Node.js.

## Preview

Open `index.html` directly, or serve this folder with any static web host.

## Required owner setup before public launch

Edit `config.js` and add the verified business phone, email, Google Business Profile URL, official Google review-request URL, secure Google reviews endpoint, and secure form endpoint.

- `formEndpoint` must accept a JSON POST. If it is blank and `email` is set, the form opens a prepared email instead.
- `googleReviewsEndpoint` must be a server-side proxy. Never place a Google API key in `config.js` or browser JavaScript.
- The review endpoint should return `{ reviews: [...] }`, using Google Places review fields. Google returns a limited set selected by relevance.
- Visitors leave reviews on Google's official review page; a website cannot publish a Google review for them.

Before launch, replace statewide wording with the owner-confirmed primary city and genuine service towns, add an absolute canonical URL to every page, then generate an absolute-URL `sitemap.xml` for the final domain.

The supplied images are labeled as flooring inspiration until the owner confirms publishing rights and that they represent genuine Gias projects.
