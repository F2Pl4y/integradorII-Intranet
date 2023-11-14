let idVentaGeneral = 0;

window.addEventListener('load', (e) => {
    cargarDashboard();
})

function cargarDashboard() {
    const iframe = document.createElement('iframe');
    // iframe.src = 'https://app.powerbi.com/view?r=eyJrIjoiMGQ5YzZmMzAtNDRkNS00YzcxLWE0N2EtZWE2OGQ1MDcwNGUzIiwidCI6ImM0YTY2YzM0LTJiYjctNDUxZi04YmUxLWIyYzI2YTQzMDE1OCIsImMiOjR9';
    iframe.src = 'https://app.powerbi.com/view?r=eyJrIjoiZTBkM2E4OGUtZTFhYi00ZDM5LWEwN2YtNzg0YTc0Yjc1ZjkwIiwidCI6ImM0YTY2YzM0LTJiYjctNDUxZi04YmUxLWIyYzI2YTQzMDE1OCIsImMiOjR9';
    const contenedor = document.getElementById('dashboardVenta');
    contenedor.appendChild(iframe);
}