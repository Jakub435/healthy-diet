var childMeal = 1;
var childDate = getChildDate();
var childDateNow = 1;

$(document).ready(function(){
    tabSize();
});

$(window).resize(function(){
    tabSize();
});

//Recipes 
$('.vButton').last().on('click',function(event){
    if(childMeal<5){
        $('#container div:nth-child(' + childMeal + ')').slideUp();
        $('#container div:nth-child(' + (childMeal + 1) + ')').slideDown();
        childMeal++;
        $('html, body').animate({scrollTop:$('.vButton').last().position().top}, 'slow');
        
    }
});

$('.vButton').first().on('click',function(){
    if(childMeal>1){
        $('#container div:nth-child(' + (childMeal - 1) + ')').slideDown();
        $('#container div:nth-child(' + childMeal + ')').slideUp();
        childMeal--;
    }
});


//DataPicker
$('.hButton').first().on('click', function(){
    if(childDateNow > 1){
        wid = $('#dataPicker ul li').css('width');
        wid = parseInt(wid) + 4;
        $("#dataPicker ul li").animate({ "left": '+=' + wid}, "fast" );
        childDateNow--;
    }
});

$('.hButton').last().on('click', function(){
    if(childDateNow < childDate-3){
        wid = $('#dataPicker ul li').css('width');
        wid = parseInt(wid) + 4;
        $("#dataPicker ul li").animate({ "left": '-=' + wid}, "fast" );
        childDateNow++;
    }
});

function tabSize(){
    var wid = $('#dataPicker').children('ul').css('width');
    wid = parseInt(wid)/4 - 4;
    $('#datapicker li').css('min-width', wid);
}

function getChildDate(){return parseInt($('#dataPicker ul > li').length);} 