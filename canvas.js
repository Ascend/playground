var canvas, ctx, img;
canvas = document.getElementById("canvas");
// img = document.getElementById("img");

canvas.height = 300;
canvas.width = 300;

ctx = canvas.getContext("2d");
ctx.fillStyle = "#fffff";
ctx.fillRect(0, 0, canvas.width, canvas.height);
var mousePress = false;
var last = null;

function beginDraw() {
  mousePress = true;
}

function drawing(event) {
  event.preventDefault();
  if (!mousePress) return;
  var xy = pos(event);
  if (last != null) {
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(xy.x, xy.y);
    ctx.stroke();
  }
  last = xy;
}

function endDraw(event) {
  mousePress = false;
  event.preventDefault();
  last = null;
}

function pos(event) {
  var x, y;
  if (isTouch(event)) {
    x = event.touches[0].pageX;
    y = event.touches[0].pageY;
  } else {
    x = event.offsetX;
    y = event.offsetY;
  }
  return { x: x, y: y };
}

function isTouch(event) {
  var type = event.type;
  if (type.indexOf("touch") >= 0) {
    return true;
  } else {
    return false;
  }
}

function send() {
  var dataUrl = canvas.toDataURL();
  //   img.src = dataUrl;

  fetch("http://play-ascend.mindspore.cn:38501/api/search", {
    method: "Post",
    headers: {
      // 'user-agent': 'Mozilla/4.0 MDN Example',
      "content-type": "application/json",
    },
    body: JSON.stringify({
      data: [dataUrl],
      mode: "search",
      top_k: 6,
    }),
  })
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error))
    .then((response) => {
      let images = resolveResponse(response).slice(0, 3);
      let html = images
        .map((imgObj) => {
          return `<img src="${imgObj.data}" style="width:150px;height:150px;margin:5px;"/>`;
        })
        .join("");
      $("#canvas-search-results").html(html);
    });
}

function clean() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function searchImg() {}

function scaleImg() {}

ctx.lineWidth = 2;
ctx.strokeStyle = "#ffffff";

canvas.onmousedown = beginDraw;
canvas.onmousemove = drawing;
canvas.onmouseup = endDraw;
canvas.addEventListener("touchstart", beginDraw, false);
canvas.addEventListener("touchmove", drawing, false);
canvas.addEventListener("touchend", endDraw, false);

function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

function resolveResponse(response) {
  let results = [];
  let queries = [];
  let totalResults = 0;
  let queriesContainMedia = false;
  let resultsContainText = false;
  let onlyImages = true;
  let { docs } = response.search;
  let { code, description } = response.status || {};
  if (code == "ERROR") return alert(description);

  for (let i = 0; i < docs.length; ++i) {
    let docResults = docs[i];
    let { topkResults, matches, uri, mimeType } = docResults;
    queries.push({ uri, mimeType });

    if (mimeType.includes("image")) queriesContainMedia = true;

    let resultsArr = topkResults || matches;

    for (let j = 0; j < resultsArr.length; ++j) {
      const res = resultsArr[j];
      if (!results[i]) results[i] = [];

      let data, text, mimeType, score;
      score = res.score.value;
      if (res.matchDoc) {
        mimeType = res.matchDoc.mimeType;
        data = res.matchDoc.uri;
        text = res.matchDoc.text;
      } else {
        mimeType = res.mimeType;
        data = res.uri;
        text = res.text;
      }

      if (mimeType.includes("text")) {
        onlyImages = false;
        resultsContainText = true;
      }

      if (!mimeType.includes("image")) onlyImages = false;

      results[i].push({ mimeType, data, text, score });
      totalResults++;
    }
  }
  const resultsMeta = {
    totalResults,
    resultsContainText,
    queriesContainMedia,
    onlyImages,
  };

  console.log("resultsMeta:", queries, results, resultsMeta);
  return results[0];
}
