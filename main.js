class Planner {
  constructor() {
    this.blockList = {};
    this.c = {};
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
    for (let i = 1; i < quantity; i++) {
      obj[Planner.uid(quantity - i)] = {
        width: step * i,
        height: step * i,
        level: quantity - i,
        type: "rect",
        bgcolor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        x: 0,
        y: yp,
        selected: false,
      };

      yp += step * i;
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

  drawOn(obj = this.blockList) {
    const ctx = this.c.getContext("2d");
    ctx.clearRect(0, 0, this.c.width, this.c.height);
    Object.entries(obj)
      .sort()
      .forEach((elmArr) => {
        const elm = elmArr[1];
        const id = elmArr[0];
        if (elm.type == "rect") {
          if (elm.selected !== true) {
            ctx.beginPath();
            ctx.rect(elm.x, elm.y, elm.width, elm.height);
            ctx.lineWidth = 4;
            ctx.strokeStyle = "black";
            ctx.fillStyle = elm.bgcolor;
            ctx.fill();
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.rect(elm.x, elm.y, elm.width, elm.height);
            ctx.lineWidth = 4;
            ctx.strokeStyle = "blue";
            ctx.fillStyle = elm.bgcolor;
            ctx.fill();
            ctx.stroke();
          }
        }
      });
  }

  detectArr(x, y) {
    const detectedArr = [];
    Object.entries(this.blockList).forEach((elmArr) => {
      const elm = elmArr[1];
      const id = elmArr[0];
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

  detectBlock(x, y) {}

  select(obj) {
    this.unselect();
    if (obj) {
      obj.selected = true;
      this.selected = obj;
    }
  }

  unselect(obj = this.blockList) {
    Object.entries(obj).forEach((elmArr) => {
      const elm = elmArr[1];
      const id = elmArr[0];
      elm.selected = false;
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
    if (this.c) {
      this.setCSize();
      Planner.packDefBlockList(this.blockList);
      this.drawOn();
    }
  }
}

const FirstPlanner = new Planner();

FirstPlanner.init("mainCanvas");

window.addEventListener("resize", () => {
  FirstPlanner.setCSize();
  FirstPlanner.drawOn();
});

var canvas = document.getElementById("mainCanvas");

canvas.addEventListener("mousemove", (event) => {
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
  FirstPlanner.mousedown = false;
  if (FirstPlanner.detectArr(event.clientX, event.clientY).length > 1) {
    FirstPlanner.selected.x = FirstPlanner.startPos.x;
    FirstPlanner.selected.y = FirstPlanner.startPos.y;
    FirstPlanner.drawOn();
  }
});
