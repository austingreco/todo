var CLASSES = {
  NOTIFICATION: ".notification"
};

function bind() {
  $('form input[type="submit"]').click(function(event) {
    event.preventDefault();
    $(this).parent().ajaxSubmit(function() {
      $(CLASSES.NOTIFICATION).show();
      setTimeout(function() {
        $(CLASSES.NOTIFICATION).hide()
      }, 1000);
    });
  });

  $('a').click(function(event) {
    event.preventDefault();
  });
}

var app = Davis(function () {
  var i, keys = Object.keys(CONSTANTS);
  var length = keys.length;
  for(i=0;i<length;i++) {
    var key = keys[i];
    this.get(CONSTANTS[key].ROUTE, function (req) {
      $.ajax({
         type:'GET',
         headers: { 'content-type': 'application/json' },
         url:req.path,
         dataType:'json',
         success:function(response) {
            var template = getTemplate(req.path);
            if (template) {
              $("body").html(jade.render(template, {data : response }));
              bind();
            } else {
              alert("Can't find template for route: " + req.path);
            }
         }
        });
    });
  }
});

$(function() {
  bind();
});