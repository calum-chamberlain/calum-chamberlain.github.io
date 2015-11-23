---
layout: page
title: Research
tagline: Observational Seismology
description: CJC Research
permalink: /research/
group: navigation
---
{% include JB/setup %}

**This page is in development**

# Research interests

I am interested in general in tectonics and fault mechanics, currently I study
these areas through observational seismology.  Within the field of observational
seismology I endeavour to create complete catalogues of seismicity (within an area)
to enable studies of spatial and temporal changes in seismicity.  To generate
these complete catalogues we need to have an objective method of detecting
and analysing earthquakes over large time-periods, without the inherent subjectivity
that normal obervatory practices have.  To this end I am also interested in applying
*big-data* type methods for data mining, clustering and visualisation to seismic
data.

<div class="linebreak"> <span><p></p></span> </div>

# Current projects

## Low-frequency earthquakes on the Alpine Fault

<hr>
## Deep-Fault Drilling Project

<hr>
## Tasman glacier speed-up

<hr>
## Along-strike changes in seismicity adjacent to the Alpine Fault

<hr>
## Southern Alps Micro-earthquake Borehole Array

Less a research interest, more the tool to achieve the above interests; the
Southern Alps Micro-earthquake Borehole Array (SAMBA) is a network of 13
seismometers deployed in the central Southern Alps to monitor micro-seismicity
on and near the Alpine Fault.  The SAMBA deployment began in late 2008 under
the Marsden project: "Putting a spethoscope on the Alpine Fault".  The initial
deployment and data analysis formed was completed by Dr. Carolin Boese during
here PhD at Victoria Unversity of Wellington.  The network has since been maintained
and added to during my PhD tenure.  

<div style="text-align:center">
<img src="{{ site.productionurl }}/assets/images/loc_map.pdf" alt="SAMBA map" style="width: 50%;"/>
<br><em>Map of the SAMBA network taken from Chamberlain et al. (2014)</em>
</div>

SAMBA is a network of short-period sensors deployed mostly in
shallow (post-hole) boreholes, with three deeper borehole sites, and four
short-period surface sensors to extend the network over the LFE and tremor
source region.

Thanks to the amazing situation of the network we have some fun fieldtrips to
collect the data every six months.  Ideally data would be telemetered from the
sites to reduce costs (helicopter bills rack up), but a lack of sight-lines and
no cell-phone reception mean that this is currently very difficult.

<div style="text-align:center">
<img src="{{ site.productionurl }}/assets/images/SOLU_majestic.jpg" alt="SAMBA stunning" style="width: 90%;"/>
<br><em>Calum at the Solution Ranges (SOLU) SAMBA site in the central Southern Alps, overlooking the Landsborough Valley</em>
</div>

The network produces some amazing data in a relatively seismically quiet region
of New Zealand.  There are very few earthquakes above M 4 within the network, and
many noise sources (e.g. helicopters, storms, rockfalls, glacier motion, ocean),
which make earthquake detection and analysis difficult.  As such having a borehole
deployment, with the reduction in noise that these bring, is essential to study
this crucial section of the on-land plate boundary in New Zealand.

<hr>
## Developing multi-parallel open-source software for earthquake detection

<div style="text-align:center">
<IMG src="{{ site.productionurl }}/assets/EQcorrscan_logo.png" alt="EQcorrscan logo" align="middle" style="width: 60%;"/>
</div>

To achieve any of the large-scale (long-duration datasets in spatial and
temporal resolution) catalogues in an objective (because catalogues should
be measurably complete, rather than subjectively complete according to which
analyst was working a particular day, or whether that analyst was hungover)
manor, we need to process all the data in the same way.  One way to do this is
using the matched-filter technique.  However this requires *a-priori* knowledge
of the earthquake source.  I am working on a method of extracting earthquake
information from the continuous data using a matched-filter approach, without
this prior knowledge (it's already in development on
[EQcorrscan](http://calum-chamberlain.github.io/EQcorrscan/)).

To allow this method to work we first need an efficient matched-filter routine.
I have been developing (and continue to develop) network-based matched-filter
routines and analysis functions as part of the
[EQcorrscan](http://calum-chamberlain.github.io/EQcorrscan/) package.  These
routines can be used on small or large computers, for large datasets they
work best on big machines.  I have been fortunate enough to obtain time on
the [PAN cluster](https://wiki.auckland.ac.nz/display/CER/NeSI+Pan+Cluster)
through the [NeSI](https://www.nesi.org.nz) project.  This has allowed me to
use over 600 templates, scanned through the full 6.5 year dataset, with compute
clock times of less than 10.5 hours (less than 4 hours if I could use all the
resources!).

<div class="linebreak"> <span><p></p></span> </div>

# Completed projects

## The first low-frequency earthquake catalogue for the Alpine Fault

After Aaron Wech and Carolin Boese found tremor using the SAMBA network
([Wech et al. 2012](http://onlinelibrary.wiley.com/doi/10.1029/2012GL051751/full))
I set about lookin for low-frequency earthquakes (LFEs) within the tremor.
I found a small set of LFEs by manual inspection, and, alongside David Shelly
of the USGS, applied a matched-filter cross-correlation routine to find more,
similar, LFEs.  We documented 14 LFE clusters or families, which repeated
throughout the 36 month period we studied.  The catalogue we generated contained
over 8000 discrete LFEs, with higher detection rates during tremor periods, and
following large regional earthquakes.  You can read more in the paper we published
in Geochemisty, Geophysics, Geosystems:
[Chamberlain et al. 2014](http://onlinelibrary.wiley.com/doi/10.1002/2014GC005436/full).

<hr>

## Stress and strain rates near the San Andreas Fault
