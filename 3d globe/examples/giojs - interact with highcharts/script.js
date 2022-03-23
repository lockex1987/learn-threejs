var lookupData = {
  France: "FR",
  "United States": "US",
  China: "CN",
  Russia: "RU"
};

var importData = [
  {
    name: "France",
    y: 1000000,
    sliced: false,
    selected: false
  },
  {
    name: "United States",
    y: 1100000,
    sliced: false,
    selected: false
  },
  {
    name: "China",
    y: 1000000,
    sliced: true,
    selected: true
  },
  {
    name: "Russia",
    y: 3000000,
    sliced: false,
    selected: false
  }
];

var exportData = [
  {
    name: "France",
    y: 1000000,
    sliced: false,
    selected: false
  },
  {
    name: "United States",
    y: 1000000,
    sliced: false,
    selected: false
  },
  {
    name: "China",
    y: 3100000,
    sliced: true,
    selected: true
  },
  {
    name: "Russia",
    y: 1000000,
    sliced: false,
    selected: false
  }
];

var importChart = createImportChart();
var exportChart = createExportChart();

var container = document.getElementById("globalArea");
var controller = new GIO.Controller(container);

controller.onCountryPicked(onCountryClickedCallback);

controller.configure({
  color: {
    surface: 0x48c12,
    selected: 0xf17f49,
    in: 0x0091ff,
    out: 0xff8000,
    halo: 0x999999
  }
});

controller.addData(data);
controller.init();

function createImportChart() {
  var chart = {
    plotBackgroundColor: "#000000",
    plotBorderWidth: 0,
    plotShadow: false,
    backgroundColor: "#000000"
  };

  var title = {
    text: "Country Import Pie Chart ( click slice ~ )",
    style: {
      color: "#ffffff",
      fontSize: "14px"
    }
  };

  var tooltip = {
    pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
  };

  var plotOptions = {
    pie: {
      allowPointSelect: true,
      cursor: "pointer",
      dataLabels: {
        enabled: true,
        format: "<b>{point.name}%</b>: {point.percentage:.1f} %",
        style: {
          color:
            (Highcharts.theme && Highcharts.theme.contrastTextColor) || "black"
        }
      },
      events: {
        click: function(event) {
          switchClickedCountry(event.point.name);
          updateExportChart(event.point.name);
        }
      }
    }
  };

  var series = [
    {
      type: "pie",
      name: "import percentage",
      slicedOffset: 20,
      data: importData
    }
  ];

  var credits = {
    enabled: false
  };

  var json = {};
  json.chart = chart;
  json.title = title;
  json.tooltip = tooltip;
  json.series = series;
  json.plotOptions = plotOptions;
  json.credits = credits;

  return Highcharts.chart("importChartArea", json);
}

function createExportChart() {
  var chart = {
    plotBackgroundColor: "#000000",
    plotBorderWidth: 0,
    plotShadow: false,
    backgroundColor: "#000000"
  };

  var title = {
    text: "Country Export Pie Chart ( click slice ~ )",
    style: {
      color: "#ffffff",
      fontSize: "14px"
    }
  };

  var tooltip = {
    pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
  };

  var plotOptions = {
    pie: {
      allowPointSelect: true,
      cursor: "pointer",
      dataLabels: {
        enabled: true,
        format: "<b>{point.name}%</b>: {point.percentage:.1f} %",
        style: {
          color:
            (Highcharts.theme && Highcharts.theme.contrastTextColor) || "black"
        }
      },
      events: {
        click: function(event) {
          switchClickedCountry(event.point.name);
          updateImportChart(event.point.name);
        }
      }
    }
  };

  var series = [
    {
      type: "pie",
      name: "export percentage",
      slicedOffset: 20,
      data: exportData
    }
  ];

  var credits = {
    enabled: false
  };

  var json = {};
  json.chart = chart;
  json.title = title;
  json.tooltip = tooltip;
  json.series = series;
  json.plotOptions = plotOptions;
  json.credits = credits;

  return Highcharts.chart("exportChartArea", json);
}

function switchClickedCountry(countryName) {
  var abbr = lookupData[countryName];
  controller.switchCountry(abbr);
}

function onCountryClickedCallback(clickedCountry) {
  for (var countryName in lookupData) {
    if (lookupData[countryName] === clickedCountry.ISOCode) {
      updateImportChart(countryName);
      updateExportChart(countryName);

      return;
    }
  }

  updateImportChart();
  updateExportChart();
}

function updateImportChart(countryName) {
  for (var i in importData) {
    var data = importData[i];
    if (data.name === countryName) {
      data.sliced = true;
      data.selected = true;
    } else {
      data.sliced = false;
      data.selected = false;
    }
  }

  importChart.series[0].setData(JSON.parse(JSON.stringify(importData)));
}

function updateExportChart(countryName) {
  for (var i in exportData) {
    var data = exportData[i];
    if (data.name === countryName) {
      data.sliced = true;
      data.selected = true;
    } else {
      data.sliced = false;
      data.selected = false;
    }
  }

  exportChart.series[0].setData(JSON.parse(JSON.stringify(exportData)));
}