$(document).ready(function() {
  requestJSON(base_url + query_base, function(json) {
    var values = new Array("Drivers over 100");
    var labels = [];
    for(var i=0; i<json.length; i++) {
      if(json[i]["count"] > 9) {
        values.push(parseInt(json[i]["count"]));
      }
      labels.push(' ' + toTitleCase(json[i]["residence_county"]));
    }
    makeCharts({
      bindto: "#chart",
      data: {
              columns: [values],
              type: 'bar'
          },
      legend: {
        hide: true
      },
      axis: {
          x: {
              type: 'category',
              categories: labels,
              tick: {
                centered: true,
                rotate: 65,
                multiline: false
              }
          }
      }
    });
  });
});

// Base URL & query for API calls.
var base_url = 'https://data.ny.gov/resource/whvr-7yjm.json';
var query_base = '?$query=select%20count(*),%20residence_county%20where%20year_of_birth%20<%201916%20and%20status%20=%20%27VALID%27%20and%20license_class%20=%20%27D%27%20and%20privilege%20=%20%27FULL%27%20and%20residence_county%20!=%20%27OUT-OF-STATE%27%20%20group%20by%20residence_county%20order%20by%20count%20desc';

// Get data.
function requestJSON(url, callback) {
  $.ajax({
    url: url,
    dataType: 'json',
    beforeSend: function() {
      $('.alert-warning').removeClass('hide');
    },
    complete: function(xhr, status) {
      $('.alert-warning').addClass('hide');
      $('#about').removeClass('hide');
      if(status != 'success') {
        $('.alert-danger').removeClass('hide');
      }
      else {        
        callback.call(null, xhr.responseJSON);
      }
    }
  });
}

// Generate C3 Chart.
function makeCharts(chart) {
  var chart = c3.generate(chart);
}

// Title case county name
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}