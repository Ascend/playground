const searchbarContainer = document.getElementById("searchbar-container");
const resultsContainer = document.getElementById("results-container");
const floaterContainer = document.getElementById("floater-container");

const defaultInitSettings = {
  timeout: 25000,
  top_k: 6,
  endpointType: "http://159.138.147.5:8080/api/search",
};

const endpointMap = {
  option1: "http://play-ascend.mindspore.cn:38501/api/search",
  option2: "http://play-ascend.mindspore.cn:38502/api/search",
};

const settings = {
  endpointType:
    localStorage.getItem("jina-endpoint-type") ||
    defaultInitSettings.endpointType,
  url: localStorage.getItem("jina-endpoint") || "",
  timeout: localStorage.getItem("jina-timeout") || defaultInitSettings.timeout,
  top_k: localStorage.getItem("jina-top_k") || defaultInitSettings.top_k,
  resultsAreaId: false,
  showSearch: true,
  showFloater: true,
  showSearchbarDropzone: true,
  showFloaterDropzone: true,
  theme: "default",
  placeholders: [
    "type or drag anything to search",
    "powered by Jina",
    "unleash your curiosity and happy searching",
  ],
  typewriterDelayCharacter: 50,
  typewriterDelayItem: 1000,
  floaterStyle: "standard",
  acceptVideo: true,
  acceptAudio: true,
  acceptText: true,
  acceptImage: true,
};

const defaultComponentSettings = {
  resultsLocation: "dropdown",
  typewriterEffect: false,
  typewriterDelayCharacter: 50,
  typewriterDelayItem: 1000,
  theme: "default",
  searchIcon: "color",
  floaterIcon: "color",
  globalDrag: true,
  placeholders: [
    "type or drag anything to search",
    "powered by Jina",
    "unleash your curiosity and happy searching",
  ],
};

const searchbarSettings = {};

const floaterSettings = {};

function renderCode() {
  let searchbarCode = `
	${
    settings.showSearch
      ? `\n<jina-searchbar\
	${
      settings.theme != defaultComponentSettings.theme
        ? `\ntheme="${settings.theme}"`
        : ""
      }\
	${settings.resultsAreaId ? `\nresultsAreaId="${settings.resultsAreaId}"` : ""}\
	${settings.typewriterEffect ? `\ntypewriterEffect="true"` : ""}\
	${
      settings.typewriterDelayCharacter !=
        defaultComponentSettings.typewriterDelayCharacter
        ? `\ntypewriterDelayCharacter=${settings.typewriterDelayCharacter}`
        : ""
      }\
	${
      settings.typewriterDelayItem != defaultComponentSettings.typewriterDelayItem
        ? `\ntypewriterDelayItem=${settings.typewriterDelayItem}`
        : ""
      }\
	${
      String(settings.placeholders) !=
        String(defaultComponentSettings.placeholders)
        ? `\nplaceholders='${JSON.stringify(settings.placeholders)}'`
        : ""
      }\
	${settings.resultsLocation == "external" ? '\nresultsLocation="external"' : ""}\
	${settings.acceptAudio ? "" : '\nacceptAudio="false"'}\
	${settings.acceptVideo ? "" : '\nacceptVideo="false"'}\
	${settings.acceptImage ? "" : '\nacceptImage="false"'}\
	${settings.acceptText ? "" : '\nacceptText="false"'}\
	${settings.showSearchbarDropzone ? "" : '\nshowDropzone="false"'}>
	</jina-searchbar>`
      : ""
    }\
	`;

  let floaterCode = `
	${
    settings.showFloater
      ? `\n${
      settings.floaterStyle === "standard"
        ? "<jina-floater"
        : "<jina-floater-chat"
      }\
	${
      settings.theme != defaultComponentSettings.theme
        ? `\ntheme="${settings.theme}"`
        : ""
      }\
	${settings.typewriterEffect ? `\ntypewriterEffect="true"` : ""}\
	${
      settings.typewriterDelayCharacter !=
        defaultComponentSettings.typewriterDelayCharacter
        ? `\ntypewriterDelayCharacter=${settings.typewriterDelayCharacter}`
        : ""
      }\
	${
      settings.typewriterDelayItem != defaultComponentSettings.typewriterDelayItem
        ? `\ntypewriterDelayItem=${settings.typewriterDelayItem}`
        : ""
      }\
	${
      String(settings.placeholders) !=
        String(defaultComponentSettings.placeholders)
        ? `\nplaceholders='${JSON.stringify(settings.placeholders)}'`
        : ""
      }\
	${settings.acceptAudio ? "" : '\nacceptAudio="false"'}\
	${settings.acceptVideo ? "" : '\nacceptVideo="false"'}\
	${settings.acceptImage ? "" : '\nacceptImage="false"'}\
	${settings.acceptText ? "" : '\nacceptText="false"'}\
	${settings.showFloaterDropzone ? "" : '\nshowDropzone="false"'}>
	${
      settings.floaterStyle === "standard"
        ? "</jina-floater>"
        : "</jina-floater-chat>"
      }`
      : ""
    }
	`;

  let resultsCode = `
	${
    settings.resultsLocation == "external"
      ? "<jina-results></jina-results>"
      : ""
    }\
	`;

  floaterContainer.innerHTML = floaterCode;
  searchbarContainer.innerHTML = searchbarCode;
  resultsContainer.innerHTML = resultsCode;

  const code = `
	<body>\
		${searchbarCode}\
		${resultsCode}\
		${floaterCode}
	<body>

	<script src="https://unpkg.com/jinabox"></script>
<script>
JinaBox.init('${settings.url}'${
    settings.timeout || settings.top_k
      ? `,{\
	${settings.timeout ? `timeout:${settings.timeout},` : ""}\
	${settings.top_k ? `top_k:${settings.top_k}` : ""}}`
      : ""
    });
</script>
`;

  //   document.getElementById("jinabox-code").innerText = code;
}

const endpointSelection = document.getElementById("endpointSelection");
const inputEndpoint = document.getElementById("inputEndpoint");

endpointSelection.addEventListener("change", function (e) {
  let optionValue = e.target.value;

  if (optionValue === "custom") {
    const url = inputEndpoint.value;
    inputEndpoint.style.display = "block";
    window.JinaBox.updateSettings({ url });
    settings.url = url;
    localStorage.setItem("jina-endpoint-type", url);
    renderCode();
  } else {
    if (optionValue in endpointMap) {
      if (optionValue === "option1") {
        $("#queryExample").css("display", "none");
        $("#browser").css("display", "none");
        $("#canvas-wraper").css("display", "block");
      } else if (optionValue === "option2") {
        $("#queryExample").css("display", "block");
        $("#browser").css("display", "block");
        $("#canvas-wraper").css("display", "none");
      }

      const url = endpointMap[optionValue];

      document.getElementById("acceptAudio").checked = false;
      document.getElementById("acceptVideo").checked = false;
      settings.acceptAudio = false;
      settings.acceptVideo = false;

      inputEndpoint.style.display = "none";
      window.JinaBox.updateSettings({ url });
      settings.url = url;
      localStorage.setItem("jina-endpoint-type", url);
      renderCode();
    } else {
      alert("该endpoint不存在");
    }
  }
});

inputEndpoint.setAttribute("value", settings.url || "");
inputEndpoint.addEventListener("input", function (e) {
  const url = e.target.value;
  localStorage.setItem("jina-endpoint", url);
  window.JinaBox.updateSettings({ url });
  settings.url = url;
  renderCode();
});

if (settings.endpointType === "custom") {
  endpointSelection.value = settings.endpointType;
  inputEndpoint.style.display = "block";
} else {
  document.getElementById("acceptAudio").checked = false;
  document.getElementById("acceptVideo").checked = false;
  settings.acceptAudio = false;
  settings.acceptVideo = false;
  settings.url = settings.endpointType;
}


document.getElementById("showSearch").addEventListener("change", function (e) {
  const checked = e.target.checked;
  settings.showSearch = checked;
  if (checked) searchbarContainer.style.visibility = "";
  else searchbarContainer.style.visibility = "hidden";
  renderCode();
});

document.getElementById("showFloater").addEventListener("change", function (e) {
  const checked = e.target.checked;
  settings.showFloater = checked;
  if (checked) {
    floaterContainer.style.visibility = "";
    floaterContainer.style.opacity = 1;
  } else {
    floaterContainer.style.opacity = 0;
    floaterContainer.style.visibility = "hidden";
  }
  renderCode();
});

document
  .getElementById("showSearchbarDropzone")
  .addEventListener("change", function (e) {
    const checked = e.target.checked;
    settings.showSearchbarDropzone = checked;
    renderCode();
  });

document
  .getElementById("showFloaterDropzone")
  .addEventListener("change", function (e) {
    const checked = e.target.checked;
    settings.showFloaterDropzone = checked;
    renderCode();
  });

document.getElementById("acceptVideo").addEventListener("change", function (e) {
  const checked = e.target.checked;
  settings.acceptVideo = checked;
  renderCode();
});

document.getElementById("acceptAudio").addEventListener("change", function (e) {
  const checked = e.target.checked;
  settings.acceptAudio = checked;
  renderCode();
});

document.getElementById("acceptText").addEventListener("change", function (e) {
  const checked = e.target.checked;
  settings.acceptText = checked;
  renderCode();
});

document.getElementById("acceptImage").addEventListener("change", function (e) {
  const checked = e.target.checked;
  settings.acceptImage = checked;
  renderCode();
});

const themes = document.querySelectorAll(".jina-theme-select");
for (let i = 0; i < themes.length; ++i) {
  let radio = themes[i];
  radio.onclick = function () {
    settings.theme = radio.value;
    renderCode();
  };
}

document.querySelector("#floaterStandard").onclick = function () {
  settings.floaterStyle = "standard";
  renderCode();
};

document.querySelector("#floaterChatBot").onclick = function () {
  settings.floaterStyle = "chatBot";
  renderCode();
};

document.querySelector("#resultsDropdown").onclick = function () {
  settings.resultsLocation = "dropdown";
  renderCode();
};

document.querySelector("#resultsComponent").onclick = function () {
  settings.resultsLocation = "external";
  renderCode();
};

document
  .getElementById("useTypewriter")
  .addEventListener("change", function (e) {
    const checked = e.target.checked;
    settings.typewriterEffect = checked;
    renderCode();
  });

function handleFileDrag(ev) {
  ev.dataTransfer.setData("text", ev.target.src);
  console.log("ev");
}

renderCode();

console.log("initializing");
JinaBox.init(settings.url, {
  timeout: settings.timeout,
  top_k: settings.top_k,
});

const Images = [
  './img/mushroom_1.jpeg',
  './img/mushroom_2.jpeg',
  './img/mushroom_3.jpeg',
  './img/mushroom_4.jpeg',
  './img/mushroom_5.jpeg',
  './img/mushroom_6.jpeg',
]
function renderExampleImages(params) {
  //
  let html = Images.map(href => {
    return `<img class="img-thumbnail" src="${href}" />`
  }).join('')
  $('.example-images').html(html)
}

renderExampleImages()

const showBoxIframe = document.getElementById('showBoxIframe');
const showBoxIframeBefore = document.getElementById('showBoxIframeBefore');
$('.viewCluster').on('click', () => {
  $(showBoxIframeBefore).css('display', 'none');
  $(showBoxIframe).css('display', 'block');
  showBoxIframe.src = 'http://play-ascend.mindspore.cn:38600/cluster'
})
$('.viewNode').on('click', () => {
  $(showBoxIframeBefore).css('display', 'none');
  $(showBoxIframe).css('display', 'block');
  showBoxIframe.src = 'http://play-ascend.mindspore.cn:38600/nodes'
})
$('.viewPartition').on('click', () => {
  $(showBoxIframeBefore).css('display', 'none');
  $(showBoxIframe).css('display', 'block');
  showBoxIframe.src = 'http://play-ascend.mindspore.cn:38600/partitions'
})

$('#right_2_div>span').on('click', () => {
	$('#right_introduction').text("CANN(Compute Architecture for Neural Networks)是华为全栈全场景AI解决方案中的芯片使能层，位于芯片层之上，AI框架层之下，它提供了高效算子库和高度自动化的神经网络算子开发工具，让开发者能够方便地在昇腾芯片上开发高性能的自定义算子。");	
})
$('#right_3_div').on('click', () => {
	$('#right_introduction').text("AscendCL昇腾统一编程语言（Ascend Computing Language）统一API适配昇腾系列硬件，实现软硬件解耦。并且通过第三方框架调用AscendCL接口，使用昇腾AI处理器的计算能力，拓展昇腾芯片多样化计算能力，让开发者受益。");	
})
$('#right_4_div').on('click', () => {
	$('#right_introduction').text("Graph Engine昇腾图优化引擎（简称GE），位于AI框架和昇腾驱动层之间，起到承接作用。GE针对昇腾芯片的硬件结构特点，做了特定的优化工作，并且提供了构图接口集合，用户可以调用这些接口构建网络模型，设置模型所包含的图、图内的算子、以及模型和算子的属性等，以此来充分发挥出昇腾芯片的强大算力。");	
})
$('#right_5_div').on('click', () => {
	$('#right_introduction').text("Runtime运行管理器是神经网络任务流进入硬件资源的入口，为神经网络的任务分配提供了资源管理通道。昇腾芯片通过Runtime而执行在应用程序的进程空间中，为应用程序提供了存储管理、设备管理、执行流管理、事件管理、核函数执行等功能。");	
})
$('#right_6_div').on('click', () => {
	$('#right_introduction').text("DVPP数字视觉预处理是编解码和图像转换模块。当视频或图像数据进入昇腾芯片进行计算之前，由于达芬奇架构对输入数据有固定的格式要求，如果数据未满足架构规定的输入格式、分辨率等要求，就需要调用DVPP进行格式的转换，之后才可以进行后续的神经网络计算步骤。");	
})
$('#right_7_div').on('click', () => {
	$('#right_introduction').text("HCCL华为集合通信库 (Huawei Collective Communication Library) 实现昇腾芯片的collective communication通信库。并在集群训练中提供多机多卡间集合通信功能、梯度聚合功能和hcom集群通信算子，在分布式训练中不同昇腾AI处理器之间提供高效的数据传输能力。");	
})
$('#right_8_div').on('click', () => {
	$('#right_introduction').text("Driver昇腾驱动层与Runtime共同组成软硬件之间的连接通道。在执行时，Driver任务调度器对硬件进行任务的驱动和供给，为昇腾芯片提供具体的目标任务，与Runtime一起完成任务调度流程，并将输出数据回送给Runtime，充当了一个任务输送分发和数据回传的通道。");	
})
$('#right_9_div').on('click', () => {
	$('#right_introduction').text("TBE编程语言为基于昇腾芯片的神经网络提供算子开发能力，同时也提供了封装调用能力。其中有一个神经网络TBE标准算子库，开发者可以直接利用标准算子库中的算子实现高性能的神经网络计算。除此之外，TBE算子的融合能力，也为神经网络的优化提供了另外一条技术路径。");	
})