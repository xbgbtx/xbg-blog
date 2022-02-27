+++
title = "Memory Cats"
date = "2022-02-27T14:22:27Z"
tags = ['web', 'cards', 'programming', 'lit', 'javascript' ]
keywords = ['web', 'cards', 'programming', 'lit', 'javascript' ]
description = "Memory card game implemented using lit and xstate."
showFullContent = false
+++

Memory cats is a memory card game that sources its images from an API
so that every game the player sees new cats.

{{< figure src="/xbg-blog/img/memory-cats-logo.jpg" title="Memory Cats Title" caption="Memory Cats Title" position="center">}}

[Try it in your browser!](https://xbgbtx.github.io/memory-cat-app/)

[View the Source Code](https://github.com/xbgbtx/memory-cat-app/)

{{< figure src="/xbg-blog/img/memory-cats-screenshot.jpg" title="Memory Cats Screenshot" caption="Memory Cats Screenshot" position="center">}}

## Frontend Framework

The frontend of the system uses the following technologies:

* [Lit](https://lit.dev/) - Front end framework using the open web components standard.
* [xstate](https://xstate.js.org/) - Provides declarative state machines for controlling application behaviour.

## Application Back End

The application gets the cat pictures from [The Cat API](https://thecatapi.com/).

In order to use the API without revealing the private API key a
[wrapper API written in Go](https://github.com/xbgbtx/cat-api-wrapper) is used.
