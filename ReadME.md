WTF is this thing?
printshop is a simple CLI tool to publish e-books with familiar web technologies. It allows for export to .pdf and .epub because why not.

TODO
Implement export to static HTML
Fucking write actual docs

Installation
```
npm i -g printshop
printshop create my-new-book
```

So, it's like InDesign, but for tech junkies?
Yup. I got so fucking fed up with InDesign, so I decided to switch to layouting my shit with html and css. Well, with pug and sass, but who cares?
The goal is to have a quick, DRY way to turn my tabletop RPGs from a google doc into a reasonably good-looking PDF.
Of course, it lacks some pro-features: text justification is no match for InDesign, hanging punctuation ain’t an option, all that jazz. But, hey, if you care enough about such stuff, you prolly already know how to use InDesign or Affinity or whatever.

What should I know?
First of all, read:
- #[a(href='https://pugjs.org/api/getting-started.html' target='_blank') pug docs]
- #[a(href='https://www.pagedjs.org/documentation/' target='_blank') paged.js docs]
- #[a(href='https://developer.mozilla.org/' target='_blank') MDN] — this one is mandatory. If I catch you using tags for their appearance instead of semantic meaning, I’m gonna hunt you down and kick your ass. I’m serious.

Contributing
If you don't have anything better to do, go ahead. Just clone this rep, hit me up with a PR, and I'll check it out.

How to use this shit
First of all, create a project:
```
printshop create my-new-book
```

It will clone printshop_starter into my-new-book directory and separate it from the origin. Then, have fun.

Configuration
In any printshop project folder, there is printshop.config.js file. It has following structure:

```js
module.exports = {
	name: string, // Project name, duh
	description: string, // Summary of your project. I don’t think it’s used anywhere for now, tho
	author: string, // Your name, or name of whatever Alan Smithee-style alias you have
	dev_port: int, // Port on which devserver runs when you go printshop serve. Default: 8080

	base_dir: string, // If you want to nest all your shit into a directory, use it as base_dir. Default: '.', which means "your project's root folder"
 
	content: {
		dir: string, // Where the .pug files with your content is stored. The default is, surprisingly, 'content'
		preprocess: (string) => string // A function that is ran on each and every line of your book. 
	},
 
 templates: [
   {
     url: '/print',
     template: 'templates/print',
     defaults: {
       is_preview: true
     }
   }
 ],
 
 static: [
   {
     dir: 'images',
     url: '/images'
   },
   {
     dir: 'fonts',
     url: '/fonts'
   },
   {
     dir: 'scripts',
     url: '/scripts',
     // preprocess: _ => typescript.render(_.toString()).body
   },
   {
     dir: 'node_modules',
     url: '/node_modules'
   },
   {
     dir: 'styles',
     url: '/styles',
     preprocess: require('./preprocessors/styles')
   }
 ],
 
 puppeteer: {
   browser: 'firefox',
   revision: '97.0a1',
 
   pdf_export: {
		 format: 'A5'
   }
 },
 
 export: {
	 pdf: {
		 timeout: float // How long (in milliseconds) printshop should wait before actually exporting the doc into pdf — sometimes shit takes a bit too long to properly render and the resulting pdf is messed up big time. Default: 10000, or 10 seconds
     default_url: '/print?is_preview=false' // What url should headless browser export to pdf. Default: '/print'
   },
   epub: {
     css: 'styles/epub.sass',
     default_url: '/web'
   },
   html: {
     include: [
       'index.pug'
     ]
   }
 }
}
```