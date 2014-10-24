angular.module('gitStats')
  .directive('commits', function (d3) {
  var chart = d3.custom.barChart();

  return {
    restrict: 'EA',
    scope: {
      commits: '=',
      height: '=',
      resolution: '=',
      timeDomain: '='
    },
    template: '<div class="chart"></div>',
    link: function ($scope, elem) {
      var chartEl = d3.select(elem[0]);

      $scope.$watch('commits', updateChart);
      $scope.$watch('timeDomain', updateChart);

      function updateChart() {
        if (!($scope.commits && $scope.timeDomain)) { return; }

        var commits = _.filter($scope.commits, function (commit) {
          switch ($scope.resolution) {
            case 'months':
              return moment(commit.Date).year() == $scope.timeDomain;
              break;
            case 'years':
              return true;
              break;
          }
        });

        var commitsPerDay = d3.nest()
          .key(function (d) {
            return d3.time.month(d.Date);
          })
          .rollup(function (values) {
            return values.length;
          })
          .entries(commits);

        var commitNumbersPerDay = _.map(commitsPerDay, function (commit) {
          return {
            key: new Date(commit.key),
            value: commit.values
          }
        });

        chartEl.datum(commitNumbersPerDay).call(chart);
      }

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