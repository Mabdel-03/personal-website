# Mahmoud Abdelmoneum

[Personal research website](https://mabdel-03.github.io/personal-website/)

The site introduces my work in scientific AI, learning theory, and computational biology. The selected projects link to papers, software, and an MIT research profile.

## Local preview

From the repository directory, run `python3 -m http.server 8000` and open [localhost:8000](http://localhost:8000). The static site can also be opened directly from `index.html`.

## Updating the portfolio

Edit the research-interest hierarchy in the `#work` section of `index.html` and the additional projects in `#other-work`. Link the project title to its local summary and each italic workshop credit to the corresponding paper. Each title opens a standalone HTML page in `projects/` with a figure, three short sections, and sources. Edit a project page directly and keep its filename and homepage fragment ID stable. Shared project-page styles live in `projects/studies.css`. Project-specific graphics and figure styles live in `projects/figures/`.

`styles.css` controls layout, typography, and print styles. `script.js` highlights the current section and opens the coursework deep link. `neural-field.js` draws the pointer-responsive neural background and respects reduced motion. The content, navigation, and coursework disclosure are available in plain HTML. GitHub Pages can serve the repository directly without a build step.
