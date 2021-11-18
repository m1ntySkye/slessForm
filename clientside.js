let sless_form_glob = {
	base_url:"20615833.hs-sites.com",
	sless_endpoint:"/_hcms/api/test_submit",
	form_fields:{
		"testField1":"text",
		"testField2":"text"
	}
};

document.forms.mainForm.onsubmit = async (event) => {
	event.preventDefault();

	let formData = new FormData(event.target);

  console.log(formData)

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
  let errorTgt = document.querySelector("p#errorTgt");
  
  let response = await fetch('/_hcms/api/test_submit', options);
  responseTgt.textContent = JSON.stringify(response);

  if (response.ok) {

    let responseBody = await response.json();
    console.log(responseBody);
    resultTgt.textContent = JSON.stringify(responseBody);

  }else{

    console.log(response);
    errorTgt.textContent = response.status;

  }

  
  // fetch("https://20615833.hs-sites.com/_hcms/api/test_submit", options)
  //   .then(response => {
  //     let responseJson = response.text();
  //     console.log(responseJson);
  //     responseTgt.textContent = "response"+responseJson;
  //   }).then(result => {
  //     let resultJson = result.text();
  //     console.log(resultJson);
  //     resultTgt.textContent = "result"+resultJson;
  //   })
  //   .catch(error => {
  //     console.log('error', error);
  //     errorTgt.textContent = JSON.stringify(error);
  //   });
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