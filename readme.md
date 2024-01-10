# Hammermap
A map for WFRP or other games. Used to store battlemaps and images for games, plus give extra detail to locations

# Storage of map files
Map files are not stored here, but are stored in the sister repo:
https://github.com/claydegruchy/wfrp-map-storage
All maps are kept here so we don't have to load 500+ mb worth of images into gh actions every push to main.

# Whats the deal
This uses firebase to store images and locations uploaded to users.

# Something went wrong, I found [some broken shit] 
It do be like that sometimes, drop in an issue or PR and ill sort it out.


# Credits
I DO NOT OWN these maps! I give credit to the original authors:
## World map
Big thanks to gitzmansgallery for putting it together. Extract from gitzmansgallery.com:
Some original artwork is credited to Andreas Blicher, based upon Alfred Nunez, Jr.'s outstanding cartography and research. Many other sources were used including those from the Warhammer Maps page.

## City maps
### Altdorf
Thanks to Magnus Seter via http://altdorfer.blogspot.com. I hope to load the various POIs one day.
### Various maps from planjanusza
Big thanks to https://www.deviantart.com/planjanusza for the free listed assets on their deviantart. Amazing stuff and inspired me to make this. Multiple maps are used from here and I hope this list is exhaustive:
- Marienburg

# notes
DelaunayCells
in order to make this work, i need to make paths their own entities in firebase
- generate the paths with Delaunay
- set the paths in the database
- remove the Delaunay generated paths from the ui, and use db to infrom the paths

but then i need a pipeline to ensure i can do this again easily in future without needning to remove the paths.
maybe every point that has a path cnnected to it should not be included in future Delaunay calculations

# definitions

- routes=>line 
  - lines between things, usually settlements
- settlements => point
  - a spot indicating a place where people live or lived
- features => polygons, if at all
  - a geographical feature
- regions => polygons
  - large geographical regions, usually with ownership
- scenes => point
  - a user submitted image containing a battlemap or artwork

