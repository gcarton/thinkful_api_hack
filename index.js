
var place_types=["art_gallery","beauty_salon","bakery","bar","book_store","cafe","casino","dentist","department_store","doctor","florist","gym","lodging","laundry","police","liquor_store","meal_delivery","meal_takeaway","museum","night_club","park","post_office","restaurant","spa"];
var types =new Array();
let main_array=[];
let user_clicked= false;

//startApp initialises the app using a listener on the "Lets go!" button on the landing page. Upon hearing the clcik it toggles 
//on and off various divs, clears the HTML from some divs and also runs the "renderTyes" function
function startApp(){
  $(".init_app").click(function(){
    user_clicked=true;
    $('.js_submit_type').toggle();
    $('.sub_head').hide();
    renderTypes();
    console.log('listener ran')
    $('.js_types input[type="checkbox"]:checked').each(function(){$(this).click()});
    $(".init_app").hide();
    $('.question').toggle();
    $('.gamble').hide();
    $('.amenities').hide();
    $('.report_div').hide();
    $('.js_types').show();
    $('.js_display_div').hide();
    console.log('line 27');
    $('.js_display_div').html('');
    types =new Array();
  })}

//render types populates all the predetermined place types with a checkbox
  function renderTypes(){
    for(var i=0;i<place_types.length;i++){
     $(".js_types").append(`<input type="checkbox" name="checkbox_input${place_types[i]}" value="${place_types[i]}" class="js_submit_type">
    <label for="google_place_types" class="js_type">${place_types[i].replace('_',' ')}</label><br>`)
    console.log('render types ran');
   }
 }

//listenTypeSubmit listens for a click on the "submit button", hides and shows various div's.. moves on to the destination enter page.
function listenTypeSubmit(){
  console.log('listenTypeSubmit ran');
  $(".js_submit_type").submit(event=>{
    event.preventDefault();
    $('.js_types input[type="checkbox"]:checked').each(function(){
      types.push($(this).attr("value"));
      console.log('listenTypeSubmit ran');
      console.log(types);

      $(".js_submit_type").hide();
      $('.js_submit_form').show();
      $('.init_app').hide();
      $('.question').hide();
      listenSubmit();
    });
});
}

//listen submint listens for the entering of the destination, passes the destination to geocoder
function listenSubmit(){
    console.log('listenSubmit ran');
  $('.js_submit_form').submit(event=> {
    event.preventDefault();
    const queryTarget= $(event.currentTarget).find('.address_query_input');
    const query=queryTarget.val();
    $('.js_display_div').show();
    $('.js_submit_form').hide();
    queryTarget.val("");
    console.log('listenSubmit ran');
    getGeoCode(query);
    console.log(query);
  })
}


//geoCoder finds the geocode of the  destination and passes the latlng to the newMap function
function getGeoCode(query){
  var geocoder= new google.maps.Geocoder();
  geocoder.geocode({address:query}, function(results,status){
    if (results.length){
  var latlng=results[0].geometry.location;
  newMap(latlng);
}})
}

//createresults populates the requested results(results@i) into the your results div
function createResults(results){
  console.log('createResults ran');
  let jsonresults = results;
  let returned_types= results.types;
  let photo_ref=jsonresults.photos[0].getUrl({'maxWidth': 100});
  $('.js_display_div').append(`<div class="col-3 js_your_results" href="${jsonresults.icon}">
    <h1 class="type_place"></h1>
    <h2 class="js_name">${jsonresults.name}</h2>
    <a class="js_more_info" href="https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${jsonresults.place_id}">More Information</a>
      <img class="google_img" src="${photo_ref}">

    </div>
    `);
  }

//find diff consolidates all the matched types on used results on the callBack, into one array. Then compares 
//them to the original types selects and removes the types in the consolidated array from the original array, 
//thus returning what hasnt been found

function findDiff(results){
  console.log('findDiff ran');
  main_array.push(results.types);
  let main_array_merged =[].concat.apply([], main_array);
  let mapObj={};
  console.log(main_array_merged);

  for (let i=0;i<types.length;i++)
    {mapObj[types[i]]='true'}

  main_array_merged.forEach(function(itm){
    delete mapObj[itm];
      })
    console.log(mapObj);
    console.log('final mapObj:',mapObj);
    let report_contents=Object.keys(mapObj);
    console.log(Object.keys(mapObj));
    reportResults(report_contents);
}

  function reportResults(report_contents){
    if(!user_clicked){
      return
  }
  $('.report_div').show();
  console.log(report_contents);
  if(report_contents==""){
  $('.report_div').html(`<h3>All your amenities have been located- See below</h3><button type="button" class="init_app">New Search</button>`);
  }
  else{
  $('.report_div').html(`<h3>The following amenities have not been located: ${report_contents}</h3><button type="button" class="init_app">New Search</button>`);
  }
  $(".js_types").empty();
  startApp();

}

  function handleMap(){
    listenTypeSubmit();
  }
  //https://maps.googleapis.com/maps/api/place/details/json?placeid=${jsonresults.place_id}&key=AIzaSyBZ7m7GCdTNU6w7AT_IfdAtJh8xu41dCUw.results.website
  // "https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${jsonresults.getUrl}"
      // <h3 class="js_vicinity">${jsonresults.vicinity}</h3>
      // .replace(/_/g,' ')
$(handleMap);