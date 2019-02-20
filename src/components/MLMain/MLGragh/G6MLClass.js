import G6 from '@antv/g6'


export default class G6MLClass {
  constructor(graphId, height) {
    this.dragging = false;
    G6MLClass.registerNode();
    this.net = this.initNet(graphId, height);
    this.initEvent();
  }

  static getG6() {
    return G6;
  }


  static registerNode() {
    G6.registerNode('MLNode', {
      getAnchorPoints(cfg) {
        const model = cfg.model;
        // 将锚点与数据源关联
        return model.anchorPoints;
      }
    });
  }

  getNet() {
    return this.net;
  }

  initNet(netName, height) {
    return new G6.Net({
      id: netName,
      height: height,
    });
  }

  getGraphData() {
    return this.net.save();
  }

  loadGraphData(data) {
    this.net.read(data);
    this.net.render();
  }

  removeItem(item) {
    this.net.remove(item);
  }

  initEvent() {
    // dragstart event
    this.net.on('dragstart', (ev) => {
      this.dragging = true;
    });
    // dragend event
    this.net.on('dragend', (ev) => {
      this.dragging = false;
    });
    // enter anchor point event
    this.net.on('mouseenter', (ev) => {
      let shape = ev.shape;
      if (shape && shape.hasClass('anchor-point') && !this.dragging) {
        this.net.beginAdd('edge', {
          shape: "smoothArrow",
        });
      }
    });
    // leave anchor point event
    this.net.on('mouseleave', (ev) => {
      let shape = ev.shape;
      if (shape && shape.hasClass('anchor-point') && !this.dragging) {
        this.net.changeMode('edit');
      }
    });
    // show anchor point after render
    this.net.on('afteritemrender', (ev) => {
      let item = ev.item;
      if (item.get('type') === 'node') {
        this.net.showAnchor(item);
      }
    });
  }

  drawNode(e) {
    console.log(e)
    let canvasPos = this.net.invertPoint({x: e.offsetX, y: e.offsetY});
    let label = e.dataTransfer.getData("label");
    let desc = e.dataTransfer.getData("desc");
    let type = e.dataTransfer.getData("type");
    if(type.split('_')[0] === 'multiinput'){
      this.net.add('node', {
        shape: 'MLNode',
        label: label,
        type: type,
        desc: desc,
        status: 0,
        x: canvasPos.x,
        y: canvasPos.y,
        anchorPoints: [
          [0.25, 0],
          [0.75, 0],
          [0.5, 1]
        ]
      });
    }else{
      this.net.add('node', {
        shape: 'MLNode',
        label: label,
        type: type,
        desc: desc,
        status: 0,
        x: canvasPos.x,
        y: canvasPos.y,
        anchorPoints: [
          [0.5, 0],
          [0.5, 1]
        ]
      });
    }


    this.net.refresh();
  }

  setColor() {
    this.net.node().color(obj => {
      if (obj.status === 1) {
        return 'blue';
      } else if (obj.status === 2) {
        return 'green';
      } else if (obj.status === 3) {
        return 'red';
      }
    });
    this.net.refresh();
  }

  renderGraph(netData) {
    this.net.source(netData.nodes, netData.edges);
    this.setColor();
    this.net.render();
  }

  findData(id) {
    let data = this.net.find(id);
    return data ? data.getModel() : null
  }

  updateData(id, model) {
    this.net.update(id, model);
    this.net.refresh();
  }
}



