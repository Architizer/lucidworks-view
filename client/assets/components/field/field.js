(function () {
  angular.module('lucidworksView.components.field', ['lucidworksView.services.config',
      'lucidworksView.utils.docs'
    ])
    .directive('field', fieldItem);


  function fieldItem() {
    'ngInject';
    return {
      restrict: 'EA',
      templateUrl: 'assets/components/field/field.html',
      scope: true,
      controller: Controller,
      controllerAs: 'fc',
      bindToController: {
        value: '=',
        highlight: '=',
        hkey: '@', //The Highlight key, used to look up the proper highlighting snippet by name.
        maxlength: '='
      },
      replace: true
    };
  }

  function Controller($sanitize) {
    'ngInject';
    var fc = this;

    activate();

    ///////////

    function activate() {
      fc.value = processField(fc.value, fc.hkey, fc.highlight, fc.maxlength);
    }

    function processField(field, highlightKey, highlight, maxlength) {
      var result = $sanitize(_.escape(field));
      var hasHighlight = false;

      if (highlight && Object.keys(highlight).length > 0) {
        if (highlight[highlightKey]) {
          result = highlight[highlightKey];
        }
      }
      // Only shorten if not highlighting, since highlighing in solr can control
      // snippet size there and b/c we have a Trusted object and not a plain
      // old string.

      // If field is multivalued, join the items before trimming
      result = _.isArray(result)?_.join(result, ' '):result;

      if (hasHighlight === false && result && result.length > maxlength) {
        // Trim it, ideally on whitespace
        var idx = result.lastIndexOf(' ', maxlength);
        if (idx !== -1) {
          result = result.substring(0, idx);
        } else {
          // We can't find simple whitespace, so just trim arbitrarily
          result = result.substring(0, maxlength);
        }
        result += '...';
      }
      return result;
    }
  }
})();
