d3.custom = {};

d3.custom.barChart = function module() {
  var margin = {top: 20, right: 20, bottom: 40, left: 40},
    width = 1000,
    height = 500,
    gap = 0;
  var svg, duration = 500, resolution = 'months';

  function exports(selection) {

    selection.each(function (data) {

      var chartW = width - margin.left - margin.right,
        chartH = height - margin.top - margin.bottom;

      var xExtent = d3.extent(data, function (d) {
        return d.key;
      });

      var xDomain = d3.time.months(
        xExtent[0],
        d3.time.month.offset(xExtent[1], 1)
      );

      var x1 = d3.scale.ordinal()
        .domain(xDomain)
        .rangeRoundBands([0, chartW], .1);

      var y1 = d3.scale.linear()
        .domain([
          0, d3.max(data, function (d, i) {
            return d.value;
          })
        ])
        .range([chartH, 0]);

      var xAxis = d3.svg.axis()
        .scale(x1)
        .orient('bottom')
        .tickFormat(d3.time.format("%d %b"));

      var yAxis = d3.svg.axis()
        .scale(y1)
        .orient('left')
        .tickFormat(d3.format('d'));

      var barW = chartW / data.length;

      if (!svg) {
        svg = d3.select(this)
          .append('svg')
          .classed('chart', true);
        var container = svg.append('g').attr('class', 'container-group');
        container.append('g').attr('class', 'chart-group');
        container.append('g').attr('class', 'x-axis-group axis');
        container
          .append('g')
          .attr('class', 'y-axis-group axis')
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text('Commits');
      }

      svg.transition().duration(duration).attr({width: width, height: height})
      svg.select('.container-group')
        .attr({transform: 'translate(' + margin.left + ',' + margin.top + ')'});

      svg.select('.x-axis-group.axis')
        .attr({transform: 'translate(0,' + (chartH) + ')'})
        .call(xAxis);

      svg.select('.y-axis-group.axis')
        .transition()
        .duration(duration)
        .call(yAxis);

      var gapSize = x1.rangeBand() / 100 * gap;
      var barW = x1.rangeBand() - gapSize;
      var bars = svg.select('.chart-group')
        .selectAll('.bar')
        .data(data, function (d) {

          return d.key;
          switch(resolution) {
            case 'year':
              console.log(moment(d.key).year(0));
              return moment(d.key).year(0).month();
              return moment(d.key).month();
            case 'month':
              return moment(d.key).month(0).day();
              return moment(d.key).day();
          }
        });
      bars.enter().append('rect')
        .classed('bar', true)
        .attr({
          x: chartW,
          width: barW,
          y: function (d, i) {
            return y1(d.value);
          },
          height: function (d, i) {
            return chartH - y1(d.value);
          }
        });
      bars
      /*.transition()
       .duration(duration)
        .ease(ease)*/
        .attr({
          width: barW,
          x: function (d, i) {
            return x1(d.key) + gapSize / 2;
          }
        })
        .transition()
        .duration(duration)
        .attr({
          y: function (d, i) {
            return y1(d.value);
          },
          height: function (d, i) {
            return chartH - y1(d.value);
          }
        });
      bars.exit().transition().style({opacity: 0}).remove();

      duration = 500;

    });
  }

  exports.width = function (_x) {
    if (!arguments.length) {
      return width;
    }
    width = parseInt(_x);
    return this;
  };
  exports.height = function (_x) {
    if (!arguments.length) {
      return height;
    }
    height = parseInt(_x);
    duration = 0;
    return this;
  };
  exports.resolution = function (_x) {
    if (!arguments.length) {
      return resolution;
    }
    resolution = _x;
    return this;
  };
  exports.gap = function (_x) {
    if (!arguments.length) {
      return gap;
    }
    gap = _x;
    return this;
  };
  return exports;
};