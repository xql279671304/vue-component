var document = window.document,
    support = {
        transform3d: ("WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix()),
        touch: ("ontouchstart" in window)
    };

function getTranslate(x, y) {
    var distX = x,
        distY = y;
    return support.transform3d ? "translate3d(" + distX + "px, " + distY + "px, 0)" : "translate(" + distX + "px, " + distY + "px)";
}

function getPage(event, page) {
    return support.touch ? event.changedTouches[0][page] : event[page];
}

var ImagesZoom = function() {};

ImagesZoom.prototype = {
    // 给初始化数据
    init: function(param) {
        var self = this,
            params = param || {};

        var zoomImg = params.elem;
        var cropBtn = document.querySelector('.crop-btn .sure-crop');

        self.element = zoomImg;
        self.elemCanvas = params.elemCanvas;
        self.sourceImgCanvasFn = params.sourceImgCanvasFn;
        self.imgType = params.imgType ? params.imgType : 'image/jpeg';

        self.buffMove = 3; //缓冲系数
        self.buffScale = 2; //放大系数
        self.finger = false; //触摸手指的状态 false：单手指 true：多手指

        self._destroy();

        cropBtn.addEventListener('click', function() {
            if (!self.crop) return;
            self.drawCanvas();
            params.cropper(self);
        });

        zoomImg.onload = function() {
            //压缩图片
            self.compress();
            //裁剪尺寸
            self.cropSize({
                ratio: params.ratio
            });
        };
    },
    initEvent: function() {
        // 添加监听事件
        let zoomImg = this.element;
        let self = this;
        zoomImg.onload = function() {
            let eleW = zoomImg.width;
            let eleH = zoomImg.height;
            self.imgBaseWidth = zoomImg.offsetWidth;
            self.imgBaseHeight = zoomImg.offsetHeight;
            zoomImg.style.cssText = "margin-top:-" + (zoomImg.offsetHeight / 2) + "px";

            self.addEventStart({
                wrapX: self.crop.w,
                wrapY: self.crop.h,
                mapX: eleW,
                mapY: eleH
            });
        }
    },
    addEventStart: function(param) {
        var self = this,
            params = param || {};

        //config set
        self.wrapX = params.wrapX || 0; //可视区域宽度
        self.wrapY = params.wrapY || 0; //可视区域高度
        self.mapX = params.mapX || 0; //地图宽度
        self.mapY = params.mapY || 0; //地图高度

        self.outDistY = (self.mapY - self.wrapY) / 2; //图片超过一屏的时候有用

        self.width = self.mapX - self.wrapX; //地图的宽度减去可视区域的宽度
        self.height = self.mapY - self.wrapY; //地图的高度减去可视区域的高度

        self.element.addEventListener("touchstart", function(e) {
            self._touchstart(e);
        }, false);
        self.element.addEventListener("touchmove", function(e) {
            self._touchmove(e);
        }, false);
        self.element.addEventListener("touchend", function(e) {
            self._touchend(e);
        }, false);
    },
    // 重置坐标数据
    _destroy: function() {
        this.distX = 0;
        this.distY = 0;
        this.newX = 0;
        this.newY = 0;
    },
    // 更新地图信息
    _changeData: function() {
        this.mapX = this.element.offsetWidth; //地图宽度
        this.mapY = this.element.offsetHeight; //地图高度
        // this.outDistY = (this.mapY - this.wrapY)/2; //当图片高度超过屏幕的高度时候。图片是垂直居中的，这时移动有个高度做为缓冲带
        this.width = this.mapX - this.wrapX; //地图的宽度减去可视区域的宽度
        this.height = this.mapY - this.wrapY; //地图的高度减去可视区域的高度
    },
    _touchstart: function(e) {
        var self = this;

        e.preventDefault();

        var touchTarget = e.targetTouches.length; //获得触控点数

        self._changeData(); //重新初始化图片、可视区域数据，由于放大会产生新的计算

        if (touchTarget == 1) {
            // 获取开始坐标
            self.basePageX = getPage(e, "pageX");
            self.basePageY = getPage(e, "pageY");

            self.finger = false;
        } else {
            self.finger = true;

            self.startFingerDist = self.getTouchDist(e).dist;
            self.startFingerX = self.getTouchDist(e).x;
            self.startFingerY = self.getTouchDist(e).y;
        }
        console.log("pageX: " + getPage(e, "pageX"));
        console.log("pageY: " + getPage(e, "pageY"));
    },
    _touchmove: function(e) {
        var self = this;

        e.preventDefault();
        e.stopPropagation();

        console.log("event.changedTouches[0].pageY: " + event.changedTouches[0].pageY);

        var touchTarget = e.targetTouches.length; //获得触控点数

        if (touchTarget == 1 && !self.finger) {
            self._move(e);
        }

        if (touchTarget >= 2) {
            self._zoom(e);
        }
    },
    _touchend: function(e) {
        var self = this;

        self._changeData(); //重新计算数据
        if (self.finger) {
            self.distX = -self.imgNewX;
            self.distY = -self.imgNewY;
        }
        console.log(self.width)
        console.log(this.crop.l)
        console.log(self.distX)
        if (self.distX > this.crop.l) {
            self.newX = this.crop.l;
        } else if (self.distX <= this.crop.l && self.distX >= -self.width + this.crop.l) {
            self.newX = self.distX;
        } else if (self.distX < -self.width + this.crop.l) {
            self.newX = -self.width + this.crop.l;
        }
		console.log(self.newX)
        this.addNode('newX:' + self.newX + '；newY' + self.newY);
        self.reset();
    },
    _move: function(e) {
        var self = this,
            pageX = getPage(e, "pageX"), //获取移动坐标
            pageY = getPage(e, "pageY");

        // 禁止默认事件
        // e.preventDefault();
        // e.stopPropagation();

        // 获得移动距离
        self.distX = (pageX - self.basePageX) + self.newX;
        self.distY = (pageY - self.basePageY) + self.newY;

        if (self.distX > this.crop.l) {
            self.moveX = Math.round(self.distX / self.buffMove);
        } else if (self.distX <= this.crop.l && self.distX >= -self.width + this.crop.l) {
            self.moveX = self.distX;
        } else if (self.distX < -self.width + this.crop.l) {
            self.moveX = -self.width + Math.round((self.distX + self.width) / self.buffMove);
        }
        self.movePos();
        self.finger = false;
    },
    // 图片缩放
    _zoom: function(e) {
        var self = this;
        // e.preventDefault();
        // e.stopPropagation();

        var nowFingerDist = self.getTouchDist(e).dist, //获得当前长度
            ratio = nowFingerDist / self.startFingerDist, //计算缩放比
            imgWidth = Math.round(self.mapX * ratio), //计算图片宽度
            imgHeight = Math.round(self.mapY * ratio); //计算图片高度

        // 计算图片新的坐标
        self.imgNewX = Math.round(self.startFingerX * ratio - self.startFingerX - self.newX * ratio);
        self.imgNewY = Math.round((self.startFingerY * ratio - self.startFingerY) / 2 - self.newY * ratio);

        if (imgWidth >= self.crop.w) {
            self.element.style.width = imgWidth + "px";
            self.refresh(-self.imgNewX, -self.imgNewY, "0s", "ease");
            self.finger = true;
        } else {
            if (imgWidth < self.crop.w) {
                self.element.style.width = self.crop.w + "px";
            }
        }
        self.finger = true;
    },
    // 移动坐标
    movePos: function() {
        var self = this;
        self.moveY = self.distY;
        self.refresh(self.moveX, self.moveY, "0s", "ease");
    },
    // 重置数据
    reset: function() {
        var self = this,
            hideTime = ".2s";
        var t = self.crop.t - self.element.offsetTop;
        if (self.distY > t) {
            self.newY = t;
        } else if (self.distY <= t && self.distY >= 0) {
            self.newY = self.distY;
        } else if (self.distY < 0 && self.distY > -self.element.height + t + self.crop.h) {
            self.newY = self.distY;
        } else if (self.distY < -self.element.height + t + self.crop.h) {
            self.newY = -self.element.height + t + self.crop.h;
        }
        self.refresh(self.newX, self.newY, hideTime, "ease-in-out");
    },
    // 执行图片移动
    refresh: function(x, y, timer, type) {
        this.element.style.webkitTransitionProperty = "-webkit-transform";
        this.element.style.webkitTransitionDuration = timer;
        this.element.style.webkitTransitionTimingFunction = type;
        this.element.style.webkitTransform = getTranslate(x, y);
    },
    // 获取多点触控
    getTouchDist: function(e) {
        var x1 = 0,
            y1 = 0,
            x2 = 0,
            y2 = 0,
            x3 = 0,
            y3 = 0,
            result = {};

        x1 = e.touches[0].pageX;
        x2 = e.touches[1].pageX;
        y1 = e.touches[0].pageY - document.body.scrollTop;
        y2 = e.touches[1].pageY - document.body.scrollTop;

        if (!x1 || !x2) return;

        if (x1 <= x2) {
            x3 = (x2 - x1) / 2 + x1;
        } else {
            x3 = (x1 - x2) / 2 + x2;
        }
        if (y1 <= y2) {
            y3 = (y2 - y1) / 2 + y1;
        } else {
            y3 = (y1 - y2) / 2 + y2;
        }

        result = {
            dist: Math.round(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))),
            x: Math.round(x3),
            y: Math.round(y3)
        };
        return result;
    },
    eventStop: function(e) {
        e.preventDefault();
        e.stopPropagation();
    },
    cropSize: function(param) {
        const self = this;
        var params = param || {};
        var cropW = 0,
            cropH = 0;
        let clientWidth = window.innerWidth;
        let clientHeight = window.innerHeight;

        if (params.ratio) {
            let size = params.ratio.split(':');
            let aspectRadio = size[0] / size[1];
            let screenRadio = clientWidth / clientHeight;
            if (aspectRadio > screenRadio) {
                cropW = clientWidth - 40;
                cropH = cropW / aspectRadio;
            } else {
                cropH = clientHeight - 40;
                cropW = cropH * aspectRadio;
            }
        } else {
            cropW = clientWidth - 40;
            cropH = clientHeight - 40;
        }
        let topH = (clientHeight - cropH) / 2;
        self.crop = {
            w: cropW,
            h: cropH,
            t: topH,
            l: 20
        };
        self.drawCover();
    },
    // 计算出剪大小
    drawCover: function() {
        const crop = this.crop;
        var topElem = document.querySelector('.crop-cover.top'),
            rightElem = document.querySelector('.crop-cover.right'),
            leftElem = document.querySelector('.crop-cover.left'),
            bottomElem = document.querySelector('.crop-cover.bottom');

        topElem.style.cssText = 'height:' + crop.t + 'px';
        bottomElem.style.cssText = 'height:' + crop.t + 'px';
        leftElem.style.cssText = 'width: ' + crop.l + 'px;height:' + crop.h + 'px;top:' + crop.t + 'px';
        rightElem.style.cssText = 'width: ' + crop.l + 'px;height:' + crop.h + 'px;top:' + crop.t + 'px';
    },
    // 画图
    drawCanvas: function() {
        let elemCanvas = this.elemCanvas;
        elemCanvas.style.cssText = 'width:' + this.crop.w + 'px;height:' + this.crop.h + 'px;top:' + this.crop.t + 'px;left:' + this.crop.l + 'px';
        this.crop.elem = elemCanvas;
        this.crop.ctx = elemCanvas.getContext('2d');
        this.scaleFn();
        this.drawImageFn();

    },
    //high DPI scale
    scaleFn(type) {
        const self = this;
        const crop = type ? self[type] : self.crop;
        const cropCanvas = crop.elem;
        var ctx = crop.ctx;
        var devicePixelRatio = window.devicePixelRatio || 1,
            backingStoreRatio = ctx.backingStorePixelRatio ||
            ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1,
            ratio = devicePixelRatio / backingStoreRatio;
        cropCanvas.width = crop.w * ratio;
        cropCanvas.height = crop.h * ratio;

        cropCanvas.style.width = crop.w + 'px';
        cropCanvas.style.height = crop.h + 'px';
        // upscale the canvas if the two ratios don't match
        if (devicePixelRatio !== backingStoreRatio) {
            // now scale the context to counter
            // the fact that we've manually scaled
            // our canvas element
            ctx.scale(ratio, ratio);
        }
    },
    // 将图片绘制到canvas上
    drawImageFn: function() {
        const self = this;
        const elem = self.element;
        const crop = self.crop;
        const radio = self.getRadio();
        let imgL = (self.imgBaseWidth - crop.w) / 2;
        let imgT = (self.imgBaseHeight - crop.h) / 2;
        imgL = imgL - self.newX;
        imgT = imgT - self.newY;
        crop.ctx.clearRect(0, 0, crop.w, crop.h);
        crop.ctx.drawImage(elem, Math.round(imgL * radio[0]), Math.round(imgT * radio[1]), Math.round(crop.w * radio[0]), Math.round(crop.h * radio[1]), 0, 0, crop.w, crop.h);
    },
    // 获取比例
    getRadio: function() {
        const self = this;
        const elem = self.element;
        const naturalHeight = elem.naturalHeight;
        const naturalWidth = elem.naturalWidth;
        const w = elem.width;
        const h = elem.height;
        return [naturalWidth / w, naturalHeight / h];
    },
    //对图片进行旋转，压缩的方法，最终返回base64  渲染给img标签的src
    compress() {
        var img = this.element;
        var drawWidth, drawHeight;
        drawWidth = img.naturalWidth;
        drawHeight = img.naturalHeight;
        //以下改变一下图片大小
        var maxSide = Math.max(drawWidth, drawHeight);
        if (maxSide > 1024) {
            var minSide = Math.min(drawWidth, drawHeight);
            minSide = minSide / maxSide * 1024;
            maxSide = 1024;
            if (drawWidth > drawHeight) {
                drawWidth = maxSide;
                drawHeight = minSide;
            } else {
                drawWidth = minSide;
                drawHeight = maxSide;
            }
        }
        var canvas = document.createElement('canvas');
        canvas.width = drawWidth;
        canvas.height = drawHeight;
        var context = canvas.getContext('2d');
        this.sourceCanvas = {
            elem: canvas,
            w: drawWidth,
            h: drawHeight,
            ctx: context
        };
        this.scaleFn('sourceCanvas');
        context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, drawWidth, drawHeight);
        var base64data = canvas.toDataURL(this.imgType);
        canvas = context = null;
        // 创建canvas 对象
        let nodeImg = document.createElement('img');
        nodeImg.src = base64data;
        document.querySelector('.crop-con').appendChild(nodeImg);
        this.element = nodeImg;
        this.initEvent();
    },
    // 将节点添加到 sole-style
    addNode: function(text) {
        let node = document.createElement('p');
        let nodeText = document.createTextNode(text);
        node.appendChild(nodeText);
        document.querySelector('.sole-style').appendChild(node);
    }
};


export default new ImagesZoom();