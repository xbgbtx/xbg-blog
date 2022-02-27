+++
title = "Artist Map"
date = 2021-04-28T15:14:53+01:00
draft = false
tags = ['web', 'music', 'programming', 'map', 'wikipedia' ]
keywords = ['web', 'music', 'programming', 'map', 'wikipedia' ]
description = "Plots nearly 60 thousand musicians on a map."
showFullContent = false
+++

This interactive map shows the birth and formation location of nearly
sixty thousand musicians and musical ensembles.

{{< figure src="/xbg-blog/img/ArtistMap.png" title="Artist Map" caption="Artist Map" position="center">}}

[Try it in your browser!](https://xbgbtx.github.io/ArtistMap/)

[View the Source Code](https://github.com/xbgbtx/ArtistMap)


## Leaflet JS Map

The map data is displayed using [Leaflet JS](https://leafletjs.com/) - a 
flexible front end for map data.  The map tiles are sourced from Open Street Map.


## WikiData 

Data is queried from [WikiData](wikidata.org) a service that enables
SPARQL queries on a database generated from the article text of Wikipedia
articles.
