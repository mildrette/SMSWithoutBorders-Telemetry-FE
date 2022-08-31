// Load google API
google.charts.load("current", {
  packages: ["corechart"],
});

function fetchData(
  url,
  category,
  start_month,
  end_month,
  start_date,
  end_date,
  table_data,
  table_head,
  type
) {
  let xhttp = new XMLHttpRequest();

  // Make AJAX call
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let entry = JSON.parse(this.responseText);

      run(
        entry,
        category,
        start_month,
        end_month,
        start_date,
        end_date,
        table_data,
        table_head,
        type
      );
    }
  };

  xhttp.open("GET", url, true);
  xhttp.send();
}

function filter_months(entry, start_month, end_month, type) {
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let filter_data = [];

  entry.forEach((element) => {
    let search_month = new Date(element.date).toLocaleDateString()
    let start_month_modified = new Date(start_month).toLocaleDateString()
    let end_month_modified = new Date(new Date(end_month).getFullYear(), new Date(end_month).getMonth() + 1, 0).toLocaleDateString()

    if (
      new Date(search_month) >= new Date(start_month_modified) &&
      new Date(search_month) <= new Date(end_month_modified) &&
      element.type == type
    ) {
      filter_data.push(month[new Date(element.date).getMonth()]);
    }
  });

  let data = {};

  filter_data.forEach((element) => {
    data[element] = (data[element] || 0) + 1;
  });

  let result = Object.keys(data).map((key) => {
    return [key, data[key]];
  });

  return result;
}

function filter_days(entry, start_date, end_date, type) {
  let filter_data = [];

  entry.forEach((element) => {
    let search_date = new Date(element.date).toLocaleDateString()
    let start_date_modified = new Date(start_date).toLocaleDateString()
    let end_date_modified = new Date(end_date).toLocaleDateString()

    if (
      new Date(search_date) >= new Date(start_date_modified) &&
      new Date(search_date) <= new Date(end_date_modified) &&
      element.type == type
    ) {
      filter_data.push(new Date(element.date).toDateString());
    }
  });
  let data = {};

  filter_data.forEach((element) => {
    data[element] = (data[element] || 0) + 1;
  });

  let result = Object.keys(data).map((key) => {
    return [key, data[key]];
  });

  return result;
}

function filter(
  entry,
  category,
  start_month,
  end_month,
  type,
  start_date,
  end_date
) {
  if (category == "months") {
    return filter_months(entry, start_month, end_month, type);
  } else if (category == "days") {
    return filter_days(entry, start_date, end_date, type);
  }
}

function line(data) {
  if (data.length < 2) {
    document.getElementById("line_div").innerHTML = `<h5 class="text-danger text-center ">Sorry No Data To Display!</h5>`
  } else {
    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      var result = google.visualization.arrayToDataTable(data);

      // Set chart options
      var options = {
        vAxis: {
          title: data[0][1],
          format: "0",
          minValue: 0,
        },
        hAxis: {
          title: data[0][0],
        },
        title: "SWOB Metrics",
        height: 250,
      };

      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.LineChart(
        document.getElementById("line_div")
      );

      chart.draw(result, options);
    }
  }
}

function bar(data) {
  if (data.length < 2) {
    document.getElementById("bar_div").innerHTML = `<h5 class="text-danger text-center ">Sorry No Data To Display!</h5>`
  } else {
    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      var result = google.visualization.arrayToDataTable(data);

      // Set chart options
      var options = {
        vAxis: {
          title: data[0][1],
          format: "0",
          minValue: 0,
        },
        hAxis: {
          title: data[0][0],
        },
        title: "SWOB Metrics",
        height: 250,
      };

      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.BarChart(
        document.getElementById("bar_div")
      );

      chart.draw(result, options);
    }
  }
}

function run(
  data,
  category,
  start_month,
  end_month,
  start_date,
  end_date,
  table_data,
  table_head,
  type
) {
  let headers = [category.toUpperCase(), type.toUpperCase()];
  let filter_data = filter(
    data,
    category,
    start_month,
    end_month,
    type,
    start_date,
    end_date
  );

  // table
  table_head.innerHTML = `<tr><th scope="col">${headers[0]}</th><th scope="col">${headers[1]}</th></tr>`;
  table_data.innerHTML = "";

  filter_data.forEach((item) => {
    table_data.innerHTML += `<tr><td>${item[0]}</td><td>${item[1]}</td></tr>`;
  });

  filter_data.unshift(headers);

  line(filter_data);
  bar(filter_data);
}