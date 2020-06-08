import interact from 'interactjs';

// ********** helper function to make fundort image cover fullscreen ************************
export var setUpImage = function(slide) {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

    // make the image fill the whole viewport
    slide.style.width = vw*1.05 + "px";
    let slide_rect = slide.getBoundingClientRect();

    if(slide_rect.height < vh){
        slide.style.width = 'auto';
        slide.style.height = vh*1.05 + "px";
        slide_rect = slide.getBoundingClientRect();
    }

    // set up draggable
    const position = { x: -(slide_rect.width - vw) / 2, y: -(slide_rect.height - vh) / 2 }
    slide.style.transform = `translate(${position.x}px, ${position.y}px)`;
    interact(slide).draggable({
        listeners: {
            move (event) {
                position.x += event.dx
                position.y += event.dy

                // clamp position
                position.x = Math.min(Math.max(position.x, vw-slide_rect.width), 0);
                position.y = Math.min(Math.max(position.y, vh-slide_rect.height), 0);

                event.target.style.transform =
                    `translate(${position.x}px, ${position.y}px)`;

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
    return true;
}