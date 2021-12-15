## WTF is this thing?
```
npm i -g printshop
printshop create my-new-book
```

**printshop** is a simple CLI tool to publish e-books. It allows for export to .pdf, .epub and static site format, because why not.

### So, it's like InDesign, but for tech junkies?
Yup. I got so fucking fed up with InDesign, so I decided to switch to layouting my shit with html and css. Well, with pug and sass, but who cares?

### What should I know?
First of all, read:
- #[a(href='https://pugjs.org/api/getting-started.html' target='_blank') pug documentations]
- #[a(href='https://www.pagedjs.org/documentation/' target='_blank') paged.js documentation]
- #[a(href='https://developer.mozilla.org/' target='_blank') MDN]

## Contributing
If you don't have anything better to do, go ahead. Just clone this rep, hit me up with a PR and I'll check it out.

## How to use this shit
First of all, create a project:
```
printshop create my-new-book
```

It will create a folder my-new-book, which will look like this:
```
my-new-book
	content/
		index.pug
	fonts/
	images/
		cover.jpg
	scripts/
		print/
			paged_extender.js
		hot_reload.js
	styles/
		print.sass
		web.sass
	templates/
		print.pug
		web.pug
	printshop.config.yaml
```