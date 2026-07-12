# Mwmbl - the Open Source and Non-Profit Web Search Engine

[![Matrix](https://img.shields.io/matrix/mwmbl:matrix.org)](https://matrix.to/#/#mwmbl:matrix.org)

**No ads, no tracking, no profit**

[Mwmbl](https://mwmbl.org) is a non-profit, open source search engine
where the community determines the rankings. We aim to be a
replacement for commercial search engines such as Google and
Bing.

<a href="https://mwmbl.org">
<img width="1806" height="927" alt="image" src="https://github.com/user-attachments/assets/a4f0bda4-b73e-4ca9-9a13-3eb6544af34f" />
</a>

We have our own index powered by our community - while the index itself
is centralised, the crawling is distributed across servers run by our volunteers.

Our index is currently much smaller than those of commercial search engines, but
you can help change that by joining us!


Community
=========

Our main community is on
[Matrix](https://matrix.to/#/#mwmbl:matrix.org) but we also have a
[Discord server](https://discord.gg/2BGSUYFdkD) for non-development
related discussion.

The community is responsible for crawling the web (see below) and
[curating search results](https://book.mwmbl.org/page/curating/). We are
friendly and welcoming. Join us!


Documentation
=============

All documentation is at [https://book.mwmbl.org](https://book.mwmbl.org).


Crawling
========

If you have spare computer power and bandwidth, for now the best way you can help is
by running our [command line
crawler](https://book.mwmbl.org/page/community/#running-the-mwmbl-crawler-with-docker-compose).

If you have Firefox you can help out by [installing our
extension](https://addons.mozilla.org/en-GB/firefox/addon/mwmbl-web-crawler/). This
retrieves search results from commercial search engines to use to evaluate our own ranking.
It does not use or access any of
your personal data.

Why a non-profit search engine?
===============================

The motives of ad-funded search engines are at odds with providing an
optimal user experience. These sites are optimised for ad revenue,
with user experience taking second place. This means that pages are
loaded with ads which are often not clearly distinguished from search
results. Also, eitland on Hacker News
[comments](https://news.ycombinator.com/item?id=29427442):

> Thinking about it it seems logical that for a search engine that
> practically speaking has monopoly both on users and as mattgb points
> out - [to some] degree also on indexing - serving the correct answer
> first is just dumb: if they can keep me going between their search
> results and tech blogs with their ads embedded one, two or five
> times extra that means one, two or five times more ad impressions.

But what about...?
==================

The space of alternative search engines has expanded rapidly in recent
years. Here's a very incomplete list of some that have interested me:

 - [search.marginalia.nu](https://search.marginalia.nu/) - a search
   engine favouring text-heavy websites
 - [SearXNG](https://github.com/searxng/searxng) - an open source meta
   search engine
 - [YaCy](https://yacy.net/) - an open source distributed search engine
 - [Stract](https://stract.com/) - an open source, private search engine with a focus on privacy and customizability
 - [Brave](https://search.brave.com/)
 - [DuckDuckGo](https://duckduckgo.com/)
 - [Kagi](https://kagi.com/)
 - [Mojeek](https://www.mojeek.com/)

Of these, YaCy is the closest in spirit to the idea of a non-profit
search engine. The index is distributed across a peer-to-peer
network. Unfortunately this design decision slows the fetching of search results.

Marginalia Search is fantastic, but our goals are different: we aim to
be a replacement for commercial search engines whereas Marginalia aims to
provide a different type of search.

All other search engines that I've come across are for-profit. Please
let me know if I've missed one!

Designing for non-profit
========================

To be a good search engine, we need to store many items, but the cost
of running the engine is at least proportional to the number of items
stored. Our main consideration is thus to reduce the cost per item
stored.

The design is founded on the observation that most items rank for a
small set of terms. In the extreme version of this, where each item
ranks for a single term, the usual inverted index design is grossly
inefficient, since we have to store each term at least twice: once in
the index and once in the item data itself.

Our design is a giant hash map. We have a single store consisting of a
fixed number N of pages. Each page is of a fixed size (currently 4096
bytes to match a page of memory), and consists of a compressed list of
items. Given a term for which we want an item to rank, we compute a
hash of the term, a value between 0 and N - 1. The item is then stored
in the corresponding page.

To retrieve pages, we simply compute the hash of the terms in the user
query and load the corresponding pages, filter the items to those
containing the term and rank the items. Since each page is small, this
can be done very quickly.

Because we compress the list of items, we can rank for more than a
single term and maintain an index smaller than the inverted index
design. At least, that's the theory. This idea has yet to be tested on
a large scale.

How to contribute
=================

There are multiple ways to help:
 - [Help us crawl the
   web](https://book.mwmbl.org/page/community/#running-the-mwmbl-crawler-with-docker-compose)
 - [Donate some money](https://opencollective.com/mwmbl) towards
   hosting costs and supporting our volunteers
 - Give feedback/suggestions
 - Assist in development of the engine itself

If you would like to help in any of these or other ways, thank you!
Please join our [Matrix chat
server](https://matrix.to/#/#mwmbl:matrix.org) or email the main
author (email address is in the git commit history).

Development
===========

### Local Testing

For trying out the service locally see the section in the Mwmbl [book](https://book.mwmbl.org/page/developers/).

### Using Dokku

Note: this method is not recommended as it is more involved, and your index will not include any data unless you 
set up a crawler to crawl to your server. You will need to set up your own Backblaze or S3 equivalent storage, or 
have access to the production keys, which we probably won't give you.

Follow the [deployment instructions](https://github.com/mwmbl/mwmbl/wiki/Deployment)


Frequently Asked Question
=========================

### How do you pronounce "mwmbl"?

Like "mumble". I live in
[Mumbles](https://en.wikipedia.org/wiki/Mumbles), which is spelt
"Mwmbwls" in Welsh. But the intended meaning is "to mumble", as in
"don't search, just mwmbl!"

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=mwmbl/mwmbl&type=Date)](https://www.star-history.com/#mwmbl/mwmbl&Date)

Acknowledgements
================

Many thanks to [Mohamed Alm](https://github.com/theonlyalm) for security consultations and recommendations.


Privacy & Security
==================

Mwmbl is built around a **no-ads, no-tracking, no-profit** model. The
concrete privacy posture of this codebase:

- We never log search queries. They are processed in memory, ranked, and
  dropped on the response.
- We never store IP addresses on disk for search traffic.
- Cookies are used only for authentication (set by `django-allauth` and the
  JWT layer) and are `HttpOnly`, `SameSite=Lax`, and `Secure` in production.
- The Sentry monitor is configured with
  `send_default_pii=False` and a `before_send` hook that strips request query
  strings, so URLs containing search terms never reach third-party telemetry.
- The HTTP layer (Dokku's nginx) sends `Strict-Transport-Security`,
  `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, and
  a restrictive `Content-Security-Policy` (`default-src 'self'`) so external
  scripts cannot be loaded into Mwmbl pages.
- The complete Data Privacy Policy is published at
  [`/data-privacy/`](https://mwmbl.org/data-privacy/) and built into the
  front-end bundle (see `front-end/src/data-privacy/index.html`).

### UI themes

Users can choose from 10 colour / skin themes (light, dark, two high-contrast
variants for accessibility, sepia, solarized light & dark, dracula, nord,
catppuccin-latte). The choice is stored in `localStorage` under the key
`mwmbl:theme` and applied via a single `<body data-theme="...">` attribute
that drives CSS custom properties. A selector can be added with
`window.MwmblTheme.buildSelector()`.

If you operate a Mwmbl instance and want to make the selector part of your
header markup, drop the helper into a Django template and it persists the
choice across reloads.

### Reporting issues

If you find a privacy or security problem, please email `info@mwmbl.org` or
ping `#mwmbl:matrix.org` on Matrix.

