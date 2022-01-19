document.getElementById('output').innerHTML=sessionStorage.getItem('transcript')
let title = document.getElementById('output').getElementsByTagName('strong')[0].innerHTML;
document.getElementsByTagName('title')[0].innerHTML = title;
