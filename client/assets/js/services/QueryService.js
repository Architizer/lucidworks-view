(function () {
  angular.module('fusionSeedApp.services.query', ['fusionSeedApp.services.config',
      'fusionSeedApp.services.queryData'
    ])
    .config(Config)
    .constant('QUERY_OBJECT_DEFAULT', {
      q: '*:*',
      start: 0,
      rows: 10,
      // Do not override the return of JSON
      wt: 'json'
    })
    .provider('QueryService', QueryService);

  function Config(OrwellProvider) {
    'ngInject';
    OrwellProvider.createObservable('query', {});
  }

  function QueryService() {

    this.$get = $get;

    /////////////

    function $get(ConfigService, Orwell, QUERY_OBJECT_DEFAULT, QueryDataService) {
      'ngInject';
      var queryObservable = Orwell.getObservable('query'),
        queryObject = QUERY_OBJECT_DEFAULT;

      activate();

      queryObservable.addObserver(function (query) {
        QueryDataService.getQueryResults(query);
      });

      return {
        setQuery: setQuery,
        getQueryObservable: getQueryObservable,
        getQueryObject: getQueryObject
      };

      function activate() {
        queryObservable.setContent(queryObject);
      }

      function getQueryObservable() {
        return queryObservable;
      }

      function getQueryObject() {
        return queryObservable.getContent();
      }

      function setQuery(query) {
        queryObject = _.assign({}, queryObject, query);
        queryObservable.setContent(queryObject);

      }

    }
  }
})();
