function processFile(event) {
  console.log("processing file");
  document.getElementById('file-label').innerHTML="Loading...";
  setTimeout(uploaded,500);
  event.preventDefault();
  const [file] = document.querySelector('input[type=file]').files;
  const reader = new FileReader();

  reader.addEventListener("load", () => {
    // this will then display a text file
    document.getElementById('output').innerHTML = translate(reader.result);
    trimmer();
    sessionStorage.setItem('transcript', document.getElementById('output').innerHTML);
  }, false);

  if (file) {
    reader.readAsText(file);
  }
}

function uploaded(){
  document.getElementById('file-label').innerHTML="Translation complete! Press preview or download below. Or drag or <u>choose a new transcript</u>";
  document.getElementById('custom-file-upload').classList.add('bg-info');
  document.getElementById('custom-file-upload').classList.add('text-white');
  document.getElementById('preview').disabled=false;
  document.getElementById('print').disabled=false;
}

function translate(text) {
  for (const malay in old) {
    let reg = new RegExp('(?<![A-Za-z])' + malay +'(?![A-Za-z])', 'g');
    text=text.replace(reg, old[malay]);
  }
  for (const malay in subjects) {
    let reg = new RegExp('(?<![A-Za-z])' + malay +'(?![A-Za-z])', 'g');
    text=text.replace(reg, subjects[malay]);
  }
  for (const malay in misc) {
    let reg = new RegExp('(?<![A-Za-z])' + malay +'(?![A-Za-z])', 'g');
    text=text.replace(reg, misc[malay]);
  }
  let reg = new RegExp('\\[MA\\]', 'g');
  text=text.replace(reg,'');
  return text
}

function previewTranscript(){
  location.href="transcript.html"
}

function trimmer(){
  document.getElementById('output').getElementsByTagName('img')[0].remove();
  let trs = document.getElementById('output').getElementsByTagName('tr')
  trs[trs.length-1].remove();
  
}

function dragOverHandler(event){
  // document.getElementById('ok-to-drop').display=block;
  event.preventDefault();
}

function purge(){
  console.log('purged');
  document.getElementById('file-selector').value=null;
  console.log(document.getElementById('file-selector').value);
  console.log(document.getElementById('file-selector').files);
  sessionStorage.clear();
}