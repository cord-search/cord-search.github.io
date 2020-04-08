let visual_data;
let mark = [];
const read_data = (question_data) => {
  visual_data = [];
  question_data.map((i) => {
    const d = [i.x, i.y, i.question, i.catagory];
    visual_data.push(d);
  });
};

const load_visualize2 = (dataToRead) => {
  mark = [];
  let questionToSearch = document.getElementById("query").value;
  for (let i = 0; i < dataToRead.length; i++) {
    if (dataToRead[i].question === questionToSearch) {
      mark[0] = dataToRead[i].x;
      mark[1] = dataToRead[i].y;
      break;
    }
  }
  console.log(mark);

  let option = {
    title: {
      text: "Interactive Question Category Visualization",
      subtext: "",
      left: "center",
    },

    tooltip: {
      // trigger: 'axis',
      showDelay: 0,
      formatter: function (params) {
        return (
          '<div class="tool_div">' +
          params.value[2] +
          "<br/>" +
          "catagory: " +
          params.value[3] +
          "</div>"
        );
      },

      axisPointer: {
        show: true,
        type: "cross",
        lineStyle: {
          type: "dashed",
          width: 1,
        },
      },
    },
    toolbox: {
      itemSize: 20,
      iconStyle: {
        color: "",
        borderColor: "grey",
        borderWidth: 3,
      },
      feature: {
        dataZoom: {},
        brush: {
          type: ["rect", "polygon", "clear"],
        },
      },
    },
    brush: {},
    dataZoom: [
      {
        type: "inside",
        xAxisIndex: 0,
        start: 0,
        end: 100,
      },

      {
        type: "inside",
        yAxisIndex: 0,
        start: 0,
        end: 100,
      },
    ],
    color: [
      "black",
      "#F75000",
      "green",
      "blue",
      "orange",
      "grey",
      "#AE0000",
      "#336666",
      "purple",
      "fuchsia",
      "#A5A552",
    ],
    legend: {
      data: [
        "French literature?",
        "Mask;AIR",
        "Virus comparation",
        "Sequences analysis",
        "Diseases transmission",
        "Public health",
        "Cells experiments",
        "Genome study",
        "Influenza",
        "Treatment",
      ],
      top: "8%",
      right: "1%",
      orient: "vertical",
      type: "scroll",
    },

    xAxis: [
      {
        type: "value",
        scale: true,
        axisLabel: {
          formatter: "{value}",
        },
        splitLine: {
          show: false,
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        scale: true,
        axisLabel: {
          formatter: "{value}",
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: "COVID Data category",
        type: "scatter",
        data: visual_data,
        symbol: "circle",
        itemStyle: {
          color: function (params) {
            let color;
            switch (params.value[3]) {
              case 0:
                color = "#F75000";
                break;
              case 1:
                color = "green";
                break;
              case 2:
                color = "blue";
                break;
              case 3:
                color = "orange";
                break;
              case 4:
                color = "grey";
                break;
              case 5:
                color = "#AE0000";
                break;
              case 6:
                color = "#336666";
                break;
              case 7:
                color = "purple";
                break;
              case 8:
                color = "fuchsia";
                break;
              case 9:
                color = "#A5A552";
                break;
            }
            return color;
          },
        },
        markPoint: {
          data: [
            {
              name: "",
              coord: mark,
            },
          ],
          symbol:
            "path://M943.969337 550.590738a433.710505 433.710505 0 0 1-392.207259 392.555493v80.663823h-78.827675v-80.790453a433.710505 433.710505 0 0 1-392.207259-392.555494h-80.727138v-78.764361h80.822111a433.900451 433.900451 0 0 1 392.112286-390.972608v-80.727138h78.827675v80.727138a433.963767 433.963767 0 0 1 392.143944 390.972608h80.727138v78.764361h-80.663823z m-79.492487-78.764361a354.946145 354.946145 0 0 0-312.714772-311.891671v76.453348h-78.827675V159.934706a354.946145 354.946145 0 0 0-312.714772 311.891671h76.231744v78.764361H159.998027a354.914487 354.914487 0 0 0 312.936376 313.411241v-76.390033h78.827675v76.390033a354.977803 354.977803 0 0 0 312.968034-313.411241h-76.548322v-78.764361h76.29506z m-352.160267 157.497063a118.114883 118.114883 0 1 1 118.209856-118.114883 118.209856 118.209856 0 0 1-118.209856 118.114883z",
          itemStyle: {
            color: "#000000",
          },
          symbolSize: 30,
        },
      },
      {
        name: "French literature?",
        type: "scatter",
        symbol: "circle",
      },
      {
        name: "Mask;AIR",
        type: "scatter",
        symbol: "circle",
      },
      {
        name: "Virus comparation",
        type: "scatter",
        symbol: "circle",
      },
      {
        name: "Sequences analysis",
        type: "scatter",
        symbol: "circle",
      },
      {
        name: "Diseases transmission",
        type: "scatter",
        symbol: "circle",
      },
      {
        name: "Public health",
        type: "scatter",
        symbol: "circle",
      },
      {
        name: "Cells experiments",
        type: "scatter",
        symbol: "circle",
      },
      {
        name: "Genome study",
        type: "scatter",
        symbol: "circle",
      },
      {
        name: "Influenza",
        type: "scatter",
        symbol: "circle",
      },
      {
        name: "Treatment",
        type: "scatter",
        symbol: "circle",
      },
    ],
  };

  const dom = document.getElementById("chart");
  const domParent = dom.parentNode;
  domParent.removeChild(dom);
  const newChart = document.createElement("div");
  domParent.appendChild(newChart);
  newChart.id = "chart";
  const myChart = echarts.init(newChart);

  if (option && typeof option === "object") {
    myChart.setOption(option, true);
  }
  myChart.on("click", function (params) {
    let chartData = params.value[2];
    document.getElementById("query").value = chartData;
    search();
  });
};

const load_visualize = () => {
  if (document.getElementById("Domain").value === "tfidf") {
    loadProgressBar();
    axios
      .get("http://45.19.182.21:8003/models/covid_tfidf_data.json")
      .then((res) => {
        const tfidf = res.data;
        read_data(tfidf);
        load_visualize2(tfidf);
      });
  } else if (document.getElementById("Domain").value === "bow") {
    loadProgressBar();
    axios
      .get("http://45.19.182.21:8003/models/covid_bow_data.json")
      .then((res) => {
        const bow = res.data;
        read_data(bow);
        load_visualize2(bow);
      });
  }
};
