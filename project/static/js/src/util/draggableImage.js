import interact from 'interactjs';
import anime from 'animejs';

// ********** helper function to make fundort image cover fullscreen ************************
export var setUpImage = async function (slide) {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    let slide_rect = null;

    slide_rect = slide.getBoundingClientRect();
    
    let factor = vh*1.05 / slide_rect.height;
    let temp_w = slide_rect.width * factor;

    if (temp_w < vw*1.05)
        factor = vw*1.05 / slide_rect.width;
    
    let target_w = slide_rect.width*factor;
    let target_h = slide_rect.height*factor;

    anime({
        targets: slide,
        width: [slide_rect.width, target_w],
        height: [slide_rect.height, target_h],
        duration: 1500,
        easing: 'easeInOutQuad'
    });

    // set up draggable
    const position = { x: -(target_w - vw) / 2 - slide_rect.left, y: -(target_h - vh) / 2 -slide_rect.top}

    await anime({
        targets: slide,
        translateX: [0, position.x],
        translateY: [0, position.y],
        duration: 1500,
        easing: 'easeInOutQuad'
    }).finished;

    interact(slide).draggable({
        listeners: {
            move (event) {
                position.x += event.dx
                position.y += event.dy

                // clamp position
                position.x = Math.min(Math.max(position.x, vw-target_w - slide_rect.left), -slide_rect.left);
                position.y = Math.min(Math.max(position.y, vh-target_h - slide_rect.top), -slide_rect.top);

                event.target.style.transform =
                    `translateX(${position.x}px) translateY(${position.y}px)`;

            }
        },
        inertia: {
            resistance: 5,
            minSpeed: 10,
            smoothEndDuration: 400
        },
        cursorChecker () {
            return null
        }
    })
    return slide_rect;
}