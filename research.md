---
layout: page
title: Research
tagline: Observational Seismology
description: CJC Research
permalink: /research/
group: navigation
---
{% include JB/setup %}

# Research interests


# Current projects

## Low-frequency earthquakes on the Alpine Fault

## Deep-Fault Drilling Project

## Tasman glacier

## Along-strike changes in seismicity adjacent to the Alpine Fault

## Developing multi-parallel open-source software for earthquake detection

![EQcorrscan logo]({{ site.productionurl }}/assets/EQcorrscan_logo.png)

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
