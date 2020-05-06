let visual_data
let data_legend
let mark = []
let colors = []
const read_data = question_data => {
    visual_data = []
    question_data.map(i => {
        const d = [i.x, i.y, i.question, i.catagory]
        visual_data.push({ value: d, symbolSize: 5 })
    })
}

const load_visualize2 = dataToRead => {
    mark = []
    let questionToSearch = document.getElementById("query").text.value
    for (let i = 0; i < dataToRead.length; i++) {
        if (dataToRead[i].question === questionToSearch) {
            mark[0] = dataToRead[i].x
            mark[1] = dataToRead[i].y
            break
        }
    }
    console.log(mark)

    let option = {
        title: {
            text: "",
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
                )
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
            itemSize: 14,
            iconStyle: {
                color: "",
                borderColor: "#333",
                borderWidth: 1,
            },
            feature: {
                restore: {title: "restore"},
                dataZoom: {
                    title: {
                        zoom: "area zooming",
                        back: "restore area zooming",
                    },
                },
                brush: {
                    type: ["rect", "polygon", "clear"],
                    title: {
                        rect: "rectangle selection",
                        polygon: "polygon selection",
                        clear: "clear selection",
                    },
                },
                saveAsImage: {title : "save as image"},
            },
        },
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
            selectedMode: false,
            top: "8%",
            right: "1%",
            orient: "vertical",
            type: "scroll",
        },

        color: colors,
        xAxis: [
            {
                type: "value",
                show: false,
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
                show: false,
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
                    color: params => {
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
        ],
    }
    data_legend.map(legend =>
        option.series.push({
            name: legend,
            type: "scatter",
            symbol: "circle",
        })
    )

    const dom = document.getElementById("chart")
    const domParent = dom.parentNode
    domParent.removeChild(dom)
    const newChart = document.createElement("div")
    domParent.appendChild(newChart)
    newChart.id = "chart"
    const myChart = echarts.init(newChart)
    console.log(option)

    if (option && typeof option === "object") {
        myChart.setOption(option, true)
    }
    myChart.on("click", function(params) {
        let chartData = params.value[2]
        document.getElementById("query").text.value = chartData
        search(chartData)
    })
}

const add_kwds = (cats, kwds) => {
    const kwds_e = document.querySelector("#keywords")
    kwds_e.innerHTML = ""
    const kt = document.createElement("p")
    kt.innerText = "Keywords order by frequency"
    kwds_e.appendChild(kt)
    kwds.map((kwd, idx) => {
        const p = document.createElement("p")
        p.innerHTML = (
            "<span style=\"background-color:"
            + (idx == colors.length - 1 ? colors[0] : colors[idx + 1])
            + ";padding: 0 10px;border-radius:5px;margin-right:5px\"></span>"
            + cats[idx]
            + ": "
            + kwd
        )
        kwds_e.appendChild(p)
    })
}

const load_visualize = () => {
    const dom = document.querySelector("#chart")
    const kwds_e = document.querySelector("#keywords")
    dom.innerHTML = "<p>Loading</p>"
    kwds_e.innerHTML = ""
    loadProgressBar()
    update_tool_tip("Loading...", false)
    axios
        .get("http://localhost:8001/api/model", {
            params: {
                n: document.querySelector("#cc").value,
                model: document.querySelector("#mm").value,
            },
        })
        .then(res => {
            data_legend = res.data.cats
            colors = data_legend.map(
                _ => "#" + Math.random().toString(16).substr(-6)
            )
            read_data(res.data.points)
            load_visualize2(res.data.points)
            add_kwds(data_legend, res.data.kws)
            update_tc(res.data.points)
            update_cluster_options()
            update_tool_tip("Done!", true, 2000)
        })
}
