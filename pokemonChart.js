


function createPokemonChart(ctx, labels, data) {
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Base Stats",
          data: data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.8)",
            "rgba(255, 159, 64, 0.8)",
            "rgba(255, 205, 86, 0.8)",
            "rgba(75, 192, 192, 0.8)",
            "rgba(54, 162, 235, 0.8)",
            "rgba(153, 102, 255, 0.8)",
            "rgba(201, 203, 207, 0.8)",
          ],
          // borderColor: colors[type],
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: "y",
      scales: {
        x: {
          display: false,
        },
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
