#!/bin/sh
revert() {
  xset dpms 0 0 0
}

trap revert HUP INT TERM
xset +dpms dpms 5 5 5
i3lock -n -f -r 100 -c 222222
revert
