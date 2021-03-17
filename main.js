'use strict';

(function () {
    [
        'data.min.js',
        'masks.min.js',
        'logic.min.js',
      ].forEach(function(src) {
        var script = document.createElement('script');
        script.src = src;
        script.async = false;
        document.head.appendChild(script);
      });
})();
