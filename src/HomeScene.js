var BasePage = cc.Layer.extend({
	touchListener:null,
	homeScene:null,
	ctor:function(scene){
		this._super();
		homeScene = scene;
		this.width = cc.winSize.width;
		this.height = cc.winSize.height;

		touchListener = cc.EventListener.create({
			event:cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches:true,
			originY:null,
			onTouchBegan:function(touch, event){
				var target = event.getCurrentTarget();  // 获取事件所绑定的 target
				// 获取当前点击点所在相对按钮的位置坐标
				var locationInNode = target.convertToNodeSpace(touch.getLocation());    
				var s = target.getContentSize();
				var rect = cc.rect(0, 0, s.width, s.height);
				if (cc.rectContainsPoint(rect, locationInNode)) {
					originY = target.y;
					return true;
				}
				return false;
			},
			onTouchMoved: function (touch, event) {
				// 移动当前按钮精灵的坐标位置
				var target = event.getCurrentTarget();

				var delta = touch.getDelta();
				target.y += delta.y;
			},
			onTouchEnded: function (touch, event) {
				var target = event.getCurrentTarget();
				var touchMoveY = (target.y - originY);
				if (target.y > cc.winSize.height/4) {
					//拖动超过一半，照片滑出
					var moveOutAction = new cc.MoveTo(0.2, cc.p(0, cc.winSize.height));
					target.runAction(moveOutAction);
					homeScene.scheduleOnce(function(){
						homeScene.onNextPage();
					}, 0.2);
				} else {
					//拖动不超过一半，照片回到原处
					var backToCenterAction = new cc.moveTo(0.5, cc.p(0, 0));
					target.runAction(backToCenterAction);
				}
			}
		});
		cc.eventManager.addListener(touchListener, this);
	},
	startAnim:function(){
	}
});



var PicPage = BasePage.extend({
	bkg:null,
	bkg_anim:null,
	ctor:function(pic, scene){
		this._super(scene);

		bkg = new cc.Sprite(pic);
		bkg.x = this.width/2;
		bkg.y = this.height/2;
		bkg.width = 640;
		bkg.height = 960;
		this.addChild(bkg);
	},
	startAnim:function(){
		bkg.opacity = 0;
		bkg_anim = new cc.FadeIn(1, 255);
		bkg.runAction(bkg_anim);
	},
	fadeIn:function(layer){
		var layer1 = new cc.Sprite(layer);
		layer1.x = this.width/2;
		layer1.y = this.height/2;
		layer1.opacity = 0;
		var layer1_anim = new cc.FadeIn(1, 255);
		layer1.runAction(layer1_anim);
		this.addChild(layer1);
	}
});

var InfoLayer = PicPage.extend({
	scene:null,
	button2:null,
	bkg:null,
	ctor:function(hScene){
		this._super(res.Page6_bkg,hScene);

		return true;
	},
	initViews:function(){
		bkg = ccui.helper.seekWidgetByTag(scene.node, 6);
		button2 = ccui.helper.seekWidgetByName(scene.node, "Button_2");
		button2.addTouchEventListener(this.buttonClicked);
	},
	buttonClicked:function(sender, type){
		switch(type){
		case ccui.Widget.TOUCH_ENDED:
			switch (sender) {
			case button2:
				cc.director.runScene(new AlbumScene());
				break;
			default:
				break;
			}
			break;
		}
	},
	startAnim:function(){
		this._super();
		this.scheduleOnce(function(){
			scene = ccs.load(res.HomeScene_json);
			this.addChild(scene.node);

			this.initViews();
		}, 1);
	}
});


var PicPage1 = PicPage.extend({
	ctor:function(scene){
		this._super(res.Page1_bkg,scene);
	},
	startAnim:function(){
		this._super();
		this.scheduleOnce(function(){
			this.fadeIn(res.Page1_layer1);
		}, 0.5);
	}
});

var PicPage2 = PicPage.extend({
	ctor:function(scene){
		this._super(res.Page2_bkg,scene);
	},
	startAnim:function(){
		this._super();
		this.scheduleOnce(function(){
			this.fadeIn(res.Page2_layer1);
			this.scheduleOnce(function(){
				this.fadeIn(res.Page2_layer2);
				this.scheduleOnce(function(){
					this.fadeIn(res.Page2_layer3);
					this.scheduleOnce(function(){
						this.fadeIn(res.Page2_layer4);
						this.scheduleOnce(function(){
							this.fadeIn(res.Page2_layer5);
						}, 0.5);
					}, 0.5);
				}, 0.5);
			}, 0.5);
		}, 0.5);
	}
});

var PicPage3 = PicPage.extend({
	ctor:function(scene){
		this._super(res.Page3_bkg,scene);
	},
	startAnim:function(){
		this._super();
		this.scheduleOnce(function(){
			this.fadeIn(res.Page3_layer1);
			this.scheduleOnce(function(){
				this.fadeIn(res.Page3_layer2);
				this.scheduleOnce(function(){
					this.fadeIn(res.Page3_layer3);
					this.scheduleOnce(function(){
						this.fadeIn(res.Page3_layer4);
					}, 0.5);
				}, 0.5);
			}, 0.5);
		}, 0.5);
	}
});

var PicPage4 = PicPage.extend({
	ctor:function(scene){
		this._super(res.Page4_bkg,scene);
	},
	startAnim:function(){
		this._super();
		this.scheduleOnce(function(){
			this.fadeIn(res.Page4_layer1);
			this.scheduleOnce(function(){
				this.fadeIn(res.Page4_layer2);
				this.scheduleOnce(function(){
					this.fadeIn(res.Page4_layer3);
					this.scheduleOnce(function(){
						this.fadeIn(res.Page4_layer4);
					}, 0.5);
				}, 0.5);
			}, 0.5);
		}, 0.5);
	}
});

var PicPage5 = PicPage.extend({
	ctor:function(scene){
		this._super(res.Page5_bkg,scene);
	},
	startAnim:function(){
		this._super();
		this.scheduleOnce(function(){
			this.fadeIn(res.Page5_layer1);
			this.scheduleOnce(function(){
				this.fadeIn(res.Page5_layer2);
				this.scheduleOnce(function(){
					this.fadeIn(res.Page5_layer3);
					this.scheduleOnce(function(){
						this.fadeIn(res.Page5_layer4);
						this.scheduleOnce(function(){
							this.fadeIn(res.Page5_layer5);
						}, 0.5);
					}, 0.5);
				}, 0.5);
			}, 0.5);
		}, 0.5);
	}
});

var HomeScene = cc.Scene.extend({
	index:null,
	pic1:null,
	pic2:null,
	onEnter:function(){
		this._super();
		index = 0;
		//PicPage1
		pic1 = new PicPage1(this);
		pic2 = new PicPage1(this);
		this.addChild(pic1);
		pic1.startAnim();
		
		//arrow
		var arrow = new cc.Sprite(res.Arrow_up);
		arrow.x = cc.winSize.width/2;
		arrow.y = 40;
		this.addChild(arrow, 10, null);
		
		arrow.runAction(cc.Sequence.create(cc.fadeOut(1), cc.fadeIn(1)).repeatForever());
	},
	onNextPage:function(){
		index++;
		var tmp = pic2;
		pic2 = pic1;
		pic1 = tmp;
		try {
			this.removeChild(pic1);
		} catch (e) {
			// TODO: handle exception
		}
		pic1 = this.newPage(index);
		this.showPage(pic1);
	},
	newPage:function(i){
//		var j = (i+4)%6;
		var j = i%6;
		switch (j) {
		case 0:
			return new PicPage1(this);
		case 1:
			return new PicPage2(this);
		case 2:
			return new PicPage3(this);
		case 3:
			return new PicPage4(this);
		case 4:
			return new PicPage5(this);
		case 5:
			return new InfoLayer(this);
		default:
			return new PicPage1(this);
		}
	},
	showPage:function(page){
		this.addChild(pic1);
		pic1.startAnim();
	}
});