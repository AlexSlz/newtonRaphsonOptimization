<template>
  <div style="text-align: center">
    <table id="myTable">
      <thead>
        <tr>
          <td>Iteration</td>
          <th v-for="item in getKeys()">{{ item }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in Result">
          <td>{{ index }}</td>
          <td v-for="i in getValues(index)">{{ i }}</td>
        </tr>
      </tbody>
    </table>
    <button @click="exportToExcel('myTable')">Export Table To Excel</button>
  </div>
</template>

<script>
export default {
  props: {
    xList: Object,
    Result: Object,
  },
  methods: {
    getKeys() {
      return Object.keys(this.Result[0])
    },
    getValues(i) {
      return Object.values(this.Result[i])
    },
    exportToExcel(tableID) {
      var dataType = 'application/vnd.ms-excel'
      var tableSelect = document.getElementById(tableID)
      var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20')

      let filename = 'excelTable.xls'

      // Create download link element
      let downloadLink = document.createElement('a')

      document.body.appendChild(downloadLink)

      if (navigator.msSaveOrOpenBlob) {
        var blob = new Blob(['\ufeff', tableHTML], {
          type: dataType,
        })
        navigator.msSaveOrOpenBlob(blob, filename)
      } else {
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML
        downloadLink.download = filename
        downloadLink.click()
      }
    },
    // flipTable() {
    //   let temp = []
    //   let maxlength = 0
    //   this.Result.data.map((item) => {
    //     if (maxlength < item.length) maxlength = item.length
    //   })
    //   for (let i = 0; i < maxlength; i++) {
    //     let second = []
    //     for (let t = 0; t < this.Result.data.length; t++) {
    //       second.push(this.Result.data[t][i])
    //     }
    //     temp.push(second)
    //   }
    //   return temp
    // },
  },
}
</script>

<style scoped>
table {
  text-align: center;
  vertical-align: middle;
  margin: 0 0 40px 0;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  @media screen and (max-width: 580px);
  min-width: 500px;
}
th {
  background: #282828;
  font-weight: 100;
  padding: 14px;
}
td {
  padding: 10px;
}
td:first-child {
  background-color: crimson;
}
</style>
