var childDateNow = 1;
var childDate = getChildDate();

$(document).ready(function(){
    jQuery('.scrollbar-external').scrollbar({
            "autoScrollSize": false,
            "scrolly": $('.external-scroll_y')
    });
    tabSize();
});


$(window).resize(function(){tabSize();});


$('.hButton').first().on('click', function(){
    if(childDateNow > 1){
        wid = getDataPickerUlSize()
        $("#dataPicker ul li").animate({ "left": '+=' + wid}, "fast" );
        childDateNow--;
    }
});

$('.hButton').last().on('click', function(){
    if(childDateNow < childDate-2){
        wid = getDataPickerUlSize()
        $("#dataPicker ul li").animate({ "left": '-=' + wid}, "fast" );
        childDateNow++;
    }
});

function tabSize(){
    var wid = $('#dataPickerContainer ul').css('width');
    wid = parseInt(wid)/3;
    $('#datapickerContainer li').css('min-width', wid);
    $('.firstrow').css('min-width', wid);
    $('.row').css({"width" : wid});
}

function getChildDate(){return parseInt($('#dataPickerContainer ul > li').length);}
function getDataPickerUlSize(){return parseInt($('#dataPicker ul li').css('width'))+3}



