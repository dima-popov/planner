class Planner {
  constructor() {
    this.blockList = {};
    this.c;
  }

  setCSize() {
    this.c.width = window.innerWidth;
    this.c.height = window.innerHeight;
  }

  packDefBlockList(obj) {
    var yp = 0;
    var step = 30;
    for (let i = 1; i < 6; i++) {
      obj[Planner.uid(i)] = {
        width: step * i,
        height: step * i,
        level: i,
        type: "rect",
        bgcolor: "#" + Math.floor(Math.random() * 16777215).toString(16),
        x: 0,
        y: yp,
        selected: false,
      };

      yp += step * i;
    }

    return obj;
  }

  static uid(prefix = 0) {
    var date = new Date();
    return (
      `${prefix}-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getMinutes()}` +
      `${date.getSeconds()}-${date.getMilliseconds()}-${Math.round(
        Math.random() * 10000
      )}-${Math.round(Math.random() * 10000)}`
    );
  }

  drawOn(obj = this.blockList) {
    for (const prop in obj) {
      if (obj[prop].type == "rect") {
        var ctx = this.c.getContext("2d");
        if (obj[prop].selected !== true) {
           
        ctx.beginPath();
        ctx.rect(0, obj[prop].y, obj[prop].width, obj[prop].height);
        ctx.lineWidth = 4;
        ctx.strokeStyle = "black";
        ctx.fillStyle = obj[prop].bgcolor;
        ctx.fill();
        ctx.stroke();
      
        }else{
            
        ctx.beginPath();
        ctx.rect(0, obj[prop].y, obj[prop].width, obj[prop].height);
        ctx.lineWidth = 4;
        ctx.strokeStyle = "blue";
        ctx.fillStyle = obj[prop].bgcolor;
        ctx.fill();
        ctx.stroke();
        }
      }
    }
  
  }

  detect(x, y) {
    var detectedArr = [];

    for (const prop in this.blockList) {
      if (
        x > this.blockList[prop].x &&
        x < this.blockList[prop].x + this.blockList[prop].width
      ) {
        if (
          y > this.blockList[prop].y &&
          y < this.blockList[prop].y + this.blockList[prop].height
        ) {
          detectedArr.push(this.blockList[prop]);
        }
      }
    }

    if (detectedArr.length > 0) {
      detectedArr.sort(function (a, b) {
        return b.level - a.level;
      });

      return detectedArr[0];
    } else {
      return false;
    }
  }

  select(obj) {
    this.unselect();
    if (obj) {
      obj.selected = true;
    }
  }

  unselect(obj = this.blockList) {
    for (const prop in obj) {
      obj[prop].selected = false;
    }
  }

  init(id) {
    this.c = document.getElementById(id);

    if (this.c) {
      this.setCSize();
      this.packDefBlockList(this.blockList);
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

document.addEventListener("mousemove", function (event) {
  FirstPlanner.select(FirstPlanner.detect(event.clientX, event.clientY));
  FirstPlanner.drawOn();
});
