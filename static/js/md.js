import hljs from "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.4.0/build/es/highlight.min.js";
import { Remarkable } from "https://cdn.jsdelivr.net/npm/remarkable@2.0.1/dist/esm/index.min.js";

const md = new Remarkable("full", {
  html: false, // Enable HTML tags in source
  xhtmlOut: true, // Use '/' to close single tags (<br />)
  breaks: false, // Convert '\n' in paragraphs into <br>
  langPrefix: "language-", // CSS language prefix for fenced blocks
  linkify: false, // autoconvert URL-like texts to links
  linkTarget: "", // set target to open link in

  // Enable some language-neutral replacements + quotes beautification
  typographer: false,

  // Double + single quotes replacement pairs, when typographer enabled,
  // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
  quotes: "“”‘’",

  // Highlighter function. Should return escaped HTML,
  // or '' if input not changed
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }

    try {
      return hljs.highlightAuto(str).value;
    } catch (__) {}

    return ""; // use external default escaping
  },
});

export default class MarkdownElement extends HTMLElement {
  constructor() {
    super();
    this.render(this.innerText);
  }

  get innerText() {
    return super.innerText;
  }

  set innerText(text) {
    this.render(text);
  }

  render(text) {
    this.innerHTML = md.render(text);
  }
}
