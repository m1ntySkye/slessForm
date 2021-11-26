
let sless_form_glob = {
	base_url:"20615833.hs-sites.com",
	sless_endpoint:"/_hcms/api/test_submit",
	form_fields:{
		"name":"text",
		"field1":"text",
		"field2":"number",
	}
};

document.forms.mainForm.onsubmit = async (event) => {
	event.preventDefault();
	let formData = new FormData(document.forms.mainForm);

  console.log(formData);

  let options = {
		method: 'POST',
		headers:{
			"content-type" : "application/json",
      "accept" : "application/json"
		},
		body: jsonifyForm(formData)
  }
  console.log(options);
  
  let responseTgt = document.querySelector("p#responseTgt");
  let resultTgt = document.querySelector("p#resultTgt");
  // let resultTgt = document.querySelector("#resultTgt.table");
  let errorTgt = document.querySelector("#errorTgt");

  let response = await fetch('/_hcms/api/test_submit', options);
  responseTgt.textContent = 'resp'+JSON.stringify(response);

  if (response.ok) {
    let responseBody = await response.json();
    console.log(JSON.stringify(response, null, 2));
    console.log(JSON.stringify(responseBody, null, 2));
    // our out table is 'div.table#resultTgt table'
    appendRows('div.table#resultTgt table', null, responseBody);
    // resultTgt.textContent = JSON.stringify(responseBody);

  }else{

    console.log(JSON.stringify(response, null, 2));
    errorTgt.textContent = response.status;

  }
}

/**
 * https://stackoverflow.com/a/46774073
 * FormData to serialisable json.
 * @param {FormData} formData 
 * @returns {Object} form name-value pairs
 */
function jsonifyForm(formData){
  var object = {};
  formData.forEach((value, key) => {
      // Reflect.has in favor of: object.hasOwnProperty(key)
      if(!Reflect.has(object, key)){
          object[key] = value;
          return;
      }
      if(!Array.isArray(object[key])){
          object[key] = [object[key]];    
      }
      object[key].push(value);
  });
  return JSON.stringify(object);
}

// function buildTableForm(targetSelector, db_def){
//   let table = document.createElement("table");
//   let table_head = document.createElement("tr");
//   let table_body = document.createElement("tr");
//   db_def.columns.forEach(col => {
//     let colHeader = document.createElement("th");
//     let chl = document.createElement("label");
//     let colData = document.createElement("td");
//     let cdi = document.createElement("input",);
//     chl.innerText = col.label;
//     chl.setAttribute("for", col.name);
//     // chl.innerText = col.label;
//     cdi.setAttribute("name", col.name);
//     cdi.setAttribute("type", col.type.toLowerCase());
//     colHeader.appendChild(chl);
//     colData.appendChild(cdi);
//     table_head.appendChild(colHeader);
//     table_body.appendChild(colData);
//   });
//   table.appendChild(table_head);
//   table.appendChild(table_body);
//   document.querySelector(targetSelector).appendChild(table);
//   return table;
// }
/**
 * assumes the targetselector refers to the same element 
 * that was passed to buildTableForm
 * @param {String} targetSelector css selector
 * @param {Object} db_def table definition atained by 
 *                        parsing a hubdb table GET json
 * @param {Object} row_data parsed result of hubdb rows GET json
 */
function appendRows(targetSelector, db_def, rows_data){
  let tbody = document.querySelector(`${targetSelector}`).querySelector("tbody");
  rows_data.results.forEach(row=>{
    let nrow = table_body = document.createElement("tr");
    row.values.forEach(val => {
      let ndat = document.createElement("td");
      ndat.innerText = val
      nrow.appendChild(ndat);
    });
    tbody.appendChild(nrow);
  });
}

(()=>{
  // on document load: get data from sless
  
  let requestOptions = {
    method: 'POST',
    headers: {
      "content-type" : "application/json"
    },
    body:JSON.stringify({
      'par1':'hello',
      'intpar':15.54
    })
  };
  
  // let responseTgt = document.querySelector("p#responseTgt");
  // console.log(responseTgt);
  // let resultTgt = document.querySelector("p#resultTgt");
  // console.log(resultTgt);
  // let errorTgt = document.querySelector("p#errorTgt");
  // console.log(errorTgt);
  
  // fetch("https://20615833.hs-sites.com/_hcms/api/test_submit", requestOptions)
  //   .then(response => {
  //     let responseText = response.text();
  //     console.log(responseText);
  //     responseTgt.textContent = JSON.stringify(responseText);
  //   }).then(result => {
  //     console.log(result);
  //     resultTgt.textContent = JSON.stringify(result);
  //   })
  //   .catch(error => {
  //     console.log('error', error);
  //     errorTgt.textContent = JSON.stringify(error);
  //   });
})();