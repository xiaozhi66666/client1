<template>
  <div>
    <div
      class="charts_container"
      style="display: flex; justify-content: space-around"
    >
      <div class="item" style="width: 45%">
        <h1 style="text-align: center; margin: 10px 0">Gdp comparison</h1>
        <canvas id="planet-chart"></canvas>
      </div>
      <div class="item" style="width: 45%">
        <h1 style="text-align: center; margin: 10px 0">
          Poplations comparison
        </h1>
        <canvas id="planet-chart1"></canvas>
      </div>
    </div>
    <div
      class="charts_container"
      style="display: flex; justify-content: space-around; margin: 40px 0"
    >
      <div class="item" style="width: 45%">
        <h1 style="text-align: center; margin: 10px 0">
          Nobel comparison <span style="font-size: 12px">(2000-2022)</span>
        </h1>
        <canvas id="planet-chart2"></canvas>
      </div>
      <div class="item" style="width: 45%">
        <h1 style="text-align: center; margin: 10px 0">score comparison</h1>
        <canvas id="planet-chart3"></canvas>
      </div>
    </div>
  </div>
</template>
<script>
//master
import Chart from "chart.js";
import { formatPieData, generateRandomColors } from "@/utils/format";
let baseUrl = "http://api.worldbank.org/v2/countries";
let gdpApi = {
  zh: baseUrl + "/CHN/indicators/NY.GDP.MKTP.CD?per_page=5000&format=json",
  in: baseUrl + "/IND/indicators/NY.GDP.MKTP.CD?per_page=5000&format=json",
  us: baseUrl + "/USA/indicators/NY.GDP.MKTP.CD?per_page=5000&format=json",
};
let populationApi = {
  zh: baseUrl + "/CHN/indicators/SP.POP.TOTL?per_page=5000&format=json",
  in: baseUrl + "/IND/indicators/SP.POP.TOTL?per_page=5000&format=json",
  us: baseUrl + "/USA/indicators/SP.POP.TOTL?per_page=5000&format=json",
};
let nobelApi = "https://api.nobelprize.org/v1/country.json";
export default {
  //life cycles
  created() {},
  //methods
  methods: {
    async getDataGdp() {
      const resG = await this.$http.get(gdpApi.zh);
      const resG1 = await this.$http.get(gdpApi.in);
      const resG2 = await this.$http.get(gdpApi.us);
      this.obj.data.labels = resG.data[1].reverse().map((i) => i.date);
      const data = resG.data[1].map((i) => i.value);
      const data1 = resG1.data[1].reverse().map((i) => i.value);
      const data2 = resG2.data[1].reverse().map((i) => i.value);
      this.obj.data.datasets.push({
        label: "China",
        data: data,
        fill: false,
        borderColor: "red",
        tension: 0.1,
      });
      this.obj.data.datasets.push({
        label: "India",
        data: data1,
        fill: false,
        borderColor: "yellow",
        tension: 0.2,
      });
      this.obj.data.datasets.push({
        label: "USA",
        data: data2,
        stepped: true,
        fill: false,
        borderColor: "blue",
        tension: 0.3,
      });
      const resP = await this.$http.get(populationApi.zh);
      const resP1 = await this.$http.get(populationApi.in);
      const resP2 = await this.$http.get(populationApi.us);
      this.popObj.data.labels = resP.data[1].reverse().map((i) => i.date);
      const dataP = resP.data[1].map((i) => i.value);
      const dataP1 = resP1.data[1].reverse().map((i) => i.value);
      const dataP2 = resP2.data[1].reverse().map((i) => i.value);
      this.popObj.data.datasets.push({
        label: "CHINA",
        data: dataP,
        borderSkipped: "bottom", //默认为底部
        backgroundColor: "red",
        borderWidth: 1,
      });
      this.popObj.data.datasets.push({
        label: "INDIA",
        data: dataP1,
        borderSkipped: "bottom", //默认为底部
        backgroundColor: "yellow",
        borderWidth: 1,
      });
      this.popObj.data.datasets.push({
        label: "USA",
        data: dataP2,
        borderSkipped: "bottom", //默认为底部
        backgroundColor: "blue",
        borderWidth: 1,
      });
      const nobelCountry = await this.$http.get(nobelApi);
      const obj1 = formatPieData(nobelCountry.data.countries.slice(-23));
      const pieL = [];
      const pieD = [];
      for (var key in obj1) {
        pieL.push(key);
        pieD.push(obj1[key]);
      }
      const backgroundColorList = generateRandomColors(pieL.length);
      this.nobelObj.data = {
        labels: pieL,
        datasets: [
          {
            label: "My First Dataset",
            data: pieD,
            backgroundColor: backgroundColorList,
            hoverOffset: 8,
          },
        ],
      };
      this.init();
    },
    async getDataPop() {},
    init() {
      const ctx = document.getElementById("planet-chart");
      const ctx1 = document.getElementById("planet-chart1");
      const ctx2 = document.getElementById("planet-chart2");
      const ctx3 = document.getElementById("planet-chart3");
      new Chart(ctx, this.obj);
      new Chart(ctx1, this.popObj);
      new Chart(ctx2, this.nobelObj);
      const config = {
        type: "radar",
        data: this.scoreObj,
        options: {
          elements: {
            line: {
              borderWidth: 3,
            },
          },
        },
      };
      new Chart(ctx3, config);
    },
  },
  mounted() {
    this.getDataGdp();
    const ctx = document.getElementById("planet-chart");
    const ctx1 = document.getElementById("planet-chart1");
    const ctx2 = document.getElementById("planet-chart2");
    const ctx3 = document.getElementById("planet-chart3");
    window.addEventListener("beforeprint", () => {
      ctx.resize(600, 600);
      ctx1.resize(600, 600);
      ctx2.resize(600, 600);
      ctx3.resize(600, 600);
    });
    window.addEventListener("afterprint", () => {
      ctx.resize();
      ctx1.resize();
      ctx2.resize();
      ctx3.resize();
    });
  },
  //watchers
  watch: {},
  //computed
  computed: {},
  //global vars
  data: () => ({
    header: `header...`,
    body: `body...`,
    obj: {
      type: "line",
      data: {
        labels: [],
        datasets: [],
      },
      backgroundColor: [
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 205, 86)",
      ],
      options: {
        responsive: true,
        lineTension: 1,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                // padding: 25,
              },
            },
          ],
        },
      },
    },
    popObj: {
      type: "bar",
      data: {
        labels: [],
        datasets: [],
      },
    },
    nobelObj: {
      type: "doughnut",
      data: {
        datasets: [],
      },
    },
    scoreObj: {
      labels: ["English", "Math", "Sport", "Art", "Music"],
      datasets: [
        {
          label: " First Stu",
          data: [65, 59, 90, 81],
          fill: true,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgb(255, 99, 132)",
          pointBackgroundColor: "rgb(255, 99, 132)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgb(255, 99, 132)",
        },
        {
          label: " Second Stu",
          data: [68, 48, 40, 69, 96],
          fill: true,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgb(54, 162, 235)",
          pointBackgroundColor: "rgb(54, 162, 235)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgb(54, 162, 235)",
        },
        {
          label: " Three Stu",
          data: [78, 90, 62, 49, 76],
          fill: true,
          backgroundColor: "rgba(20, 217, 49, 0.2)",
          borderColor: "green",
          pointBackgroundColor: "green",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "green",
        },
      ],
    },
  }),
};
</script>
<style lang="" scoped>
/* * {
  background-color: rgb(20, 217, 49);
} */
</style>