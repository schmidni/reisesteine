
export function outerSize (el, dim) {
    var style = getComputedStyle(el);
    var size = 0;
    if (dim == 'width')
        size += el.offsetWidth + parseInt(style.marginLeft) + parseInt(style.marginRight);
    else if (dim == 'height')
        size += el.offsetHeight + parseInt(style.marginTop) + parseInt(style.marginBottom);
    return size;
}