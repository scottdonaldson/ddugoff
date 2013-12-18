(function($){

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

	cSet('booksatwork_admin', 'true', 365);
	
})(jQuery);