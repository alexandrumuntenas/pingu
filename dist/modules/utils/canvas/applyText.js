function applyText(canvas, text, maxlimit) {
    const finalImageComposition = canvas.getContext('2d');
    let fontSize = maxlimit || 100;
    do {
        finalImageComposition.font = `${(fontSize -= 1)}px "Montserrat SemiBold"`;
    } while (finalImageComposition.measureText(text).width > canvas.width - 125);
    return finalImageComposition.font;
}
export default applyText;
