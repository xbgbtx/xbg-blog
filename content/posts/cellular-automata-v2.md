+++
title= "Cellular Automata V2"
date= 2021-05-21T13:13:13+01:00
tags = ['web', 'art', 'programming', 'webgl']
keywords = ['web', 'art', 'programming', 'webgl']
cover = ""
draft = false
description = "A WebGL cellular automata runtime."
showFullContent = false
+++

A WebGL cellular automata runtime.

{{< figure src="/xbg-blog/img/WebGL-CA-v2.png" title="Cellular Automata" caption="Cellular Automata" position="center">}}

## Cellular Automata


[Try it in your browser!](https://xbgbtx.github.io/xbg-blog/CellularAutomataWebGLv2/)

[View the Source Code](https://github.com/xbgbtx/CellularAutomataWebGL)


Cellular automata are a captivating example of how complexity can emerge
from simple rules.

{{< figure src="/xbg-blog/img/ca_webgl_002.png" title="Cellular Automata" caption="Cellular Automata" position="center">}}

## Version 2

Version 2 brings an improved user interface.  The simulation is displayed
full screen and a menu system floats on top.

I added a new rule called 'Life Like' that allows for the conditions
for life and dead in Conway's Game of Life to be modified.  These parameters
were realised by dynamically generating the fragment shader code.

[Click here to see version 1.](https://xbgbtx.github.io/xbg-blog/posts/cellular-automata/)

## Future Work

Some ideas for future versions are:

- State representation and colours:
   - The shader code for Life-Like automata encodes the state using a 1 or 0
     in the texture's red channel.
   - Up to 255 states could be represented in the red channel.
   - A filter could be applied to the sprite that displays the automaton
     that converts the red channel value into a user-selected rgb colour.

- Playback controls:
   - Add pause / play / one-step buttons.
   - Allow the run-speed to be configured.
   - Save a copy of the state at 'start time' to allow CA to be replayed.
   - Add a 'run for N steps' mode.  It might be interesting to test
     similar rules with the same starting configuration for the same
     duration.

- URL encoding of rule and parameters:
   - Save rule parameter settings in a URL.
   - Apply parameters to the system after starting.

- Rock Paper Scissors rule parameters:
   - More colours would enable more complexity.  
   - Some examples can be seen on [Softology's Blog](https://softologyblog.wordpress.com/2018/03/23/rock-paper-scissors-cellular-automata/).
