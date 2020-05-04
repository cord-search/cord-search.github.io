let TITLES = {}
let CATS = new Set()

function update_tc(data) {
    TITLES = {}
    CATS.clear()
    data.map((datum, _) => {
        TITLES[datum.question] = datum.catagory
        CATS.add(datum.catagory)
    })
}

function update_tool_tip(text, hide, ms) {
    document.querySelector("#tool-tip > p").innerHTML = text
    if (hide) {
        if (ms){
            setTimeout(() => document.querySelector("#tool-tip").classList.add("hide"), ms)
        } else {
            document.querySelector("#tool-tip").classList.add("hide")
        }
    } else {
        if (ms) {
            setTimeout(() => document.querySelector("#tool-tip").classList.remove("hide"), ms)
        } else {
            document.querySelector("#tool-tip").classList.remove("hide")
        }
    }
}

function build_query(url, params) {
    return {
        method: "get",
        url: url,
        params: params,
    }
}

function select_idx(query) {
    const querystr = query.text.value
    switch (query.idx.value) {
        case "full-a":
            return build_query("http://localhost:8001/index/full", {
                key: "abstract",
                query: querystr,
            })
        case "full-b":
            return build_query("http://localhost:8001/index/full", {
                key: "body_text",
                query: querystr,
            })
        case "detail":
            return build_query("http://localhost:8001/index/detail", {
                query: querystr,
            })
        case "ft":
            return build_query("http://localhost:8001/index/ft", {
                query: querystr,
            })
        case "title":
            return build_query("http://localhost:8001/index/tp", {
                index: "cordf",
                key: "title",
                query: querystr,
            })
        case "paper_id":
            return build_query("http://localhost:8001/index/tp", {
                index: "cordf",
                key: "paper_id",
                query: querystr,
            })
    }
}

function filter_in() {
    const filter_text = document.querySelector("#filter_in > .ftext").value
    const filter_cluster = document.querySelector("#filter_in > .fcluster").value
    var i = 0
    Array.from(document.querySelectorAll("#query_container > div"))
        .map((q, _) => {
            if (q.textContent.includes(filter_text) && (filter_cluster == -1 || TITLES[q.querySelector("h2").textContent] == filter_cluster)) {
                q.classList.remove("hide")
                i++
            } else {
                q.classList.add("hide")
            }
        })

    summary = document.querySelector("#summary")
    summary.innerHTML = summary.innerHTML.replace(/Filtered: \d+/gi, "Filtered: " + i)

    new Hilitor("container", "#a7e9af", "FMARK").apply(filter_text, true)
}

function update_cluster_options(){
    const filter_cluster = document.querySelector(".fcluster") || document.createElement("select")
    filter_cluster.classList.add("fcluster")
    filter_cluster.classList.add("mselect")
    filter_cluster.innerHTML = ""

    const cluster_o0 = document.createElement("option")
    cluster_o0.value = -1
    cluster_o0.innerText = "Filter by category here"
    filter_cluster.appendChild(cluster_o0)
    Array.from(CATS).sort().map((c, _) => {
        const cluster_o = document.createElement("option")
        cluster_o.value = c
        cluster_o.innerText = "c-" + c
        filter_cluster.appendChild(cluster_o)
    })
    return filter_cluster
}

function search() {
    const res_pos = document.querySelector("#result")
    res_pos.innerHTML = ""

    const query = document.querySelector("#query")
    const querystr = query.text.value

    const filter_inside = document.createElement("section")
    filter_inside.id = "filter_in"

    const filter_text = document.createElement("input")
    filter_text.classList.add("input_search")
    filter_text.classList.add("ftext")
    filter_text.placeholder = "Filter by text here."
    filter_text.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            filter_in();
        }
    })

    const filter_cluster = update_cluster_options()
    filter_cluster.onchange = filter_in

    filter_inside.appendChild(filter_text)
    filter_inside.appendChild(filter_cluster)

    update_tool_tip("Searching: <span>" + querystr + "</span> <br /> Please wait.", false)
    //load_visualize()
    // Query
    axios(select_idx(query)).then(res => {
        console.log(res.data)

        res_pos.innerHTML = ""

        res_pos.appendChild(filter_inside)


        const summary =
            document.querySelector("#summary") ||
            document.createElement("section")
        summary.id = "summary"
        summary.classList.add("summary")
        summary.innerHTML =
            "Total: " +
            res.data.total +
            "<br />Filtered: " +
            res.data.docs.length

        res_pos.appendChild(summary)

        const container =
            document.querySelector("#query_container") ||
            document.createElement("div")
        container.id = "query_container"

        res.data.docs.map((doc, iv) => {
            const result = document.createElement("div")
            // Header
            const h = document.createElement("header")
            const h_h2 = document.createElement("h2")
            const h_sp = document.createElement("span")
            h_h2.innerHTML = doc.title
            h_sp.innerHTML = iv + 1
            h.appendChild(h_sp)
            h.appendChild(h_h2)
            result.appendChild(h)

            // Article box
            const article = document.createElement("article")
            const para = document.createElement("p")
            para.innerText = doc.text
            article.appendChild(para)

            result.appendChild(article)
            container.appendChild(result)
        })
        res_pos.appendChild(container)
        new Hilitor("container").apply(querystr)
        update_tool_tip("Searching: <br /><span>" + querystr + "</span> <br /> Done.  See the <a href='#result'>results</a>", true, 4000)
    })
}

window.onload = () => {
    !(() => {
        const query = document.querySelector("#query")
        const idxs = document.querySelectorAll("#query > section > section")
        Array.from(idxs).map(idx =>
            idx.addEventListener("click", _ => {
                query.idx.value = idx.querySelector("input").value
                search()
            })
        )
    })()
    query.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            search();
        }
    })
    window.addEventListener('keydown',
        function(e) {
            if (e.keyIdentifier == 'U+000A' || e.keyIdentifier == 'Enter' || e.keyCode == 13) {
                if (e.target.nodeName == 'INPUT' && e.target.type == 'text') {
                    e.preventDefault();
                    return false;
                }
            }
        },
        true);
    load_visualize()
}
