angular.module('gitStats')
  .directive('commits', function (d3) {
  var chart = d3.custom.barChart();

  return {
    restrict: 'EA',
    scope: {
      commits: '=',
      height: '=',
      resolution: '@'
    },
    template: '<div class="chart"></div>',
    link: function ($scope, elem) {
      var chartEl = d3.select(elem[0]);

      $scope.$watch('commits', function (newVal, oldVal) {
        if (newVal == oldVal) { return }

        var commitsPerDay = d3.nest()
          .key(function (d) {
            return d3.time.month(d.Date);
          })
          .entries(newVal);

        var commitNumbersPerDay = _.map(commitsPerDay, function (commit) {
          return {
            key: new Date(commit.key),
            value: commit.values.length
          }
        })
        chartEl.datum(commitNumbersPerDay).call(chart);
      });

      $scope.$watch('height', function (oldVal, newVal) {
        if (newVal == oldVal) { return }
        chartEl.call(chart.height($scope.height));
      });

      /*$scope.$watch('resolution', function (oldVal, newVal) {
        if (newVal == oldVal) { return }
        chartEl.call(chart.resolution($scope.resolution));
      });*/

    }
  }
});