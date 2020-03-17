#!/bin/sh
revert() {
  xset dpms 0 0 0
}

trap revert HUP INT TERM
xset +dpms dpms 5 5 5
i3lock -n -f -r 100 -c 222222 -i /home/muerwre/Pictures/wallpapers/leaves_plant_dark_131528_3840x2400.jpg1k
revert
