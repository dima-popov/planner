class Planner {
  constructor() {
    this.blockList = {};
    this.c = {};
  }

  setCSize() {
    this.c.width = window.innerWidth;
    this.c.height = window.innerHeight;
  }

  static packDefBlockList(obj) {
    let yp = 0;
    const step = 30;
    for (let i = 1; i < 6; i++) {
      obj[Planner.uid(i)] = {
        width: step * i,
        height: step * i,
        level: i,
        type: 'rect',
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
      `${prefix}-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getMinutes()}`
      + `${date.getSeconds()}-${date.getMilliseconds()}-${Math.round(
        Math.random() * 10000,
      )}-${Math.round(Math.random() * 10000)}`
    );
  }

  drawOn(obj = this.blockList) {
    Object.entries(obj).forEach((elmArr) => {
      const elm = elmArr[1];
      const id = elmArr[0];
      if (elm.type == 'rect') {
        const ctx = this.c.getContext('2d');
        if (elm.selected !== true) {
          ctx.beginPath();
          ctx.rect(0, elm.y, elm.width, elm.height);
          ctx.lineWidth = 4;
          ctx.strokeStyle = 'black';
          ctx.fillStyle = elm.bgcolor;
          ctx.fill();
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.rect(0, elm.y, elm.width, elm.height);
          ctx.lineWidth = 4;
          ctx.strokeStyle = 'blue';
          ctx.fillStyle = elm.bgcolor;
          ctx.fill();
          ctx.stroke();
        }
      }
    });
  }

  detect(x, y) {
    const detectedArr = [];
    Object.entries(this.blockList).forEach((elmArr) => {
      const elm = elmArr[1];
      const id = elmArr[0];
      if (
        x > elm.x
        && x < elm.x + elm.width
      ) {
        if (
          y > elm.y
          && y < elm.y + elm.height
        ) {
          detectedArr.push(elm);
        }
      }
    });

    if (detectedArr.length > 0) {
      detectedArr.sort((a, b) => b.level - a.level);

      return detectedArr[0];
    }
    return false;
  }

  select(obj) {
    this.unselect();
    if (obj) {
      obj.selected = true;
    }
  }

  unselect(obj = this.blockList) {
    Object.entries(obj).forEach((elmArr) => {
      const elm = elmArr[1];
      const id = elmArr[0];
      elm.selected = false;
    });
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

FirstPlanner.init('mainCanvas');

window.addEventListener('resize', () => {
  FirstPlanner.setCSize();
  FirstPlanner.drawOn();
});

document.addEventListener('mousemove', (event) => {
  FirstPlanner.select(FirstPlanner.detect(event.clientX, event.clientY));
  FirstPlanner.drawOn();
});
