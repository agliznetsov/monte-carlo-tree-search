class BarChart {
    constructor(selector) {
        this.selector = selector;
        $(selector).mousemove(this.onMouseMove.bind(this));
        $(selector).mouseleave(this.onMouseLeave.bind(this));
    }

    onMouseMove(e) {
        if (this.aiResult && this.aiResult.moves.length) {
            let moves = this.aiResult.moves;
            let offset = $(this.selector).offset();
            let barWidth = $(this.selector).width() / moves.length;
            let x = Math.floor((e.pageX - offset.left) /barWidth);
            if (x < moves.length) {
                this.setSelection(moves[x].move);
            }
        }
    }

    onMouseLeave(e) {
        this.setSelection(undefined);
    }

    setSelection(selection) {
        this.selection = selection;
        this.refresh(this.aiResult);
        MessageBus.get().publish('move-selected', this.selection);
    }

    refresh(aiResult) {
        this.aiResult = aiResult;
        let moves = aiResult ? aiResult.moves : [];

        let container = d3.select(this.selector);

        let div = container.selectAll("div").data(moves, (d) => d.move);

        div.exit().remove();
        div.enter().append("div").attr('data-id', (d, i) => d.move);

        container.selectAll("div").data(moves, (d) => d.move).merge(div)
            .style("height", (d) => (d.value / aiResult.max * 100) + "%")
            .classed("selected", (d) => d.move === this.selection)
            .order()
    }
}