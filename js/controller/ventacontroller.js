let idVentaGeneral = 0;

window.addEventListener('load', (e)=>{
    cargarDashboard();
})

function cargarDashboard(){
    const iframe = document.createElement('iframe');
    iframe.src = 'https://app.powerbi.com/view?r=eyJrIjoiNDA4ZjhmZDctZTAyYy00OTc0LTlmZWQtN2IwMjg0YTRhYWQyIiwidCI6ImM0YTY2YzM0LTJiYjctNDUxZi04YmUxLWIyYzI2YTQzMDE1OCIsImMiOjR9';
    const contenedor = document.getElementById('dashboardVenta');
    contenedor.appendChild(iframe);
}