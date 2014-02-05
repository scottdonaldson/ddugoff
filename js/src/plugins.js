// Avoid `console` errors in browsers that lack a console.
if (!(window.console && console.log)) {
    (function() {
        var noop = function() {};
        var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'markTimeline', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
        var length = methods.length;
        var console = window.console = {};
        while (length--) {
            console[methods[length]] = noop;
        }
    }());
}

// popup links
$('body').on('click', '.popup', function(e){
  e.preventDefault();
  window.open($(this).attr('href'),'share','height=420,width=480,fulscreen=no,location=yes,statusbar=no,toolbar=no,resizeable=yes',false);
});

// Cookies
function cGet(name){
    var b, c = document.cookie.split("; "), num = c.length; 
    do { b = c[num - 1].split("="); 
        if (b[0] === name) { return b[1] || ''; } 
    } while(--num); return null;
}
function cSet(name, v, exp) { 
    document.cookie = name+"="+v+"; path=/; domain="+window.location.hostname+";"+((exp)?"expires="+new Date(new Date().getTime()+(exp*864e5)).toGMTString():'');
}

// Placeholdr, Copyright (c) 2013 Shane Carr
// https://github.com/vote539/placeholdr
// X11 License
(function(b,c,e,d){var h=function(){var a=b(this);a[d]()||(a.addClass(c),"password"===a.attr("type")&&(a.attr("type","text"),a.data(c+"-pwd",!0)),a[d](a.attr(e)))},f=function(){var a=b(this);a.removeClass(c);a.data(c+"-pwd")&&a.attr("type","password");if(a[d]()===a.attr(e))a[d]("")},k=function(){b(this).find("["+e+"]").each(function(){b(this).data(c)&&f.call(this)})};b.fn.placeholdr=function(){e in document.createElement("input")||(b(this).find("["+e+"]").each(function(){var a=b(this);a.data(c)||
(a.data(c,!0),h.call(this),a.focus(f),a.blur(h))}),b(this).find("form").each(function(){var a=b(this);a.data(c)||(a.data(c,!0),a.submit(k))}))};b.fn[d]=b.fn.val;b.fn.val=function(a){var g=b(this);if("undefined"===b.type(a)&&g.data(c)&&g[d]()===g.attr(e))return"";"string"===b.type(a)&&f.call(this);return b.fn[d].apply(this,arguments)};b(function(){b(document).placeholdr()});document.write("<style>.placeholdr{color:#AAA;}</style>")})(jQuery,"placeholdr","placeholder","placeholdrVal");