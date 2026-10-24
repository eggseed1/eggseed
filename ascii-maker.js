/* eggseed's little ASCII machine.
   Images stay local; no uploads, requests, libraries, or trackers. */
(function () {
  "use strict";

  var fileInput = document.getElementById("ascii-file");
  var dropZone = document.getElementById("ascii-drop");
  var output = document.getElementById("ascii-output");
  var statusBox = document.getElementById("ascii-status");
  var widthInput = document.getElementById("ascii-width");
  var widthValue = document.getElementById("ascii-width-value");
  var contrastInput = document.getElementById("ascii-contrast");
  var contrastValue = document.getElementById("ascii-contrast-value");
  var brightnessInput = document.getElementById("ascii-brightness");
  var brightnessValue = document.getElementById("ascii-brightness-value");
  var charsetInput = document.getElementById("ascii-charset");
  var invertInput = document.getElementById("ascii-invert");
  var convertButton = document.getElementById("ascii-convert");
  var copyButton = document.getElementById("ascii-copy");
  var downloadButton = document.getElementById("ascii-download");
  var demoButton = document.getElementById("ascii-demo");
  var clearButton = document.getElementById("ascii-clear");
  var imageSource = null;
  var fileBase = "eggseed-ascii";
  var processing = false;
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d", { willReadFrequently: true });
  var sample = [
    "         .-~~~~-.          ",
    "      __/ ______ \\__       ",
    "  .--/_____________\\--.   ",
    "       |  o  o  |          ",
    "       |    ^   |          ",
    "        \\  _   /           ",
    "        /|___|\\            ",
    "      _/ /   \\ \\_          ",
    "                            ",
    "    *  C O U N T R Y  *   ",
    "        45 rpm / 7 in.     "
  ].join("\n");

  function say(message) {
    statusBox.textContent = message;
  }

  function updateIndicators() {
    widthValue.textContent = widthInput.value;
    contrastValue.textContent = (Number(contrastInput.value) / 100).toFixed(2);
    brightnessValue.textContent = brightnessInput.value;
  }

  function closeOldImage() {
    if (imageSource && typeof imageSource.close === "function") imageSource.close();
    imageSource = null;
  }

  function makeImage(file) {
    if ("createImageBitmap" in window) return createImageBitmap(file);
    return new Promise(function (resolve, reject) {
      var image = new Image();
      var url = URL.createObjectURL(file);
      image.onload = function () { URL.revokeObjectURL(url); resolve(image); };
      image.onerror = function () { URL.revokeObjectURL(url); reject(new Error("Could not read that image.")); };
      image.src = url;
    });
  }

  function imageDimensions(image) {
    return { width: image.width || image.naturalWidth, height: image.height || image.naturalHeight };
  }

  function convert() {
    if (!imageSource || !ctx) {
      say("choose a picture first.");
      return;
    }
    var dims = imageDimensions(imageSource);
    if (!dims.width || !dims.height) { say("this file has no readable pixels."); return; }
    var columns = Number(widthInput.value);
    var correction = 0.50; // monospace characters are taller than they are wide
    var rows = Math.max(1, Math.round(columns * (dims.height / dims.width) * correction));
    if (rows > 200) {
      columns = Math.max(1, Math.round(columns * 200 / rows));
      rows = Math.max(1, Math.round(columns * (dims.height / dims.width) * correction));
    }
    canvas.width = columns;
    canvas.height = rows;
    ctx.clearRect(0, 0, columns, rows);
    ctx.drawImage(imageSource, 0, 0, columns, rows);
    var rgba = ctx.getImageData(0, 0, columns, rows).data;
    var characters = charsetInput.value;
    var contrast = Number(contrastInput.value) / 100;
    var brightness = Number(brightnessInput.value) / 100;
    var invert = invertInput.checked;
    var lines = [];
    for (var y = 0; y < rows; y++) {
      var line = "";
      for (var x = 0; x < columns; x++) {
        var i = (y * columns + x) * 4;
        var opacity = rgba[i + 3] / 255;
        var red = rgba[i] * opacity + 255 * (1 - opacity);
        var green = rgba[i + 1] * opacity + 255 * (1 - opacity);
        var blue = rgba[i + 2] * opacity + 255 * (1 - opacity);
        var gray = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
        var tone = Math.max(0, Math.min(1, (gray - 0.5) * contrast + 0.5 + brightness));
        if (invert) tone = 1 - tone;
        line += characters.charAt(Math.round(tone * (characters.length - 1)));
      }
      lines.push(line);
    }
    output.value = lines.join("\n");
    say("done! " + columns + " columns / " + rows + " rows. you can edit the result below.");
  }

  function safeBase(name) {
    return name.replace(/\.[^.]*$/, "").replace(/[^a-z0-9_-]+/gi, "-").replace(/^-|-$/g, "").slice(0, 64) || "eggseed-ascii";
  }

  async function loadFile(file) {
    if (!file) return;
    if (!/^image\/(png|jpeg|gif|webp|bmp|avif)$/.test(file.type)) {
      say("use a png, jpeg, webp, gif, bmp, or avif image.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      say("image is too large. please use one under 15 MB.");
      return;
    }
    if (processing) return;
    processing = true;
    say("reading picture locally...");
    try {
      var decoded = await makeImage(file);
      var dims = imageDimensions(decoded);
      if (!dims.width || !dims.height || dims.width * dims.height > 40000000) {
        if (typeof decoded.close === "function") decoded.close();
        throw new Error("Image is too large to process safely.");
      }
      closeOldImage();
      imageSource = decoded;
      fileBase = safeBase(file.name);
      convertButton.disabled = false;
      convert();
    } catch (err) {
      say("could not convert: " + (err && err.message ? err.message : "unsupported file"));
    } finally {
      processing = false;
    }
  }

  function copyResult() {
    if (!output.value) { say("nothing to copy yet."); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(output.value).then(
        function () { say("ascii copied to clipboard."); },
        function () { fallbackCopy(); }
      );
    } else {
      fallbackCopy();
    }
  }

  function fallbackCopy() {
    output.focus();
    output.select();
    try {
      var ok = document.execCommand("copy");
      say(ok ? "ascii copied to clipboard." : "select the text and copy it manually.");
    } catch (err) {
      say("select the text and copy it manually.");
    }
  }

  function downloadText() {
    if (!output.value) { say("nothing to download yet."); return; }
    var file = new Blob([output.value + "\n"], { type: "text/plain;charset=utf-8" });
    var url = URL.createObjectURL(file);
    var link = document.createElement("a");
    link.href = url;
    link.download = fileBase + ".txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    say("text file ready.");
  }

  fileInput.addEventListener("change", function () { loadFile(fileInput.files && fileInput.files[0]); });
  ["dragenter", "dragover"].forEach(function (name) {
    dropZone.addEventListener(name, function (event) {
      event.preventDefault();
      dropZone.classList.add("hover");
    });
  });
  ["dragleave", "drop"].forEach(function (name) {
    dropZone.addEventListener(name, function (event) {
      event.preventDefault();
      dropZone.classList.remove("hover");
    });
  });
  dropZone.addEventListener("drop", function (event) {
    if (event.dataTransfer && event.dataTransfer.files.length) loadFile(event.dataTransfer.files[0]);
  });
  [widthInput, contrastInput, brightnessInput].forEach(function (input) {
    input.addEventListener("input", function () {
      updateIndicators();
      if (imageSource && !processing) convert();
    });
  });
  [charsetInput, invertInput].forEach(function (input) {
    input.addEventListener("change", function () { if (imageSource && !processing) convert(); });
  });
  convertButton.addEventListener("click", convert);
  copyButton.addEventListener("click", copyResult);
  downloadButton.addEventListener("click", downloadText);
  demoButton.addEventListener("click", function () {
    closeOldImage();
    convertButton.disabled = true;
    fileInput.value = "";
    fileBase = "eggseed-cowboy";
    output.value = sample;
    say("cowboy stamp loaded. edit it however you like.");
  });
  clearButton.addEventListener("click", function () {
    closeOldImage();
    convertButton.disabled = true;
    fileInput.value = "";
    output.value = "";
    fileBase = "eggseed-ascii";
    say("cleared. ready for another picture.");
  });
  if (!ctx) {
    say("image conversion is unavailable in this browser; the text editor still works.");
    fileInput.disabled = true;
  } else {
    say("ready. images never leave your device.");
  }
  updateIndicators();
}());

/* Word lettering and screenshot-paste extension. No network requests. */
(function(){
"use strict";
var input=document.getElementById("ascii-letter-input");
var button=document.getElementById("ascii-letter-convert");
var output=document.getElementById("ascii-output");
var status=document.getElementById("ascii-status");
var imageInput=document.getElementById("ascii-file");
var chars={"0":[".@@.","@..@","@..@","@..@",".@@."],"1":[".@.","@@.","..@.","..@.","@@@"],"2":["@@@.","...@",".@@.","@...","@@@@"],"3":["@@@.","...@",".@@.","...@","@@@."],"4":["@..@","@..@","@@@@","...@","...@"],"5":["@@@@","@...","@@@.","...@","@@@."],"6":[".@@@","@...","@@@.","@..@",".@@."],"7":["@@@@","...@","..@.",".@..",".@.."],"8":[".@@.","@..@",".@@.","@..@",".@@."],"9":[".@@.","@..@",".@@.","...@",".@@."],"A":[".@@.","@..@","@@@@","@..@","@..@"],"B":["@@@.","@..@","@@@.","@..@","@@@."],"C":[".@@@","@...","@...","@...",".@@@"],"D":["@@@.","@..@","@..@","@..@","@@@."],"E":["@@@@","@...","@@@.","@...","@@@@"],"F":["@@@@","@...","@@@.","@...","@..."],"G":[".@@@","@...","@.@@","@..@",".@@@"],"H":["@..@","@..@","@@@@","@..@","@..@"],"I":["@@@","..@.","..@.","..@.","@@@"],"J":["..@@","...@","...@","@..@",".@@."],"K":["@..@","@.@.","@@..","@.@.","@..@"],"L":["@...","@...","@...","@...","@@@@"],"M":["@...@","@@.@@","@.@.@","@...@","@...@"],"N":["@...@","@@..@","@.@.@","@..@@","@...@"],"O":[".@@.","@..@","@..@","@..@",".@@."],"P":["@@@.","@..@","@@@.","@...","@..."],"Q":[".@@.","@..@","@..@","@.@@",".@@@"],"R":["@@@.","@..@","@@@.","@.@.","@..@"],"S":[".@@@","@...",".@@.","...@","@@@."],"T":["@@@@@","..@..","..@..","..@..","..@.."],"U":["@..@","@..@","@..@","@..@",".@@."],"V":["@...@","@...@","@...@","..@.@.","..@.."],"W":["@...@","@...@","@.@.@","@@.@@","@...@"],"X":["@...@","..@.@.","..@..","..@.@.","@...@"],"Y":["@...@","..@.@.","..@..","..@..","..@.."],"Z":["@@@@","...@","..@.",".@..","@@@@"],"!":["@","@","@"," ","@"],"?":["@@@.","...@",".@@.","....",".@.."],".":[" "," "," "," ","@"],"-":["    ","    ","@@@@","    ","    "],"/":["...@","..@.",".@..","@...","...."]," ":["  ","  ","  ","  ","  "],"&":[".@@.","@.@.","..@.","@.@@",".@@@"],"@":[".@@@.","@...@","@.@@@","@....",".@@@."]};
function letterArt(){
var value=input.value.toUpperCase().replace(/[^A-Z0-9!?\.\/&@ -]/g,"?").trim();
if(!value){status.textContent="type a phrase first.";return;}
var rendered=[];
for(var offset=0;offset<value.length;offset+=12){
 var chunk=value.slice(offset,offset+12).split("");
 for(var row=0;row<5;row++){
  rendered.push(chunk.map(function(letter){var cells=chars[letter]||chars["?"];return cells[row].replace(/@/g,"#").replace(/\./g," ");}).join("  ").replace(/\s+$/,""));
 }
 if(offset+12<value.length)rendered.push("");
}
output.value=rendered.join("\n");
status.textContent="word art ready. edit, copy, or save it below.";
output.focus();
}
button.addEventListener("click",letterArt);
input.addEventListener("keydown",function(event){if(event.key==="Enter"){event.preventDefault();letterArt();}});
document.addEventListener("paste",function(event){
 if(!event.clipboardData||!event.clipboardData.items)return;
 var imageItem=Array.from(event.clipboardData.items).find(function(item){return item.kind==="file"&&item.type.indexOf("image/")===0;});
 if(!imageItem)return;
 var image=imageItem.getAsFile();
 if(!image)return;
 try{
  var transfer=new DataTransfer();transfer.items.add(image);imageInput.files=transfer.files;
  imageInput.dispatchEvent(new Event("change",{bubbles:true}));
  event.preventDefault();
 }catch(error){status.textContent="paste unavailable here; save the screenshot and choose it above.";}
});
}());
