var Photo = cc.Sprite.extend({
	touchListener:null,
	albumLayer:null,
	ctor:function(pic, layer){
		this._super();
		
		var picSprite = new cc.Sprite(pic);
		
		this.width = picSprite.width + 56*2 - 2;
		this.height = picSprite.height + 56*2 - 2;
		var framePic = new cc.Scale9Sprite(res.Pic_frame, cc.rect(0, 0, 500, 500), cc.rect(100, 100, 300, 300));
		framePic.x = this.width/2;
		framePic.y = this.height/2;
		framePic.width = this.width;
		framePic.height = this.height;
		picSprite.x = this.width/2;
		picSprite.y = this.height/2;
		this.addChild(picSprite);
		this.addChild(framePic);
		
		albumLayer = layer;
		touchListener = cc.EventListener.create({
			event:cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches:true,
			originX:null,
			originY:null,
			onTouchBegan:function(touch, event){
				var target = event.getCurrentTarget();  // 获取事件所绑定的 target
				// 获取当前点击点所在相对按钮的位置坐标
				var locationInNode = target.convertToNodeSpace(touch.getLocation());    
				var s = target.getContentSize();
				var rect = cc.rect(0, 0, s.width, s.height);
				if (cc.rectContainsPoint(rect, locationInNode)) {       // 点击范围判断检测
					originX = target.x;
					originY = target.y;

					albumLayer.onNextStart();
					return true;
				}
				return false;
			},
			onTouchMoved: function (touch, event) {
				// 移动当前按钮精灵的坐标位置
				var target = event.getCurrentTarget();
				var touchMoveX = (target.x - originX);
				var touchMoveY = (target.y - originY);
				var distance2 = this.getDistance(touchMoveX,touchMoveY);
				if(distance2 <= 200){
					albumLayer.onNextScale(distance2);
				}
				
				var delta = touch.getDelta();
				target.x += delta.x;
				target.y += delta.y;
			},
			onTouchEnded: function (touch, event) {
				var target = event.getCurrentTarget();
				var touchMoveX = (target.x - originX);
				var touchMoveY = (target.y - originY);
				var moveR = this.getDistance(touchMoveX, touchMoveY);
				if (moveR > 200) {
					//拖动超过200，照片滑出
					
					//最大半径
					var r = this.getDistance(cc.winSize.width, cc.winSize.height)/2;
					var move2X = touchMoveX * (r / moveR) * 1.8 + originX;
					var move2Y = touchMoveY * (r / moveR) * 1.8 + originY;
					
					var moveOutAction = new cc.MoveTo(0.2, cc.p(move2X, move2Y));
					target.runAction(moveOutAction);

					albumLayer.onNextDone();
				} else {
					//拖动不超过50，照片回到原处
					var backToCenterAction = new cc.moveTo(0.2, cc.p(cc.winSize.width / 2, cc.winSize.height / 2));
					target.runAction(backToCenterAction);
					albumLayer.onNextCancel();
				}
			},
			getDistance: function(x, y){
				return Math.pow((x * x + y * y), 0.5);
			}
		});
		cc.eventManager.addListener(touchListener, this);
	}
});

var AlbumLayer = cc.Layer.extend({
	sprite:null,
	scene:null,
	btBack:null,
	index:null,
	pic1:null,
	pic2:null,
	pics:null,
	ctor:function(){
		this._super();
		
		pics = new Array(res.Album_pic1, res.Album_pic2, res.Album_pic3, res.Album_pic4, res.Album_pic5, res.Album_pic6, res.Album_pic7, res.Album_pic8, res.Album_pic9);
		
		scene = ccs.load(res.AlbumScene_json);
		this.addChild(scene.node);
		this.initViews();
		
		index = 0;
		this.showIndex(index);
		
		return true;
	},
	initViews:function(){
		btBack = ccui.helper.seekWidgetByName(scene.node, "bt_back");
		btBack.addTouchEventListener(this.buttonClicked);
	},
	buttonClicked:function(sender, type){
		switch(type){
		case ccui.Widget.TOUCH_ENDED:
			switch (sender) {
			case btBack:
				cc.director.runScene(new HomeScene());
				break;
			default:
				break;
			}
			break;
		}
	},
	onNextStart:function(){
		this.showIndex(++index);
	},
	showIndex:function(i){
		var pic = this.getPhotoByIndex(i);
		if(i == 0){
			pic1 = pic;
			this.addChild(pic);
		}else{
			try {
				this.removeChild(pic2);
			} catch (e) {
				// TODO: handle exception
			}
			pic2 = null;
			pic2 = pic;
			if ("undefined" != typeof pic2 && pic2) {
				var scale = 1/40000;
				pic2.setScaleX(scale);
				pic2.setScaleY(scale);
			}
			this.addChild(pic2);
		}
		this.updateZIndex();
	},
	onNextScale:function(progress){
//		cc.log("onNextScale:"+progress);
		if ("undefined" != typeof pic2 && pic2) {
			var scale = progress/40000;
			pic2.setScaleX(scale);
			pic2.setScaleY(scale);
		}
	},
	onNextCancel:function(){
		this.removeChild(pic2);
		pic2 = null;
		index--;

		this.updateZIndex();
	},
	onNextDone:function(){
		//此处应该有动画效果
		if ("undefined" != typeof pic2 && pic2) {
			var scaleAction = new cc.ScaleTo(0.2, 1);
			pic2.runAction(scaleAction);
		}
		
		var tmp = pic1;
		pic1 = pic2;
		pic2 = tmp;
		this.scheduleOnce(function(){
			this.updateZIndex();
		}, 0.5);
	},
	getPhotoByIndex:function(i){
		var index = i % pics.length;
		var pic = new Photo(pics[index], this);
		pic.attr({
			x: cc.winSize.width / 2,
			y: cc.winSize.height / 2,
		});
		return pic;
	},
	updateZIndex:function(){
		try {
			pic1.zIndex = 10;
		} catch (e) {
			// TODO: handle exception
		}
		try {
			pic2.zIndex = 9;
		} catch (e) {
			// TODO: handle exception
		}
	},
	resetStatus:function(){
		pic1 = null;
		pic2 = null;
	}
});

var AlbumScene = cc.Scene.extend({
	layer:null,
	onEnter:function(){
		this._super();
		layer = new AlbumLayer();
		this.addChild(layer);
	},
	onExit:function(){
		this._super();
		layer.resetStatus();
		layer.retain();
		layer = null;
	}
});