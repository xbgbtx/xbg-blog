+++
title = "Cellular Automata"
date = 2021-03-02T18:04:37Z
tags = ['web', 'art', 'programming', 'webgl']
keywords = ['web', 'art', 'programming', 'webgl']
cover = ""
draft = true
description = "A WebGL cellular automata runtime."
showFullContent = false
+++

A WebGL cellular automata runtime.

{{< figure src="/xbg-blog/img/ca_webgl_001.png" title="Cellular Automata" caption="Cellular Automata" position="center">}}

[Try it in your browser!](https://xbgbtx.github.io/xbg-blog/CellularAutomataWebGL/)

[View the Source Code](https://github.com/xbgbtx/CellularAutomataWebGL)

##Cellular Automata

Cellular automata are a captivating example of how complexity can emerge
from simple rules.

{{< figure src="/xbg-blog/img/ca_webgl_002.png" title="Cellular Automata" caption="Cellular Automata" position="center">}}

##GPU Acceleration

Programming a cellular automata is fairly straightforward.  The system
simply needs to iterate through a grid and process the states of the
cells.

In order to make the simulation run in real time I decided to implement
the system using WebGL fragment shaders.

While the CPU would process one cell at a time the GPU is capable of 
processing all the cells simultaneously.

{{< youtube P28LKWTzrI >}}

I used the PixiJS framework for the graphics rendering.  It is well suited
for 2D rendering using WebGL.

{{< figure src="/xbg-blog/img/ca_webgl_003.png" title="Cellular Automata" caption="Cellular Automata" position="center">}}

An earlier prototype using the CPU can be found here.  It is quite a 
bit slower than the WebGL version:

[CPU based Cellular Automata on Github](https://github.com/xbgbtx/Cellular_Automata)

##Future Work

Life-life cellular automata are often represented concisely with a rule
string.  

E.g. The rule string for Conway's Game of life is `B2S23`, which means
a cell is born if it has two living neighbours and it will survive another 
generation if it has two or three living neighbours.

I would like to write a system that can parse these rule strings and
generate a fragment shader accordingly.  

This could be taken even further by supporting the [Golly .rle format](http://golly.sourceforge.net/Help/formats.html) as much as possible.

