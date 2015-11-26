---
layout: page
title: CJC:Research
tagline: Observational Seismology
description: CJC Research
permalink: /research/
group: navigation
---
{% include JB/setup %}

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

Following on from the discovery of tremor on the deep extent of the Alpine Fault
by [Wech et al., (2012)](http://onlinelibrary.wiley.com/doi/10.1029/2012GL051751/full),
we extracted high amplitude periods from the tremor to use a templates to scan for low-frequency
earthquakes.  In this way we provided the first documentation of 14 low-frequency
earthquake (LFE) families. These LFE families locate near the inferred (from GPS,
seismic reflection and magnetotelluric studies) deep extent of the Alpine Fault,
within a region of low quality factor (high attenuation), which we hypothesise
is a region of high fluid pressure.  We calculated magnitudes for all the events
in our catalogue and demonstrated an exponential frequency-magnitude relationship.
We also saw increases in LFE detection rates following large regional earthquakes
which may be due to triggering.  These results were published as
[Chamberlain et al., (2014)](http://onlinelibrary.wiley.com/doi/10.1002/2014GC005436/full).

<div style="text-align:center">
<img src="{{ site.productionurl }}/assets/images/LFE_cartoon_equal.jpg" alt="LFE cartoon" style="width: 50%;"/>
<br><em>Summary cartoon of LFEs in light of other studies</em>
</div>

We are now working on extending the catalogue using a longer continuous
seismic dataset, and more templates in an effort to generate a spatially and
temporally continuous catalogue.  This has been difficult as many previously
used methods have either failed, due to high noise levels and low inter-station
coherance, or are computationally inefficient for large datasets.  We are developing
a new method at the moment... to be continued.

<hr>
## Deep-Fault Drilling Project

<div style="text-align:center">
<img src="{{ site.productionurl }}/assets/images/NASA_2_Central_AlpineF.jpg" alt="Alpine Fault from space" style="width: 100%;"/>
<br><em>Alpine Fault from space - from the <a href="https://wiki.gns.cri.nz/DFDP">DFDP wiki</a></em>
</div>

I was lucky to be involved in the second phase of the deep-fault drilling project
(DFDP-2), where we tried to drill into the Alpine Fault in Whataroa.  My role in
the project was characterising the seismicity in the Whataroa Valley prior to drilling,
and co-leading the real-time seismic monitoring around the drill-site.  We have
used the [EQcorrscan](http://calum-chamberlain.github.io/EQcorrscan/) package to
detect (and an as yet, non-distributed correlation based picking routine) and
locate near-repeating seismicity near the drill-site.  Currently this work
is unpublished, as we refine locations using a variety of velocity models.

During and before drilling we operated a 24-7 real-time seismic monitoring
operation using open-source ([RTQuake](http://srl.geoscienceworld.org/content/85/3/735.full))
software to detect and generate initial locations and magnitudes.  To check and
refine picks and locations we operated in an international team of seismologists,
making use of different time-zones to check detections within 30 minutes of them
being made.

<hr>
## Tasman glacier speed-up

<div style="text-align:center">
<IMG src="{{ site.productionurl }}/assets/images/Tasman_LABE.jpg" alt="Tasman glacier from LABE" align="middle" style="width: 90%;"/>
<br><em>Tasman Glacier in the central Southern Alps from seismic site LABE on De La Beche ridge.</em>
</div>

The Tasman Glacier is a large temperate glacier (containing 29% of New Zealand's
perenial ice) near Mt. Cook in the central Southern Alps.  
[Horgan et al., (2015)](http://www.sciencedirect.com/science/article/pii/S0012821X15006512)
documented speed-up events using geodetic observations on the glacier, following
large rainfall events.  We have a seismic site as part of the SAMBA network
within 1km of the glacier (above photo taken from the site, LABE), which has
increased amplitudes during large speed-up events.  How this seismic signal
relates to the speed-up events is a topic of current research within our
group at Victoria University of Wellington.

<!-- <hr> -->
<!-- ## Along-strike changes in seismicity adjacent to the Alpine Fault

Carolin Boese provided a detailed microseismicity catalogue for the central
Southern Alps ([Boese et al., (2012)](http://onlinelibrary.wiley.com/doi/10.1029/2011JB008460/full)),
including subcrustal earthquakes
([Boese et al. (2013)](http://www.sciencedirect.com/science/article/pii/S0012821X13003464))
and swarms ([Boese at al. (2014)](http://onlinelibrary.wiley.com/doi/10.1002/2013GC005171/full)).
How this seismicity and low-frequency earthquakes and tremor change along-strike
of the Alpine Fault may provide constraints on where earthquakes might nucleate
on the Alpine Fault. -->

<hr>
## Southern Alps Micro-earthquake Borehole Array

Less a research interest, more the tool to achieve the above interests; the
Southern Alps Micro-earthquake Borehole Array (SAMBA) is a network of 13
seismometers deployed in the central Southern Alps to monitor micro-seismicity
on and near the Alpine Fault.  The SAMBA deployment began in late 2008 under
the Royal Society of New Zealand, Marsden funded project: "Putting a stethoscope on the Alpine Fault".  The initial
deployment and data analysis formed was completed by Dr. Carolin Boese during
here PhD at Victoria University of Wellington.  The network has since been maintained
and added to during my PhD tenure.  

<div style="text-align:center">
<img src="{{ site.productionurl }}/assets/images/loc_map.jpg" alt="SAMBA map" style="width: 50%;"/>
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
I set about looking for low-frequency earthquakes (LFEs) within the tremor.
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

Working with Nicolas Houlie during my masters project, we compared stress and
strain rates in the vicinity of the San Andreas -
[Chamberlain et al., (2014)](http://www.sciencedirect.com/science/article/pii/S0012821X14002945).
