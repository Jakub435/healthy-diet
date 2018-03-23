google.charts.load('current', {'packages':['line']});
google.charts.setOnLoadCallback(drawChart);

    function drawChart() {

      var data = new google.visualization.DataTable();
      data.addColumn('date', 'Data');
      data.addColumn('number', 'Waga');
      data.addColumn('number', 'Zawartość procentowa tłuszczu');
      data.addColumn('number', 'Biceps');
      data.addColumn('number', 'Przedramie');
      data.addColumn('number', 'Klatka piersiowa');
      data.addColumn('number', 'Talia/Pas');
      data.addColumn('number', 'Biodra');
      data.addColumn('number', 'Uda');
      data.addColumn('number', 'Łydka');

      //get data from server
      $.ajax({
          type:'get',
          url:'showProgress/userprogress',
          dataType:'json',
          success:function(userProgress){
              var segregateData = [];
              for(i in userProgress){
                  var date = userProgress[i].date.split('-');
                  segregateData[i]=[
                      new Date(date[0],date[1]-1,date[2]),
                      userProgress[i].weight,
                      userProgress[i].bf,
                      userProgress[i].biceps,
                      userProgress[i].forearm,
                      userProgress[i].chest,
                      userProgress[i].waist,
                      userProgress[i].hip,
                      userProgress[i].thigh,
                      userProgress[i].calf
                  ];
            }
            data.addRows(segregateData);
        }
      }).then(function(){
          var options = {
              chart: {
                  title: 'Moje postępy:',
              },
              hAxis: { format: 'dd-MM-yyyy' },
              backgroundColor: { fill:'transparent' }
          };

          var chart = new google.charts.Line(document.getElementById('graph'));

          chart.draw(data, google.charts.Line.convertOptions(options));

      });

    }
