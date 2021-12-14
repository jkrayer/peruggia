// const eleventy = (tags = []) => {
//   const formattedTags = tags.reduce(
//     (acc, tag) => acc.concat(`\n  - ${tag}`),
//     ""
//   );

//   return (date, title, content) => {
//     return `---
//     title: "${title}"
//     date:
//     tags: ${formattedTags}
//     gameDate: ${date}
//     ---

//     ${content}`;
//   };
// };

const eleventy = (title, content) => {
  return `---
title: "${title}"
date:
tags:
---

${content}
`;
};

export default eleventy;
