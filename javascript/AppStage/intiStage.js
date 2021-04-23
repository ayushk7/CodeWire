export var AppStage = {
    zoomScale: 1.05,
    shapeIsDragging: false,
    shapeTouchingDirection: [],    // can be array of 'top', 'bottom', 'left', 'right'
    getStage: function (width, height, container_name) {
        let stage = new Konva.Stage({
            container: container_name,
            width: width,
            height: height,
        });
        AppStage.zoomScale = 1.05;
        stage.on('wheel', (e) => {
            e.evt.preventDefault();
            var oldScale = stage.scaleX();
            var pointer = stage.getPointerPosition();

            var mousePointTo = {
                x: (pointer.x - stage.x()) / oldScale,
                y: (pointer.y - stage.y()) / oldScale,
            };
            var newScale = oldScale;
            var checkScale = e.evt.deltaY > 0 ? oldScale / AppStage.zoomScale : oldScale * AppStage.zoomScale;
            if (checkScale > 0.15 && checkScale < 1.6) {
                newScale = checkScale;
            }
            // console.log(stage.x() + pointer.x + " " + stage.y() + pointer.y)
            stage.scale({ x: newScale, y: newScale });

            var newPos = {
                x: pointer.x - mousePointTo.x * newScale,
                y: pointer.y - mousePointTo.y * newScale,
            };
            stage.container().style.backgroundSize = `${stage.scaleX() * 100 * 0.5}%`;
            stage.position(newPos);
            stage.batchDraw();
            stage.container().style.backgroundPosition = `${stage.position().x}px ${stage.position().y}px`;
        });
        stage.container().tabIndex = 1;
        stage.container().focus();
        let canDragStage = false;
        stage.container().addEventListener('keydown', e => {
            e.preventDefault();
            if (e.code == 'ShiftLeft')
                canDragStage = true;
        });
        stage.container().addEventListener('keyup', e => {
            e.preventDefault();
            if (e.code == 'ShiftLeft')
                canDragStage = false;
        });
        stage.on('mousedown', function (e) {
            if (e.target === stage && canDragStage) {
                stage.draggable(true);
            }
        });
        stage.on('mouseup', function (e) {
            if (e.target === stage) {
                stage.draggable(false);
                canDragStage = false;
            }
        });
        stage.on('dragmove', (e) => {
            if (e.target == stage) {
                stage.container().style.backgroundPosition = `${stage.position().x}px ${stage.position().y}px`;
            }
        })
        return stage;
    }
}