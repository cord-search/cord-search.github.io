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
    const filter_inside = document.querySelector("#filter_in").value
    var i = 0
    Array.from(document.querySelectorAll("#query_container > div"))
        .map((q, _) => {
            if (q.textContent.includes(filter_inside)) {
                q.classList.remove("hide")
                i++
            } else {
                q.classList.add("hide")
            }
        })
    summary =  document.querySelector("#summary")
    summary.innerHTML = summary.innerHTML.replace(/Filtered: \d+/gi, "Filtered: " + i)
    new Hilitor("container", "#a7e9af", "FMARK").apply(filter_inside, true)
}

function search() {
    const res_pos = document.querySelector("#result")
    res_pos.innerHTML = ""

    const query = document.querySelector("#query")
    const querystr = query.text.value

    const filter_inside = document.createElement("input")
    filter_inside.id = "filter_in"
    filter_inside.classList.add("input_search")
    filter_inside.placeholder = "Enter text here to filter them."
    filter_inside.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            filter_in();
        }
    })

    //load_visualize()
    // Query
    axios(select_idx(query)).then(res => {
        console.log(res.data)

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
            h_h2.innerText = doc.title
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
