export var AppStage = {
    zoomScale: 1.05,
    getStage: function (width, height, container_name) {
        let stage = new Konva.Stage({
            container: container_name,
            width: width,
            height: height,
            // draggable: true
        });
        this.zoomScale = 1.05;
        stage.on('wheel', (e) => {
            e.evt.preventDefault();
            var oldScale = stage.scaleX();
            var pointer = stage.getPointerPosition();

            var mousePointTo = {
                x: (pointer.x - stage.x()) / oldScale,
                y: (pointer.y - stage.y()) / oldScale,
            };
            // console.log("pointer: " + pointer.x + " " + pointer.y);
            // console.log(stage);
            // console.log("mousePointTo: " + mousePointTo.x + " " + mousePointTo.y);
            var newScale =
                e.evt.deltaY > 0 ? oldScale / this.zoomScale : oldScale * this.zoomScale;
            // console.log(stage.x() + pointer.x + " " + stage.y() + pointer.y)
            stage.scale({ x: newScale, y: newScale });

            var newPos = {
                x: pointer.x - mousePointTo.x * newScale,
                y: pointer.y - mousePointTo.y * newScale,
            };
            stage.position(newPos);
            stage.batchDraw();
        });
        stage.on('mousedown', function(e){
            if(e.target === stage){
                stage.draggable(true);
            }
        });
        stage.on('mouseup', function(e){
            if(e.target === stage){
                stage.draggable(false);
            }
        });
        return stage;
    }
}