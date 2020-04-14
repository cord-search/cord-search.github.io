let visual_data;
let data_legend;
let mark = [];
const read_data = (question_data) => {
    visual_data = [];
    question_data.map((i) => {
        const d = [i.x, i.y, i.question, i.catagory];
        visual_data.push({value: d, symbolSize: 5});
    });
};

const load_visualize2 = (dataToRead) => {
    mark = [];
    let questionToSearch = document.getElementById("query").text.value;
    for (let i = 0; i < dataToRead.length; i++) {
        if (dataToRead[i].question === questionToSearch) {
            mark[0] = dataToRead[i].x;
            mark[1] = dataToRead[i].y;
            break;
        }
    }
    console.log(mark);

    const colors = data_legend.map(_ => '#'+Math.random().toString(16).substr(-6))

    let option = {
        title: {
            text: "Interactive Question Category Visualization",
            subtext: "",
            left: "center",
        },

        tooltip: {
            // trigger: 'axis',
            showDelay: 0,
            formatter: function(params) {
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
                dataZoom: {
                    title: {
                        zoom: "area zooming",
                        back: "restore area zooming"
                    }
                },
                brush: {
                    type: ["rect", "polygon", "clear"],
                    title: {
                        rect: "Rectangle selection",
                        polygon: "Polygon selection",
                        clear: "Clear selection"
                    }
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
        legend: {
            data: data_legend,
            top: "8%",
            right: "1%",
            orient: "vertical",
            type: "scroll",
        },

        color: colors,
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
                    color: (params) => {
                        return colors[parseInt(params.value[3])]
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
                name: data_legend[0],
                type: "scatter",
                symbol: "circle",
            },
            {
                name: data_legend[1],
                type: "scatter",
                symbol: "circle",
            },
            {
                name: data_legend[2],
                type: "scatter",
                symbol: "circle",
            },
            {
                name: data_legend[3],
                type: "scatter",
                symbol: "circle",
            },
            {
                name: data_legend[4],
                type: "scatter",
                symbol: "circle",
            },
            {
                name: data_legend[5],
                type: "scatter",
                symbol: "circle",
            },
            {
                name: data_legend[6],
                type: "scatter",
                symbol: "circle",
            },
            {
                name: data_legend[7],
                type: "scatter",
                symbol: "circle",
            },
            {
                name: data_legend[8],
                type: "scatter",
                symbol: "circle",
            },
            {
                name: data_legend[9],
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
    console.log(option)

    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
    myChart.on("click", function(params) {
        let chartData = params.value[2];
        document.getElementById("query").text.value = chartData;
        search();
    });
};

const add_kwds = (cats, kwds) => {
    const kwds_e = document.querySelector("#keywords")
    const kt = document.createElement("p")
    kt.innerText = "Keywords"
    kwds_e.appendChild(kt)
    kwds.map((kwd, idx) => {
        const p = document.createElement("p")
        p.innerText = cats[idx] + ": " + kwd
        kwds_e.appendChild(p)
    })
}

const load_visualize = () => {
    const dom = document.querySelector("#chart")
    dom.innerHTML = "<p>Loading</p>"
    loadProgressBar()
    axios
        .get("http://localhost:8001/model/",
            {
                params:
                {
                    n: document.querySelector("#cc").value,
                    model: document.querySelector("#mm").value
                }
            })
        .then(res => {
            data_legend = res.data.cats
            add_kwds(data_legend, res.data.kws)
            read_data(res.data.points)
            load_visualize2(res.data.points)
        }
        )
};
