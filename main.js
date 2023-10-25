const div1 = document.getElementById("out_div");
const clearbtn1 = document.getElementById("clearbtn");
const result1 = document.getElementById("mouseover-result");

div1.addEventListener("mouseover", (event) => {
  result1.insertAdjacentHTML(
    "beforeend",
    `<div>mouseover from ${event.target.id}</div>`
  );
});

div1.addEventListener("mouseout", (event) => {
  result1.insertAdjacentHTML(
    "beforeend",
    `<div>mouseout from ${event.target.id}</div>`
  );
});

clearbtn1.addEventListener("click", (event) => {
  result1.innerHTML = "";
});

const div2 = document.getElementById("non-bubble-out_div");
const clearbtn2 = document.getElementById("non-bubble-clearbtn");
const result2 = document.getElementById("mouseenter-result");

div2.addEventListener("mouseenter", (event) => {
  result2.insertAdjacentHTML(
    "beforeend",
    `<div>mouseenter from ${event.target.id}</div>`
  );
});

div2.addEventListener("mouseleave", (event) => {
  result2.insertAdjacentHTML(
    "beforeend",
    `<div>mouseleave from ${event.target.id}</div>`
  );
});

clearbtn2.addEventListener("click", (event) => {
  result2.innerHTML = "";
});

function templateFunc(event, name) {
  const div1 = document.getElementById(`${name}-ancestor-div`);
  const div2 = document.getElementById(`${name}-parent-div`);
  const div3 = document.querySelector(`.${name}-child-div`);
  const div4 = document.getElementById(`${name}-result`);
  const div5 = document.getElementById(`${name}-clearbtn`);

  div1.addEventListener(
    event,
    function () {
      div4.insertAdjacentHTML("beforeend", `<div>ancestor-div</div>`);
    },
    name === "capturing" ? true : false
  );

  div2.addEventListener(
    event,
    function () {
      div4.insertAdjacentHTML("beforeend", `<div>parent-div</div>`);
    },
    name === "capturing" ? true : false
  );

  div3.addEventListener(
    event,
    function () {
      div4.insertAdjacentHTML("beforeend", `<div>child-div</div>`);
    },
    name === "capturing" ? true : false
  );

  div5.addEventListener("click", () => {
    div4.innerHTML = "";
  });
}

templateFunc("mousedown", "capturing");
templateFunc("dblclick", "bubbling");

function templateInputFunc(event, className, name) {
  const inputElement = document.querySelector(className);
  const div4 = document.getElementById(`${name}-result`);
  const div5 = document.getElementById(`${name}-clearbtn`);

  inputElement.addEventListener(event, function (e) {
    div4.insertAdjacentHTML("beforeend", `<div>key : ${e.key}</div>`);
  });

  div5.addEventListener("click", () => {
    div4.innerHTML = "";
  });
}

templateInputFunc("keyup", "#keyupInput", "keyUp");
templateInputFunc("keydown", "#keyDownInput", "keyDown");

function templateInputFuncForFocus(event, className, name, msgTag) {
  const inputElement = document.querySelector(className);
  const div4 = document.getElementById(`${name}-result`);
  const div5 = document.getElementById(`${name}-clearbtn`);

  inputElement.addEventListener(event, function (e) {
    if (event === "blur" || event === "focusout") {
      const regex =
        /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

      if (!regex.test(inputElement.value)) {
        inputElement.classList.add("invalid");
        const spanElement = document.querySelector(msgTag);
        spanElement.textContent = "이메일 형식으로 작성해주세요";
      }
    } else if (event === "focus" || event === "focusin") {
      if (inputElement.classList.contains("invalid")) {
        inputElement.classList.remove("invalid");
        const spanElement = document.querySelector(msgTag);
        spanElement.textContent = "";
      }
    } else if (event === "input" || event === "change") {
      div4.insertAdjacentHTML("beforeend", `<div>${e.target.value}</div>`);
      return;
    }
    div4.insertAdjacentHTML("beforeend", `<div>${event}</div>`);
  });

  div5.addEventListener("click", () => {
    div4.innerHTML = "";
  });
}
templateInputFuncForFocus("focus", "#focusInput", "focus", "#validation-msg");
templateInputFuncForFocus("blur", "#focusInput", "focus", "#validation-msg");

templateInputFuncForFocus(
  "focusin",
  "#focusinInput",
  "focusin",
  "#focusin-validation-msg"
);
templateInputFuncForFocus(
  "focusout",
  "#focusinInput",
  "focusin",
  "#focusin-validation-msg"
);

templateInputFuncForFocus(
  "input",
  "#inputInput",
  "input",
  "#input-validation-msg"
);

templateInputFuncForFocus(
  "change",
  "#changeInput",
  "change",
  "#change-validation-msg"
);

let bugDirection = {
  top: 0,
  left: 140,
};
let movingSpeed = 30;

window.addEventListener("wheel", function () {
  document.body.style.overflow = "auto";
});
// canvas logic start

// canvas에 그림을 그리려면 먼저 context를 가져와야 함
// context에 대한 참조는 getContext() 메서드에 context 이름을 넘김
// 좌표는 canvas 요소 왼쪽 위에서 시작하며, 이 지점을 (0, 0)으로 간주
// x는 오른쪽, y는 아래쪽으로 픽셀 단위로 증가
let canvas = document.getElementById("game-canvas");
let ctx = canvas.getContext("2d");

// canvas 가로 및 세로의 반값 > 150
let x = canvas.width / 2;
let y = canvas.height / 2;

// 움직일 도형의 크기
let rectWidth = 10;
let rectHeight = 10;

// 움직일 도형의 시작점 정의 > 145 (중앙위치)
let rectX = 0;
let rectY = 0;

// 초기화, true로 되면 해당 방향으로 이동
// 이벤트 객체의 keyCode 속성에서 눌려진 키의 코드를 얻을 수 있고, 어떤 키인지 확인한 다음 적절한 변수 설정
let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

let movingInterval = 5;
// 먼저 눌린 키를 수신할 이벤트 리스너 필요

// 키보드가 눌렸을 때 일어나는 함수 (매개변수: e)
// 각 방향키의 keycode와 방향이 맞다면, 해당 변수들 true
const keyDownHandler = function (e) {
  document.body.style.overflow = "hidden";
  if (e.key == "Shift") {
    movingInterval = 15;
  }
  if (e.key == 37 || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == 39 || e.key == "ArrowLeft") {
    leftPressed = true;
  } else if (e.key == 38 || e.key == "ArrowUp") {
    upPressed = true;
  } else if (e.key == 40 || e.key == "ArrowDown") {
    downPressed = true;
  }
};

// 키보드가 안 눌렸을 때 일어나는 함수 (매개변수: e)
// 각 방향키의 keycode와 방향이 맞다면, 해당 변수들 false > 초기화
const keyUpHandler = function (e) {
  if (e.key == "Shift") {
    movingInterval = 5;
  }
  if (e.key == 37 || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == 39 || e.key == "ArrowLeft") {
    leftPressed = false;
  } else if (e.key == 38 || e.key == "ArrowUp") {
    upPressed = false;
  } else if (e.key == 40 || e.key == "ArrowDown") {
    downPressed = false;
  }
  window.cancelAnimationFrame(draw);
};

// 움직일 도형을 그리는 함수
function drawRect() {
  ctx.beginPath();
  ctx.rect(rectX, rectY, rectWidth, rectHeight); //--2번째의 Y좌표가 지정이 안 되어 있어서, 위아래 이동이 안됐었음
  ctx.strokeStyle = "red";
  ctx.fillStyle = "red";
  ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
  // 채우기는 도형의 내부를 color나 gradient, img로 채움
  // stroke는 외곽선에 색을 칠함
  ctx.stroke();
  ctx.closePath();
}

// 먼저 전체 Canvas를 지움 > 모든 단일 프레임에 처음부터 모든 것을 그림 > 눌려진 키 변수 확인
// 사각형을 그릴 때는 fillRect(), strokeRect(), clearRect()의 메서드 사용
// 모두 매개변수로 사각형의 x/y좌표, 너비/높이 4가지를 받음 (픽셀단위)
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawRect();

  if (rightPressed && rectX < canvas.width - rectWidth) {
    rectX += movingInterval;
  } else if (leftPressed && rectX > 0) {
    rectX -= movingInterval;
  } else if (downPressed && rectY < canvas.height - rectHeight) {
    rectY += movingInterval;
  } else if (upPressed && rectY > 0) {
    rectY -= movingInterval;
  }

  window.requestAnimationFrame(draw);
}

// setInterval > 캔버스 내의 움직이는 오브젝트가 있을 때 사용하는 내장함수
window.requestAnimationFrame(draw);

// canvas logic end

const keyUpHandler2 = function (e) {
  const key = e.key;
  if (key === "Shift") {
    movingSpeed = 30;
  }
};

const keyDownHandler2 = function (e) {
  const key = e.key;
  const bug = document.querySelector("#game-bug");
  document.body.style.overflow = "hidden";

  switch (key) {
    case "ArrowRight":
      bug.style.left = `${bugDirection.left + movingSpeed}px`;
      bugDirection.left += movingSpeed;
      break;
    case "ArrowLeft":
      bug.style.left = `${bugDirection.left - movingSpeed}px`;
      bugDirection.left -= movingSpeed;
      break;
    case "ArrowUp":
      bug.style.top = `${bugDirection.top - movingSpeed}px`;
      bugDirection.top -= movingSpeed;
      break;
    case "ArrowDown":
      bug.style.top = `${bugDirection.top + movingSpeed}px`;
      bugDirection.top += movingSpeed;
      break;
    case "Shift":
      movingSpeed = 120;
      break;
  }
};

window.addEventListener("keyup", keyUpHandler2);
window.addEventListener("keydown", keyDownHandler2);

const selectGame = document.querySelector("#game-select");
selectGame.addEventListener("change", function (e) {
  const gameNumber = e.target.value;

  if (gameNumber === "1") {
    window.removeEventListener("keyup", keyUpHandler);
    window.removeEventListener("keydown", keyDownHandler);

    window.addEventListener("keyup", keyUpHandler2);
    window.addEventListener("keydown", keyDownHandler2);
  } else if (gameNumber === "2") {
    window.removeEventListener("keyup", keyUpHandler2);
    window.removeEventListener("keydown", keyDownHandler2);

    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);
  }
});

const focusDiv1 = document.getElementById("focus-parent-div");
const focusDiv2 = document.getElementById("focus-out-div");
const focusResult = document.getElementById("focus-result");

focusDiv1.addEventListener("focus", (event) => {
  focusResult.insertAdjacentHTML(
    "beforeend",
    `<div>focus from ${event.target.id}</div>`
  );
});

focusDiv2.addEventListener("focus", (event) => {
  focusResult.insertAdjacentHTML(
    "beforeend",
    `<div>focus from ${event.target.id}</div>`
  );
});

clearbtn2.addEventListener("click", (event) => {
  focusResult.innerHTML = "";
});

const focusInDiv1 = document.getElementById("focusin-parent-div");
const focusInDiv2 = document.getElementById("focusin-out-div");
const focusInResult = document.getElementById("focusin-result");

focusInDiv1.addEventListener("focusin", (event) => {
  focusInResult.insertAdjacentHTML(
    "beforeend",
    `<div>focusIn from parent div</div>`
  );
});

focusInDiv2.addEventListener("focusin", (event) => {
  focusInResult.insertAdjacentHTML(
    "beforeend",
    `<div>focusIn from child div</div>`
  );
});

clearbtn2.addEventListener("click", (event) => {
  focusInResult.innerHTML = "";
});

focusInDiv1.addEventListener("focusout", (event) => {
  focusInResult.insertAdjacentHTML(
    "beforeend",
    `<div>focusout from parent div</div>`
  );
});

focusInDiv2.addEventListener("focusout", (event) => {
  focusInResult.insertAdjacentHTML(
    "beforeend",
    `<div>focusout from child div</div>`
  );
});

clearbtn2.addEventListener("click", (event) => {
  focusInResult.innerHTML = "";
});

const inputDiv1 = document.getElementById("input-parent-div");
const inputDiv2 = document.getElementById("input-out-div");
const inputResult = document.getElementById("input-result");

inputDiv1.addEventListener("input", (event) => {
  inputResult.insertAdjacentHTML(
    "beforeend",
    `<div>input from parent div</div>`
  );
});

inputDiv2.addEventListener("input", (event) => {
  inputResult.insertAdjacentHTML(
    "beforeend",
    `<div>input from child div</div>`
  );
});

clearbtn2.addEventListener("click", (event) => {
  inputResult.innerHTML = "";
});

const changeDiv1 = document.getElementById("change-parent-div");
const changeDiv2 = document.getElementById("change-out-div");
const changeResult = document.getElementById("change-result");

changeDiv1.addEventListener("change", (event) => {
  changeResult.insertAdjacentHTML(
    "beforeend",
    `<div>change from parent div</div>`
  );
});

changeDiv2.addEventListener("change", (event) => {
  changeResult.insertAdjacentHTML(
    "beforeend",
    `<div>change from child div</div>`
  );
});

clearbtn2.addEventListener("click", (event) => {
  changeResult.innerHTML = "";
});

document.addEventListener("DOMContentLoaded", (e) => {
  const domloadedEl = document.querySelector("#domloaded");
  const today = new Date();
  console.log(document.readyState);
  domloadedEl.innerHTML = `DOMContentLoaded at ${today.getTime()} 밀리초 && ReadyStage : ${
    document.readyState
  }`;
});

document.addEventListener("readystatechange", () => {
  const readystateEl = document.querySelector("#readystate");
  const today = new Date();
  readystateEl.textContent = `ReadyState: ${
    document.readyState
  } at ${today.getTime()} 밀리초`;
});

window.addEventListener("load", () => {
  const loadEl = document.querySelector("#load");
  const today = new Date();
  loadEl.textContent = `Loaded at ${today.getTime()} 밀리초`;
});

const log1 = document.getElementById("log1");
const log2 = document.getElementById("log2");

function logReset(event) {
  log1.textContent = `Form reset! Timestamp: ${event.timeStamp}`;
}

function logSubmit(event) {
  event.preventDefault();
  log2.textContent = `Form submit! Timestamp: ${event.timeStamp}`;
}
const form = document.getElementById("form");

const submitBtn = document.getElementById("submit-btn");
form.addEventListener("reset", logReset);
submitBtn.addEventListener("click", logSubmit);

let resizeFlag = false;
let scrollFlag = false;

const resizeBtn = document.getElementById("resizeBtn");
const scrollBtn = document.getElementById("scrollBtn");

window.addEventListener("resize", function () {
  if (resizeFlag) alert("resize 이벤트 발생 : window 객체에서만 발생한다.");
});

window.addEventListener("scroll", function () {
  if (scrollFlag) alert("scroll 이벤트 발생");
});

resizeBtn.addEventListener("click", function () {
  resizeFlag = !resizeFlag;
  resizeBtn.textContent = resizeFlag
    ? "Resize 이벤트 Status : On "
    : "Resize 이벤트 Status : Off";
});

scrollBtn.addEventListener("click", function () {
  scrollFlag = !scrollFlag;
  scrollBtn.textContent = scrollFlag
    ? "Scroll 이벤트 Status : On "
    : "Scroll 이벤트 Status : Off";
});

const idInputElement = document.getElementById("idInput");
idInputElement.onkeydown = (e) => {
  if (e.key === "Enter") {
    idInputElement.blur();
  }
};

const checkInputBox = document.getElementById("checkInputBox");

const clickTestBtn = document.getElementById("clickTest");
clickTestBtn.onclick = (e) => {
  checkInputBox.dispatchEvent(new MouseEvent("click"));
};

// const beeImg = document.getElementById("bee");

// document.addEventListener("mouseenter", function (e) {
//   beeImg.style.display = "inline-block";
// });

// document.addEventListener("mousemove", function (e) {
//   beeImg.style.transform = `translate3d(calc(${e.pageX}px + 50%), calc(${e.pageY}px +  50%), 0)`;
// });

// document.addEventListener("mouseleave", function (e) {
//   beeImg.style.display = "none";
// });
