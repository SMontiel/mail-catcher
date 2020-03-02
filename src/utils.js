'use strict'

function relativeDate (str) {
  let s = ( +new Date() - Date.parse(str) ) / 1e3,
    m = s / 60,
    h = m / 60,
    d = h / 24,
    y = d / 365.242199,
    tmp;

  return ( tmp = Math.round(s) ) === 1 ? 'just now'
    : m < 1.01                      ? tmp + ' seconds ago'
      : ( tmp = Math.round(m) ) === 1 ? 'a minute ago'
        : h < 1.01                      ? tmp + ' minutes ago'
          : ( tmp = Math.round(h) ) === 1 ? 'an hour ago'
            : d < 1.01                      ? tmp + ' hours ago'
              : ( tmp = Math.round(d) ) === 1 ? 'yesterday'
                : y < 1.01                      ? tmp + ' days ago'
                  : ( tmp = Math.round(y) ) === 1 ? 'a year ago'
                    : tmp + ' years ago';
}

export default relativeDate
