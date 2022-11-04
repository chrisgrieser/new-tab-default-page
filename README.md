# New Tab Default Page

![Obsidian Downloads](https://img.shields.io/badge/dynamic/json?logo=obsidian&color=%23483699&label=downloads&query=%24%5B%22new-tab-default-page%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json&style=plastic) ![](https://img.shields.io/github/v/release/chrisgrieser/new-tab-default-page?label=Latest%20Release&style=plastic) [![](https://img.shields.io/badge/changelog-click%20here-FFE800?style=plastic)](Changelog.md)

[Obsidian](https://obsidian.md/) plugin to open a note of your choice or the Quick Switcher when creating a new tab, like in the browser.

➡️ [YouTube Demo of what you can with the
plugin.](https://www.youtube.com/watch?v=PKcnKqErwJw&t=2s)

<!--toc:start-->
  - [Examples for Default New Tab Pages](#examples-for-default-new-tab-pages)
  - [Usage](#usage)
  - [Advanced Examples](#advanced-examples)
    - [Random Quote](#random-quote)
  - [Installation](#installation)
  - [Donate](#donate)
  - [Thanks](#thanks)
<!--toc:end-->

## Examples for Default New Tab Pages
- your homepage note
- your daily note
- a scratchpad note
- trigger a quick switcher
- an image
- a random quote
- …

## Usage
1. Set the note to open in new tabs in the plugin settings.
2. Set the mode in which the note should open.
3. Open a new tab.

> **Note**
> Closing your last tab also opens your new tab page.

## Advanced Examples

### Random Quote
To have a random quote on every new tab, you can use dataview and paste the following code as a dataviewjs-codeblock in a note.

```js
const quote = JSON.parse(await request("https://api.quotable.io/random"));
dv.span(`> "${quote.content}"  \n> <div style="text-align:end; color:var(--text-muted); font-weight: 600; font-size:90%;">– ${quote.author}</div>`);
```

Then, enter the path of the note in the *New Tab Default Page* settings, and select *Reading Mode*. Now every new note will display a random quote.

### Submit your own idea
Have a cool idea of your own? Feel free to make a PR to this README and submit your own idea.

## Caveats
Opening a new popout window initially also triggers the new tab action, even if you are opening something in the popout window [see #7](https://github.com/chrisgrieser/new-tab-default-page/issues/7).

## Installation
Available in Obsidian's Community Plugin Browser via: `Settings` → `Community Plugins` → `Browse` → Search for *"New Tab Default Page"*

## Donate
<a href='https://ko-fi.com/Y8Y86SQ91' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://cdn.ko-fi.com/cdn/kofi1.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

## Thanks
Thanks to [@pjeby](https://github.com/pjeby) and various people from the `#plugin-dev` channel for helping me out.
