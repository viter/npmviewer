const showdataBtn = document.getElementById('showdata');
const versionsDiv = document.getElementById('versions');
const packageNameInput = document.getElementById('packagename');
const startVersion = document.getElementById('startversion');
const finishVersion = document.getElementById('finishversion');
const rawChkBox = document.getElementById('rawoutput');

let npmview = '';
let output = '';

showdataBtn.addEventListener('click', () => {
  const packageName = packageNameInput.value;
  const version1 = startVersion.value;
  const version2 = finishVersion.value;

   npmview = '';
   output = '';
  
  if (packageName.length > 1 && version1.length > 1) {
    if (version2.length > 1) {
      npmview = window.mycode.npmview(packageName, version1, version2);
    } else {
      npmview = window.mycode.npmview(packageName, version1);
    }
    const re = new RegExp(`${packageName}@\\d+.\\d+.\\d+`, 'g');
    console.log(npmview.toString().split(packageName+'@'));
    const dataArray = npmview.toString().split(packageName+'@');
    for (let item of dataArray) {
      let spliter = '{';
      if(item) {
        if(item.includes('\n{\n')) {
          spliter = '\n{\n';
        }
        output += `<span class='packageversion'>${packageName}@${item.split(spliter)[0].trim()}</span>`;
        //console.log(item.split(spliter)[1]);
        output += '<br>';
        for(let inneritem of item.split(spliter)[1].replace('}\n', '').split(',')) {
          if(inneritem.includes(':')) {
            output += `${inneritem.split(':')[0]}: <span class='packageversion1'>${inneritem.split(':')[1]}</span><br>`;
          } else {
            output += inneritem + '<br>';
          }
        }
        output += '<br>';
      }
    }
    if(rawChkBox.checked) {
      versionsDiv.innerText = npmview.toString();
    } else {
      versionsDiv.innerHTML = output;
    }
  }
});

packageNameInput.addEventListener('keyup', (e) => {
  if(e.key === 'Enter') {
    closeAllLists();
    populateVersionSelects();
  } else {
    fetchSuggestions(packageNameInput.value);
  }
});

rawChkBox.addEventListener('click', () => {
  if(npmview || output) {
    if(rawChkBox.checked) {
      versionsDiv.innerText = npmview.toString();
    } else {
      versionsDiv.innerHTML = output;
    }
  }
});

function populateVersionSelects() {
  const packageName = packageNameInput.value;
  if (packageName.length > 0) {
	  while (startVersion.options.length > 0) {
		  startVersion.remove(0);
    }
	  while (finishVersion.options.length > 0) {
		  finishVersion.remove(0);
    }
    window.mycode.getNpmVersions(packageName).then((versions) => {
      let emptyOption = document.createElement('option');
      emptyOption.value = '';
      emptyOption.text = '';
      finishVersion.appendChild(emptyOption);
      for (let v of versions) {
        let option = document.createElement('option');
        option.value = v;
        option.text = v;
        startVersion.appendChild(option);
      }
      for (let v of versions) {
        let option = document.createElement('option');
        option.value = v;
        option.text = v;
        finishVersion.appendChild(option);
      }
    });
  }
}

async function fetchSuggestions(name) {
  let response = await fetch('https://www.npmjs.com/search/suggestions?q=' + name);
  let data = await response.text();
  let suggestions = JSON.parse(data).map((d) => d.name);
  //console.log(suggestions);
  return suggestions;
}


  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  let currentFocus;
  /*execute a function when someone writes in the text field:*/
  packageNameInput.addEventListener("input", async function(e) {
    const arr = await fetchSuggestions(packageNameInput.value);
    if(arr.length === 0) {
      closeAllLists();
    } else {
      console.log(arr);
      let a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      //if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              packageNameInput.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  packageNameInput.addEventListener("keydown", function(e) {
      let x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.key === 'ArrowDown') {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.key === 'ArrowUp') { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.key === 'Enter') {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    let x = document.getElementsByClassName("autocomplete-items");
    for (let i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != packageNameInput) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});