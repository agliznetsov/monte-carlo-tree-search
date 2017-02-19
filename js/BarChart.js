class BarChart {
    constructor(container) {
        let data = [];
        for (let i = 0; i < 10; i++) {
            data.push(Math.random());
        }

        data = _.sortBy(data);

        // var x = d3.scaleLinear()
        //     .domain([0, d3.max(data)])
        //     .range([0, 420]);

        let div = container.selectAll("div").data(data)
            .enter().append("div").attr('data-id', (d, i) => i)
            .exit().remove();

        container.selectAll("div").data(data).merge(div)
            //.transition()
            .style("height", (data) => (data * 100) + "%");

        // let div = container.selectAll("div").data(data);
        // div.exit().remove();
        // let append = div.enter().append("div");
        // this.drawBar(append);
        // let merge = append.merge(div);
        // this.drawBar(merge.transition());
    }
}