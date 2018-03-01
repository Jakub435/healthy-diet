var childDateNow = 1;
var childDate = getChildDate();
var time = new Date();
createColumn(10);

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
    wid = 6 + parseInt(wid)/3;
    $('#datapickerContainer li').css('min-width', wid);
    $('.firstrow').css('min-width', wid);
    $('.row').css({"width" : wid});
}

function getChildDate(){return parseInt($('#dataPickerContainer ul > li').length);}
function getDataPickerUlSize(){return parseInt($('#dataPicker ul li').css('width'))+3}

$('.scrollbar-external div').draggable({
    cancel: "a.ui-icon",
    appendTo: "#dataPickerContainer",
    revert: "invalid", 
    containment: "window",
    scroll: false,
    cursor: "move",
    cursorAt: { top: 50, left: 75 },
    helper: function( event ) {
        return $("<div class='helper font'>"+$(this).children('h4').text()+"</div>");
      }
});

$('.row').droppable({
    classes:{"ui-droppable-active": "custom-state-active"},
    drop: function(event, ui){
        var name = $(ui.draggable).children('h4').text();
        $(this).html("<h4>" + name + "</h4>");
    }
});

function createColumn(count){
    var dayName = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
    for(i=0;i < count;i++){    
        var month = time.getMonth() + 1;
        
        if(month<10){month = "0" + month;}
        
        var today = time.getDate() + "-" + month;
        
        var liHtml = "<li class='column'><div class='firstrow'><h4>" + dayName[time.getDay()] + "</br>" + today + "</h4></div><div class='row'><h4>Śniadanie</h4></div><div class='row'><h4>II Śniadanie</h4></div><div class='row'><h4>Obiad</h4></div><div class='row'><h4>Podwieczorek</h4></div><div class='row'><h4>kolacja</h4></div></li>"
        
        $('#dataPickerContainer ul').append(liHtml);
        time.setDate(time.getDate() + 1);

    }
    childDate = getChildDate();
}

Date.prototype.addDays = function(days) {
  var dat = new Date(this.valueOf());
  dat.setDate(dat.getDate() + days);
  return dat;
}