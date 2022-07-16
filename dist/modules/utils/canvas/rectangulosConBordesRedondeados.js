function rectangulosConBordesRedondeados(canvas, propiedades) {
    propiedades.radius = propiedades.radius || 5;
    canvas.beginPath();
    canvas.moveTo(propiedades.x + propiedades.radius, propiedades.y);
    canvas.lineTo(propiedades.x + propiedades.width - propiedades.radius, propiedades.y);
    canvas.quadraticCurveTo(propiedades.x + propiedades.width, propiedades.y, propiedades.x + propiedades.width, propiedades.y + propiedades.radius);
    canvas.lineTo(propiedades.x + propiedades.width, propiedades.y + propiedades.height - propiedades.radius);
    canvas.quadraticCurveTo(propiedades.x + propiedades.width, propiedades.y + propiedades.height, propiedades.x + propiedades.width - propiedades.radius, propiedades.y + propiedades.height);
    canvas.lineTo(propiedades.x + propiedades.radius, propiedades.y + propiedades.height);
    canvas.quadraticCurveTo(propiedades.x, propiedades.y + propiedades.height, propiedades.x, propiedades.y + propiedades.height - propiedades.radius);
    canvas.lineTo(propiedades.x, propiedades.y + propiedades.radius);
    canvas.quadraticCurveTo(propiedades.x, propiedades.y, propiedades.x + propiedades.radius, propiedades.y);
    canvas.closePath();
    canvas.fill();
}
export default rectangulosConBordesRedondeados;
