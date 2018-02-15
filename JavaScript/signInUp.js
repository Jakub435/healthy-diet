$('#login-button').on('click', function(){
   $('main section:first-of-type').removeClass('hidden');
});

$('#signup-button').on('click', function(){
   $('main section:last-of-type').removeClass('hidden');
});

$('.login-box div i, .login-box div form a, .login-box input[type=submit]').on('click',function(){
   $('.login-box').addClass('hidden'); 
});

$('#login form a').on('click',function(){
   $('#forget_password').removeClass('hidden'); 
});

$('#regist form a').on('click', function(){
    $('main section:first-of-type').removeClass('hidden');
});