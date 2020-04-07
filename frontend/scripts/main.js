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

function search() {
    const res_pos = document.querySelector("#result")
    res_pos.innerHTML = ""

    const query = document.querySelector("#query")
    const querystr = query.text.value

    //load_visualize()
    // Query
    axios(select_idx(query)).then(res => {
        console.log(res.data)

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
            })
        )
    })()
    load_visualize()
}
