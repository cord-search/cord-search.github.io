function search() {
  const res_pos = document.querySelector("#result");
  res_pos.innerHTML = "";

  const query = document.querySelector("#query").value;
  load_visualize();
  // Query
  axios
    .get("http://localhost:8001/cord/", { params: { query: query } })
    .then((res) => {
      console.log(res.data);
      const res_data = res.data;

      const summary =
        document.querySelector("#summary") || document.createElement("section");
      summary.id = "summary";
      summary.classList.add("summary");
      var total = 0;
      if (typeof res_data.total == "number") {
        total = res_data.total;
      } else {
        total = "Greater than " + res_data.total.value;
      }
      summary.innerHTML =
        "Total: " + total + "<br />Filtered: " + res_data.results.length;

      res_pos.appendChild(summary);

      const container =
        document.querySelector("#query_container") ||
        document.createElement("div");
      container.id = "query_container";

      res.data.results.map((doc, iv) => {
        const result = document.createElement("div");
        // Header
        const h = document.createElement("header");
        const h_h2 = document.createElement("h2");
        h_h2.innerText = doc.title;
        h.appendChild(h_h2);
        result.appendChild(h);

        // Article box
        const article = document.createElement("article");
        const para = document.createElement("p");
        para.innerText = doc.content;
        article.appendChild(para);

        result.appendChild(article);
        container.appendChild(result);
      });
      res_pos.appendChild(container);
      new Hilitor("container").apply(query);
    });
}

window.onload = () => {
  load_visualize();
};
