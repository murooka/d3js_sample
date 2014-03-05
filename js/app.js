var Node = function (x, y) {
  this.x = x;
  this.y = y;
  this.inEdges = [];
  this.outEdges = [];
};

var Edge = function (from, to) {
  this.from = from;
  this.to = to;
};

var Graph = function () {
  this.nodes = [];
  this.edges = [];
};

Graph.prototype.addNode = function (x, y) {
  var n = new Node(x, y);
  this.nodes.push(n);
};

Graph.prototype.addEdge = function (from, to) {
  var e = new Edge(from, to);
  this.edges.push(e);
  this.nodes[from].outEdges.push(e);
  this.nodes[to].inEdges.push(e);
};

(function () {
  var graph = (function () {
    var nodes = [
      { x:  50, y: 300 },
      { x: 150, y: 250 },
      { x: 150, y: 350 },
      { x: 250, y: 200 },
      { x: 250, y: 300 },
      { x: 250, y: 400 }
    ];

    var edges = [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 3 },
      { from: 1, to: 4 }
    ];

    var g = new Graph();

    _(nodes).each(function (n) { g.addNode(n.x, n.y) });
    _(edges).each(function (e) { g.addEdge(e.from, e.to) });

    return g;
  })();

  var hypot = function (a, b) {
    return Math.sqrt(a * a + b * b);
  };

  var port = function (p1, p2, dist) {
    var x1 = p1.x;
    var y1 = p1.y;
    var x2 = p2.x;
    var y2 = p2.y;
    var dx = x1 - x2;
    var dy = y1 - y2;
    var d = hypot(dx, dy);
    return { x: x1 - dx * dist / d, y: y1 - dy * dist / d };
  };

  d3.select("body").append("div").html("Hello, world!");

  // 0 10 18 22 30 40

  d3.select("body").append("div")
    .append("svg")
    .attr("width", 40)
    .attr("height", 40)
    .append("polygon")
    .attr("points", "18,10 22,10 22,18 30,18 30,22 22,22 22,30 18,30 18,22 10,22 10,18 18,18")
    .attr("fill", "#2e1")
    .on("click", function () {
      graph.addNode(100, 100);
      render();
    });

  var svg = d3.select("body")
    .append("svg")
    .attr("width", 800)
    .attr("height", 600);

  svg.append("defs").append("marker")
    .attr("id", "arrow-head")
    .attr("viewBox", "0 0 10 10")
    .attr("refX", 9)
    .attr("refY", 5)
    .attr("markerWidth", "10")
    .attr("markerHeight", "10")
    .attr("orient", "auto")
  .append("polygon")
    .attr("points", "0,0 10,5 0,10")
    .attr("fill", "black");

  var dragNode = d3.behavior.drag()
    .on("dragstart", function (d, i) {
      d3.select(this).style("fill", "aliceblue");
    })
    .on("drag", function (d, i) {
      d.x += d3.event.dx;
      d.y += d3.event.dy;
      d3.select(this)
        .attr("cx", d.x)
        .attr("cy", d.y);

      _(d.inEdges).each(function (edge) {
        d3.select(edge.dom)
          .attr("x2", d.x)
          .attr("y2", d.y);
      });
      _(d.outEdges).each(function (edge) {
        d3.select(edge.dom)
          .attr("x1", d.x)
          .attr("y1", d.y);
      });
    })
    .on("dragend", function (d, i) {
      d3.select(this).style("fill", "white");
    });

  var render = function () {

    svg.selectAll("circle")
      .data(graph.nodes)
    .enter()
      .append("circle")
      .each(function (d) { d.dom = this; })
      .style("stroke", "gray")
      .style("fill", "white")
      .attr("r", 20)
      .attr("cx", function (d) { return d.x; })
      .attr("cy", function (d) { return d.y; })
      .call(dragNode);

    svg.selectAll("line")
      .data(graph.edges)
    .enter()
      .append("line")
      .each(function (d) { d.dom = this; })
      .style("stroke", "black")
      .attr("x1", function (d) { return graph.nodes[d.from].x; })
      .attr("y1", function (d) { return graph.nodes[d.from].y; })
      .attr("x2", function (d) { return graph.nodes[d.to].x; })
      .attr("y2", function (d) { return graph.nodes[d.to].y; })
      .attr("marker-end", "url(#arrow-head)");

  };

  render();

})();
