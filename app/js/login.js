var authorizationToken = getSysauthFromCookie(document.cookie);

var submitRequest = function(data, successCallback, errorCallback){
  $.ajax({
    type: "POST",
    url: "http://192.168.1.1/cgi-bin/luci/rpc/auth",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(data),
    success: successCallback,
    error: errorCallback
  });
};

var submitLogin = function() {
  var username = $('#username');
  var form =     $('form');
  var password = $('#password');
  var usernameError = $("#usernameError");
  var passwordError = $("#passwordError");
  var genericError =  $('#genericError');


  form.submit(function(event) {
    event.preventDefault();
    usernameError.hide();
    passwordError.hide();
    genericError.hide();
    username.removeClass('error');
    password.removeClass('error');

    checkEmptyField(username, usernameError, "username");
    checkEmptyField(password, passwordError, "password");

    var data =  { "jsonrpc": "2.0", "method": "login", "params": [username.val(), password.val()], "id": 1 }
    var successCallback = function(response) {
      if(response.result == null){
           genericError.html("Username/password is incorrect");
           genericError.show();
           return;
        }
        redirectTo("changePassword.html");
    };
    var errorCallback = function(errorType, errorMessage) {
      genericError.html('Error: ' + errorType + ': Message : ' + errorMessage);
      genericError.show();
    };
    submitRequest(data, successCallback, errorCallback);
  });
};

var checkEmptyField = function(field, errorField, fieldName) {
  if(isEmpty(field.val())) {
      field.addClass('error');
      errorField.html("Please enter a " + fieldName + "!");
      errorField.show();
      field.focus();
      return;
    }
}

function getSysauthFromCookie(cookieString) {
  var sysauthPairs = cookieString.split(";");
  var lastCookieValue = sysauthPairs[sysauthPairs.length - 1].split("=");
  return lastCookieValue[1];
};

function redirectTo(url) { window.location.href = url; }
function isEmpty(value) { return !value || value.length === 0 || value == " " }


$(function() {
  submitLogin();
});
