# Mahmoud Abdelmoneum

[Personal research website](https://mabdel-03.github.io/personal-website/)

The site introduces my work in scientific AI, learning theory, and computational biology. The selected projects link to papers, software, and an MIT research profile.

## Local preview

From the repository directory, run `python3 -m http.server 8000` and open [localhost:8000](http://localhost:8000). The static site can also be opened directly from `index.html`.

## Updating the portfolio

Edit the project entries in the `#work` section of `index.html`. Each entry includes a research question or result and a public source. Keep each project's fragment ID stable so existing links continue to work.

`styles.css` controls layout, typography, and print styles. `script.js` highlights the current section, handles the coursework deep link, and updates the footer year. The content, navigation, and coursework disclosure are available in plain HTML. GitHub Pages can serve the repository directly without a build step.
