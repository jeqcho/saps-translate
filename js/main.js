function processFile(file) {
  console.log("processing file");
  document.getElementById('file-label').innerHTML = "Loading...";
  console.log('reading file');
  reader.readAsText(file);
}

function fileInputHandler(event) {
  console.log("received file");
  event.preventDefault();
  const [file] = document.querySelector('input[type=file]').files;
  if (file) {
    console.log('reading file');
    processFile(file);
  }
}

function dropHandler(ev) {
  console.log('File(s) dropped');

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    console.log('DATA TRANSFER ITEMS');
    for (var i = 0; i < ev.dataTransfer.items.length; i++) {
      // If dropped items aren't files, reject them
      if (ev.dataTransfer.items[i].kind === 'file') {
        var file = ev.dataTransfer.items[i].getAsFile();
        processFile(file);
        return;
      }
    }
  } else {
    // Use DataTransfer interface to access the file(s)
    console.log('DATA TRANSFER FILES');
    for (var i = 0; i < ev.dataTransfer.files.length; i++) {
      processFile(file);
      return;
    }
  }
  console.log(ev.dataTransfer.items.length);
}

const reader = new FileReader();
reader.addEventListener("load", () => {
  console.log('translating')
  document.getElementById('output').innerHTML = translate(reader.result);
  trimmer();
  sessionStorage.setItem('transcript', document.getElementById('output').innerHTML);
  done();
}, false);

function done() {
  document.getElementById('file-label').innerHTML = "Translation complete! Press preview or download below. Or drag or <u>choose a new transcript</u>";
  document.getElementById('custom-file-upload').classList.add('bg-info');
  document.getElementById('custom-file-upload').classList.add('text-white');
  document.getElementById('preview').disabled = false;
  document.getElementById('print').disabled = false;
  console.log('operations completed')
}

function translate(text) {
  for (const malay in old) {
    let reg = new RegExp('(?<![A-Za-z])' + malay + '(?![A-Za-z])', 'g');
    text = text.replace(reg, old[malay]);
  }
  for (const malay in subjects) {
    let reg = new RegExp('(?<![A-Za-z])' + malay + '(?![A-Za-z])', 'g');
    text = text.replace(reg, subjects[malay]);
  }
  for (const malay in misc) {
    let reg = new RegExp('(?<![A-Za-z])' + malay + '(?![A-Za-z])', 'g');
    text = text.replace(reg, misc[malay]);
  }
  let reg = new RegExp('\\[MA\\]', 'g');
  text = text.replace(reg, '');
  return text
}

function previewTranscript() {
  location.href = "transcript.html"
}

function trimmer() {
  document.getElementById('output').getElementsByTagName('img')[0].remove();
  let button = document.getElementById('mybutton');
  if (!!button) button.remove();
  if (!document.getElementById('output').innerHTML.includes('ANALYSIS')) {
    let trs = document.getElementById('output').getElementsByTagName('tr')
    trs[trs.length - 1].remove();
  }


}

function dragOverHandler(event) {
  // document.getElementById('ok-to-drop').display=block;
  event.preventDefault();
}

function purge() {
  console.log('purged');
  document.getElementById('file-selector').value = null;
  console.log(document.getElementById('file-selector').value);
  console.log(document.getElementById('file-selector').files);
  sessionStorage.clear();
}