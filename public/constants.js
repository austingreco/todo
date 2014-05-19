var CONSTANTS = {
  SETTINGS: {
    ROUTE: "/settings",
    TEMPLATE: "settings"
  },
  INDEX: {
    ROUTE: "/",
    TEMPLATE: "index"
  }
};

// Helper functions

function getTemplate(route) {
  var keys = Object.keys(CONSTANTS);
  for(var i=0;i<keys.length;i++) {
    var key = keys[i];
    if (CONSTANTS[key].ROUTE == route) {
      return CONSTANTS[key].TEMPLATE;
    }
  }
  return null;
}

if(typeof exports !== 'undefined') {
  exports = module.exports = CONSTANTS;   
}