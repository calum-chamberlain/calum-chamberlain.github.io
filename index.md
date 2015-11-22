---
layout: page
title: Calum Chamberlain
tagline: Seismologist/Cyclist
---
{% include JB/setup %}

## About

I am currently completing my PhD at Victoria University of Wellington, studying
active seismicity beneath New Zealand's central Southern Alps.  For more information
on my research check out the [research](/research/) page.  

Recently I have been building a Python package for the detection and analysis
of repeating earthquakes
([EQcorrscan](http://calum-chamberlain.github.io/EQcorrscan/)).  The main motivation
for this was to do something better than the original Matlab codes I had been
working with, and as such the package began life as a dump for all my codes.
It has now transittioned into a more useful and meaningful package, specifically
it works well for large-scale cross-correlation problems with hundreds to
thousands of templates and large data volumes (6+ years).  The package is open-source
and I would really like more people to contribute to it.

Alongside my research, or rather, precluding my research, is my cycling.  Bikes
and trails are the reasons I moved to Wellington in the first place, which just
happened to open up the world of earthquake seismology to me.  I won't have
a specific page here on anything cycling, but may post some blogs from some
interesting rides, because thats fun.  

I ride anything from track (although not
recently), through road to cyclo-cross (I help organise the New Zealand's
largest cyclo-cross series, [Hüttcross](http://huttcross.blogspot.co.nz)), and
all kinds of mountain-biking.  Despite always wanting to race downhill, I still
haven't done any proper downhill - the closest I have come is racing local
enduros on my hardtail.


## Posts

<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>
