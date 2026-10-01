// The page data is stored as { [id]: { description, title } }; Object.entries
// keeps the numeric-key ordering the pages have always rendered in.
export default function toItems(details) {
  return Object.entries(details).map(([id, item]) => ({ id, ...item }));
}
