class Planner {
  constructor() {
    this.blockList = {};
    this.c = {};
    this.ctx = {};
    this.mousedown = false;
    this.selected = false;
    this.translate = { x: 0, y: 0 };
    this.startPos = { x: 0, y: 0 };
  }

  setCSize() {
    this.c.width = window.innerWidth;
    this.c.height = window.innerHeight;
  }

  static packDefBlockList(obj) {
    let yp = 0;
    const quantity = 6;
    const step = 30;
    const shift = 40;
    for (let i = 1; i <= quantity; i++) {
      obj[Planner.uid(quantity - i)] = {
        width: step * i,
        height: step * i,
        level: quantity - i,
        type: "rect",
        bgcolor: this.getRandomColor(),
        x: 0,
        y: yp,
        selected: false,
        highlighted: false,
      };

      yp += step * i + shift;
    }

    return obj;
  }

  static uid(prefix = 0) {
    const date = new Date();
    return (
      `${prefix}-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getMinutes()}` +
      `${date.getSeconds()}-${date.getMilliseconds()}-${Math.round(
        Math.random() * 10000
      )}-${Math.round(Math.random() * 10000)}`
    );
  }

  static getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  drawOn(obj = this.blockListArr, ctx = this.ctx) {
    ctx.clearRect(0, 0, this.c.width, this.c.height);

    obj.forEach((elmArr) => {
      const elm = elmArr[1];

      if (elm.type == "rect") {
        ctx.beginPath();
        ctx.rect(elm.x, elm.y, elm.width, elm.height);
        ctx.lineWidth = 4;

        if (elm !== this.selected) {
          ctx.strokeStyle = "black";
        } else {
          ctx.strokeStyle = "blue";
        }

        if (elm.highlighted === true) {
          ctx.fillStyle = "red";
        } else {
          ctx.fillStyle = elm.bgcolor;
        }

        ctx.stroke();
        ctx.fill();
      }
    });
  }

  detectArr(x, y) {
    const detectedArr = [];
    Object.entries(this.blockList).forEach((elmArr) => {
      const elm = elmArr[1];
      if (x > elm.x && x < elm.x + elm.width) {
        if (y > elm.y && y < elm.y + elm.height) {
          detectedArr.push(elm);
        }
      }
    });

    if (detectedArr.length > 0) {
      detectedArr.sort((a, b) => b.level - a.level);

      return detectedArr;
    }
    return [];
  }

  detectBlockArr(block = this.selected, obj = this.selected) {
    const detectedArr = [];
    if (this.selected) {
      const blockCenterX = block.x + block.width / 2;
      const blockCenterY = block.y + block.height / 2;
      Object.entries(this.blockList).forEach((elmArr) => {
        const elm = elmArr[1];
        const elmCenterX = elm.x + elm.width / 2;
        const elmCenterY = elm.y + elm.height / 2;

        if (elm !== obj) {
          if (
            Math.abs(blockCenterX - elmCenterX) <
            (elm.width + block.width) / 2
          ) {
            if (
              Math.abs(blockCenterY - elmCenterY) <
              (elm.height + block.height) / 2
            ) {
              detectedArr.push(elm);
            }
          }
        }
      });
    }
    return detectedArr;
  }

  highlight(obj, arr) {
    Object.entries(obj).forEach((elmArr) => {
      elmArr[1].highlighted = false;
    });
    arr.forEach((elm) => {
      elm.highlighted = true;
    });
  }

  detectApproach(block = this.selected) {
    const buff = 30;
    if (this.selected) {
      const blockCenterX = block.x + block.width / 2;
      const blockCenterY = block.y + block.height / 2;
      const prevX = block.x;
      const prevY = block.y;
      const closest = {
        x: prevX,
        y: prevY,
        width: block.width,
        height: block.height,
      };
      Object.entries(this.blockList).forEach((elmArr) => {
        const elm = elmArr[1];
        const elmCenterX = elm.x + elm.width / 2;
        const elmCenterY = elm.y + elm.height / 2;

        if (elm !== block) {
          if (
            Math.abs(blockCenterX - elmCenterX) >
              (elm.width + block.width) / 2 &&
            Math.abs(blockCenterX - elmCenterX) <
              (elm.width + block.width) / 2 + buff
          ) {
            if (
              Math.abs(blockCenterY - elmCenterY) <
              (elm.height + block.height) / 2
            ) {
              if (blockCenterX - elmCenterX < 0) {
                closest.x = elm.x - block.width;
              } else {
                closest.x = elm.x + elm.width;
              }

              if (this.detectBlockArr(closest, block).length > 0) {
                closest.x = prevX;
              }
            }
          }

          if (
            Math.abs(blockCenterY - elmCenterY) >
              (elm.height + block.height) / 2 &&
            Math.abs(blockCenterY - elmCenterY) <
              (elm.height + block.height) / 2 + buff
          ) {
            if (
              Math.abs(blockCenterX - elmCenterX) <
              (elm.width + block.width) / 2
            ) {
              if (blockCenterY - elmCenterY < 0) {
                closest.y = elm.y - block.height;
              } else {
                closest.y = elm.y + elm.height;
              }

              if (this.detectBlockArr(closest, block).length > 0) {
                closest.y = prevY;
              }
            }
          }
        }

        if (block.x === elm.x - block.width || block.x === elm.x + elm.width) {
          closest.x = prevX;
        }

        if (
          block.y === elm.y - block.height ||
          block.y === elm.y + elm.height
        ) {
          closest.y = prevY;
        }
      });

      block.x = closest.x;
      block.y = closest.y;
    }
  }

  select(obj) {
    this.unselect();
    if (obj) {
      this.selected = obj;
    }
  }

  unselect(obj = this.blockList) {
    Object.entries(obj).forEach((elmArr) => {
      this.selected = false;
    });
  }

  moveSelected(x, y) {
    if (this.selected) {
      if (this.mousedown === true) {
        this.selected.x = x - this.translate.x;
        this.selected.y = y - this.translate.y;
      }
    }
  }

  init(id) {
    this.c = document.getElementById(id);
    this.ctx = this.c.getContext("2d");
    if (this.c) {
      this.setCSize();
    }
  }
}

const FirstPlanner = new Planner();

FirstPlanner.init("mainCanvas");
Planner.packDefBlockList(FirstPlanner.blockList);

FirstPlanner.blockList[Planner.uid(10)] = {
  width: 200,
  height: 50,
  level: 10,
  type: "rect",
  bgcolor: Planner.getRandomColor(),
  x: 100,
  y: 10,
  selected: false,
  highlighted: false,
};

FirstPlanner.blockList[Planner.uid(11)] = {
  width: 50,
  height: 200,
  level: 11,
  type: "rect",
  bgcolor: Planner.getRandomColor(),
  x: 120,
  y: 100,
  selected: false,
  highlighted: false,
};

FirstPlanner.blockListArr = Object.entries(FirstPlanner.blockList).sort();

FirstPlanner.drawOn();

window.addEventListener("resize", () => {
  FirstPlanner.setCSize();
  FirstPlanner.drawOn();
});

const canvas = document.getElementById("mainCanvas");

canvas.addEventListener("mousemove", (event) => {
  FirstPlanner.highlight(FirstPlanner.blockList, FirstPlanner.detectBlockArr());
  FirstPlanner.detectApproach();
  if (FirstPlanner.mousedown === false) {
    FirstPlanner.select(
      FirstPlanner.detectArr(event.clientX, event.clientY)[0]
    );
  }
  FirstPlanner.moveSelected(event.clientX, event.clientY);
  FirstPlanner.drawOn();
});

canvas.addEventListener("mousedown", (event) => {
  FirstPlanner.mousedown = true;
  FirstPlanner.translate = {
    x: event.clientX - FirstPlanner.selected.x,
    y: event.clientY - FirstPlanner.selected.y,
  };
  FirstPlanner.startPos = {
    x: FirstPlanner.selected.x,
    y: FirstPlanner.selected.y,
  };
});

canvas.addEventListener("mouseup", (event) => {
  var intersected = FirstPlanner.detectBlockArr();
  FirstPlanner.mousedown = false;
  if (intersected.length > 0) {
    FirstPlanner.selected.x = FirstPlanner.startPos.x;
    FirstPlanner.selected.y = FirstPlanner.startPos.y;
    FirstPlanner.drawOn();
  }
});
