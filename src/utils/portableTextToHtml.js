import { toHTML } from '@portabletext/to-html';
import { urlFor } from '../../sanity/lib/client'; // Assuming urlFor is available here

// Define your custom components for rendering Portable Text to HTML
// These should mirror the structure of your PortableTextComponent.js
const customComponents = {
  block: {
    h1: ({ children }) => `<h1>${children}</h1>`,
    h2: ({ children }) => `<h2>${children}</h2>`,
    h3: ({ children }) => `<h3>${children}</h3>`,
    normal: ({ children }) => `<p>${children}</p>`,
    blockquote: ({ children }) => `<blockquote>${children}</blockquote>`,
  },
  list: {
    bullet: ({ children }) => `<ul>${children}</ul>`,
  },
  listItem: {
    bullet: ({ children }) => `<li>${children}</li>`,
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return '';
      }
      return `<img src="${urlFor(value).url()}" alt="${value?.alt || ''}" />`;
    },
  },
};

export const portableTextToHtml = (portableText) => {
  if (!portableText) return '';
  return toHTML(portableText, { components: customComponents });
};