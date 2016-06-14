(function () {
  'use strict';

  angular
    .module('lucidworksView.components.facetField', [
      'lucidworksView.services.config',
      'foundation.core',
      'lucidworksView.utils.queryBuilder',
      'angular-humanize'
    ])
    .config(Config);

  function Config(QueryBuilderProvider){
    'ngInject';
    // Register transformers because facet fields can have funky URL syntax.
    QueryBuilderProvider.registerTransformer('keyValue', 'fq:field', fqFieldkeyValueTransformer);
    QueryBuilderProvider.registerTransformer('preEncodeWrapper', 'fq:field', fqFieldPreEncodeWrapper);
    QueryBuilderProvider.registerTransformer('encode', 'fq:field', fqFieldEncode);
    QueryBuilderProvider.registerTransformer('wrapper', 'fq:field', fqFieldWrapper);

    // TODO properly implement transformer for localParams
    QueryBuilderProvider.registerTransformer('join', 'localParams', localParamJoinTransformer);
    QueryBuilderProvider.registerTransformer('wrapper', 'localParams', localParamWrapperTransformer);

    /**
     * Transformers.
     *
     * These will transform the output of the query, when the query is created.
     */

    function fqFieldkeyValueTransformer(key, value) {

      var escapedKey = QueryBuilderProvider.escapeSpecialChars(key);
      var y = QueryBuilderProvider.keyValueString(escapedKey, value, ':');
      return y;
    }

    function fqFieldPreEncodeWrapper(data){
      return '"'+data+'"';
    }

    function fqFieldEncode(data){
      return QueryBuilderProvider.encodeURIComponentPlus(data);
    }

    function fqFieldWrapper(data){
      return '('+data+')';
    }

    function localParamJoinTransformer(str, values) {
      var tag, curFilterKey, curFilterValue;
      if(str.match(/:/)){
        tag = str.substring(_.indexOf(str, '{'), _.indexOf(str, '}')+1);
        curFilterKey = str.substring(_.indexOf(str, '}')+1, _.indexOf(str, ':'));
        curFilterValue = str.substring(_.indexOf(str, '(')+1, _.indexOf(str, ')'));
      }
      else {
        tag = '{!tag=dc}';
        curFilterKey = str.split('=')[0];
        curFilterValue = str.split('=')[1];
      }
      var qbFilterVal = '(' + QueryBuilderProvider.arrayJoinString(curFilterValue, values.split('=')[1], ' OR ') + ')';
      var filter = QueryBuilderProvider.arrayJoinString(tag + curFilterKey, qbFilterVal, ':');
      console.log('filter', filter) + ')';
      return filter;
    }

    function localParamWrapperTransformer(data) {
      return '"' + data + '"';
    }
  }

})();
