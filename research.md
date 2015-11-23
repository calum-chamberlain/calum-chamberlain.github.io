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


# Current projects

## Low-frequency earthquakes on the Alpine Fault

## Deep-Fault Drilling Project

## Tasman glacier speed-up

## Along-strike changes in seismicity adjacent to the Alpine Fault

## Southern Alps Micro-earthquake Borehole Array

Less a research interest, more the tool to achieve the above interests; the
Southern Alps Micro-earthquake Borehole Array (SAMBA) is a network of 13
seismometers deployed in the central Southern Alps to monitor micro-seismicity
on and near the Alpine Fault.  The SAMBA deployment began in late 2008 under
the Marsden project: "Putting a spethoscope on the Alpine Fault".  The initial
deployment and data analysis formed was completed by Dr. Carolin Boese during
here PhD at Victoria Unversity of Wellington.  The network has since been maintained
and added to during my PhD tenure.  

<img src="{{ site.productionurl }}/assets/images/SAMBA_map.pdf" alt="SAMBA map" style="width: 100%;"/>

SAMBA is a network of short-period sensors deployed mostly in
shallow (post-hole) boreholes, with three deeper borehole sites, and four
short-period surface sensors to extend the network over the LFE and tremor
source region.

Thanks to the amazing situation of the network we have some fun fieldtrips to
collect the data every six months.  Ideally data would be telemetered from the
sites to reduce costs (helicopter bills rack up), but a lack of sight-lines and
no cell-phone reception mean that this is currently very difficult.

<img src="{{ site.productionurl }}/assets/images/SAMBA_photo.jpg" alt="SAMBA stunning" style="width: 100%;"/>

The network produces some amazing data in a relatively seismically quiet region
of New Zealand.  There are very few earthquakes above M 4 within the network, and
many noise sources (e.g. helicopters, storms, rockfalls, glacier motion, ocean),
which make earthquake detection and analysis difficult.  As such having a borehole
deployment, with the reduction in noise that these bring, is essential to study
this crucial section of the on-land plate boundary in New Zealand.

## Developing multi-parallel open-source software for earthquake detection

<IMG class="displayed" src="{{ site.productionurl }}/assets/EQcorrscan_logo.png" alt="EQcorrscan logo" align="middle" style="width: 100%;"/>

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

# Completed projects

## The first low-frequency earthquake catalogue for the Alpine Fault

## Stress and strain rates near the San Andreas Fault
