<template>
  <div>
    <canvas id="newtonChart" width="500" height="250"></canvas>
  </div>
</template>

<style>
canvas {
  margin: 100px;
  padding-left: 0;
  padding-right: 0;
  margin-left: auto;
  margin-right: auto;
  width: 70%;
}
</style>

<script>
import Chart from 'chart.js/auto'

export default {
  data() {
    return {
      chart: [],
    }
  },
  methods: {
    clearChart() {
      let chart = Chart.getChart('newtonChart')
      if (chart != undefined) {
        chart.destroy()
      }
    },
    updateChart(templates, limit, root) {
      this.clearChart()
      this.chart = new Chart(document.getElementById('newtonChart'), {
        type: 'line',
        data: {
          datasets: [
            // {
            //   label: `Graph of f(${funcData.xName})`,
            //   data: funcData.points,
            //   fill: false,
            //   lineTension: 0.1,
            //   backgroundColor: 'rgb(255, 0, 78)',
            //   borderColor: 'rgb(255, 0, 78)',
            //   borderCapStyle: 'butt',
            //   borderDash: [],
            //   borderDashOffset: 0.0,
            //   borderJoinStyle: 'miter',
            //   pointBorderColor: 'rgb(255, 0, 78)',
            //   pointBackgroundColor: 'rgba(255, 0, 78, 0.4)',
            //   pointBorderWidth: 1,
            //   pointHoverRadius: 5,
            //   pointHoverBackgroundColor: 'rgb(255, 0, 78)',
            //   pointHoverBorderColor: '#fff',
            //   pointHoverBorderWidth: 2,
            //   pointRadius: 0,
            //   pointHitRadius: 10,
            //   spanGaps: false,
            // },
            // {
            //   label: `${funcData.xName}`,
            //   data: result,
            //   fill: false,
            //   lineTension: 0.1,
            //   backgroundColor: 'rgb(119,221,119)',
            //   borderColor: 'rgb(119,221,119)',
            //   borderCapStyle: 'butt',
            //   borderDash: [],
            //   borderDashOffset: 0.0,
            //   borderJoinStyle: 'miter',
            //   pointBorderColor: 'rgb(119,221,119)',
            //   pointBackgroundColor: 'rgba(119,221,119,0.4)',
            //   pointBorderWidth: 1,
            //   pointHoverRadius: 5,
            //   pointHoverBackgroundColor: 'rgb(119,221,119)',
            //   pointHoverBorderColor: '#fff',
            //   pointHoverBorderWidth: 2,
            //   pointRadius: 5,
            //   pointHitRadius: 10,
            //   spanGaps: false,
            // },
          ],
        },
        options: {
          scales: {
            x: {
              type: 'linear',
              position: 'top',
              ticks: {
                min: limit.minX + root,
                max: limit.maxX + root,
              },
            },

            y: {
              display: true,
              ticks: {
                min: limit.minY,
                max: limit.maxY,
              },
              grid: {
                lineWidth: 5,
              },
            },
          },
          responsiveAnimationDuration: 1000,
        },
      })
      this.chart.data.datasets = templates
      this.chart.update()
    },
    addToDataSet(template) {
      this.chart.data.datasets.push(template)
    },
    getFLineTemplate(points, color, xName) {
      let result = {
        label: `Graph of f(${xName})`,
        data: points,
        fill: false,
        lineTension: 0.1,
        backgroundColor: color,
        borderColor: color,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: color,
        pointBackgroundColor: color,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        pointRadius: 0,
        pointHitRadius: 10,
        spanGaps: false,
      }
      return result
    },
    getNewtonTemplate(xName, points, color) {
      let result = {
        label: `${xName}`,
        data: points,
        fill: false,
        lineTension: 0.1,
        backgroundColor: color,
        borderColor: color,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: color,
        pointBackgroundColor: color,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        pointRadius: 5,
        pointHitRadius: 10,
        spanGaps: false,
      }
      return result
    },
  },
  mounted() {},
}
</script>
