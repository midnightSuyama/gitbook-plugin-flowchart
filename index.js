var path    = require('path');
var phantom = require('phantom');
var Q       = require('q');

module.exports = {
  blocks: {
    flowchart: {
      process: function(blk) {
        var deferred = Q.defer();

        var code    = blk.body;
        var options = this.book.options.pluginsConfig['flowchart'];

        phantom.create().then(function(ph) {
          ph.createPage().then(function(page) {
            var pagePath = path.join(__dirname, 'renderer.html');
            page.open(pagePath).then(function(status) {
              var result = page.evaluate(function(code, options) {
                return render(code, options);
              }, code, options);
              ph.exit();
              deferred.resolve(result);
            });
          });
        });

        return deferred.promise;
      }
    }
  },
  hooks: {
    "init": function() {
      if (typeof this.options.pluginsConfig['flowchart'] === 'undefined') {
        this.options.pluginsConfig['flowchart'] = {};
      }
    }
  }
};
