# impress.js Format for Quarto

**Forked from** [tilltnet/impressjs](https://github.com/tilltnet/impressjs) – original work by Till Krenz.

---

This repository packages [impress.js](https://github.com/impress/impress.js)
as an extension for Quarto. See here for a general [demo of impress.js](https://impress.js.org/).

## Installing

```bash
quarto use template tilltnet/quarto_impressjs
```

This will install the extension and create an example `qmd` file that you can use as a starting place for your presentation.

Or you can download the [_extensions](./_extensions) folder in your project.

## Using

Add fenced `<div>`s with the css class "step" `::: {.step}` to your quarto document. Add "slide" class to display content on a slide. Place and position steps by specifying `data-*` attributes. Add your own CSS to style steps.

## Example

Here is the source code for a minimal sample document: [template.qmd](template.qmd).
