function handleFile(file) {
  console.log("processing file");
  document.getElementById('file-label').innerHTML = "Loading...";
  document.getElementById('custom-file-upload').classList.remove('bg-info');
  document.getElementById('custom-file-upload').classList.remove('text-white');
  console.log('reading file');
  if(file.type.split('/')[1]!='html')return fail('Not HTML file');
  reader.readAsText(file);
}

function check(){
  if(!!sessionStorage.getItem('transcript')){
    document.getElementById('output').innerHTML=sessionStorage.getItem('transcript')
    let title = document.getElementById('output').getElementsByTagName('strong')[0].innerHTML;
    done(title)
  }
}

function fail(e) {
  console.log(e);
  document.getElementById('file-label').innerHTML = "Cannot translate file. Please double check the instructions.  Drag or <u>choose a new transcript</u>";
  document.getElementById('custom-file-upload').classList.remove('bg-info');
  document.getElementById('custom-file-upload').classList.add('text-danger');
  document.getElementById('custom-file-upload').classList.remove('text-white');
  document.getElementById('preview').disabled = true;
  document.getElementById('print').disabled = true;
}
function processFile() {
  try {
    console.log('translating')
    document.getElementById('output').innerHTML = translate(reader.result);
    trimmer();
    sessionStorage.setItem('transcript', document.getElementById('output').innerHTML);

    let title = document.getElementById('output').getElementsByTagName('strong')[0].innerHTML;
    done(title);
  } catch (e) {
    fail(e);
  }
}

function fileInputHandler(event) {
  console.log("received file");
  event.preventDefault();
  const [file] = document.querySelector('input[type=file]').files;
  if (file) {
    console.log('reading file');
    handleFile(file);
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
        handleFile(file);
        return;
      }
    }
  } else {
    // Use DataTransfer interface to access the file(s)
    console.log('DATA TRANSFER FILES');
    for (var i = 0; i < ev.dataTransfer.files.length; i++) {
      handleFile(file);
      return;
    }
  }
  console.log(ev.dataTransfer.items.length);
}

const reader = new FileReader();
reader.addEventListener("load", () => {
  processFile(reader.result);
}, false);

function done(title) {
  document.getElementById('file-label').innerHTML = "Translation complete for <b>" + title + "</b>. <u>Choose a new transcript</u> or drop here";
  document.getElementsByTagName('title')[0].innerHTML = title;
  document.getElementById('custom-file-upload').classList.add('bg-info');
  document.getElementById('custom-file-upload').classList.add('text-white');
  document.getElementById('custom-file-upload').classList.remove('text-danger');
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