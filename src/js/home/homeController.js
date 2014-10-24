angular.module('gitStats')

.controller('HomeController', function($scope, commitResource, moment, $interval) {

  function commitsByAuthor(commits) {
    return _.chain(commits)
      .groupBy(_.property('Author'))
      .map(function(commits, authorName) {
        return { author: authorName, commits: commits.length }
      })
      .sortBy('commits')
      .reverse()
      .value();


    return commits;
  }

  function comitterOfTheMonth(commits) {
    return _.chain(commits)
      .groupBy(function(commits) {
        return moment(commits.Date).format('YYYY-MM')
      })
      .map(function(commits, month) {
        return {
          month: month,
          committer: _.first(commitsByAuthor(commits))
        }
      })
      .sortBy('month')
      .value()
  }

  $scope.showTable = true;
  $scope.resolution = 'months';
  $scope.timeDomain = '2014';

  commitResource.query().$promise
    .then(function (commits) {
      $scope.commits = _.chain(commits)
        .filter(function (commit) {
          var date = moment(commit.Date);
          return date.isAfter('2005-01-01') && date.isBefore(moment());
        })
        .map(function (commit) {
          return new commitResource({
            Date: moment(commit.Date).toDate(),
            SHA: commit.SHA,
            Author: commit.Author,
            Message: commit.Message
          });
        })
        .value();

      updateSelects();

      return commits;

      /*$interval(function () {
        //$scope.commits = _.times(25, generateCommit);
      }, 2000);*/

    })
    .then(function(commits) {
      $scope.commitsByAuthor = commitsByAuthor(commits);
      return commits
    })
    .then(function(commits) {
      $scope.committerOfMonth = comitterOfTheMonth(commits);
      return commits
    });

  $scope.$watch('resolution', updateSelects);

  function updateSelects() {
    if(!$scope.commits || !$scope.resolution) { return; }
    switch($scope.resolution) {
      case 'months':
        var timeExtent = d3.extent($scope.commits, function (commit) {
          return moment(commit.Date).year();
        });
        break;
      case 'days':
        var timeExtent = d3.extent($scope.commits, function (commit) {
          return moment(commit.Date).month();
        });
        break;
    }

    var domain = _.range(timeExtent[0], timeExtent[1]+1);
    $scope.timeDomains = domain;
    $scope.timeDomain = _.last(domain);
  }

  function generateCommit() {
    return {
      SHA: Math.random().toString(15).substring(2, 32),
      Date: randomDate(new Date(2014,9,20), new Date()),
      Author: 'Frank',
      Message: 'This is a message'
    }
  }

  function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }
});
