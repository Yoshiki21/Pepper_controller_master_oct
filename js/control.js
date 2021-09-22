var self = this;

function qrCreate(){

	var ipAddress = $('#socketServerIP').val();
	var portNumber = $('#socketServerPort').val();

	var jsonText = 	'{"ip":"' +
									ipAddress +
									'","port":' +
									portNumber +
									'}'
	console.log(jsonText)
	$('#qrcodeCanvas').empty();


	$('#qrcodeCanvas').qrcode({
		text	: jsonText
	});
}

function connect(){
	// 入力されたpepperのIPアドレスを取得
	var pepperIp = $("#pepperIP").val();

	// 接続が成功したら、各種プロキシを作成して代入しておく
    var setupIns_ = function(){
    	self.qims.service("ALTextToSpeech").done(function(ins){
    		self.alTextToSpeech = ins;
        });
        self.qims.service("ALAnimatedSpeech").done(function(ins){
    		self.alAnimatedSpeech = ins;
        });
        self.qims.service("ALMotion").done(function(ins){
        	self.alMotion = ins;
        });
        self.qims.service("ALBehaviorManager").done(function(ins){
        	self.alBehavior = ins;
        });
    	self.qims.service("ALAutonomousLife").done(function(ins){
    		self.alAutonomousLife = ins;
        });
        self.qims.service("ALAudioDevice").done(function(ins){
            self.alAudioDevice = ins;
            self.alAudioDevice.getOutputVolume().done(function(val){
		    self.showAudioVolume(val);
		    });
        });
        self.qims.service("ALMemory").done(function(ins){
    		self.alMemory = ins;

    		// メモリ監視
    		qimessagingMemorySubscribe();
        });
    }

	// pepperへの接続を開始する
	self.qims = new QiSession(pepperIp);
	self.qims.socket()
		// 接続成功したら
		.on('connect', function ()
			{
   	 		self.qims.service("ALTextToSpeech")
   	 			.done(function (tts)
   	 			{
   	 	        	tts.say("接続に成功しました");
   	 	       });
   	 	       		// 接続成功したら各種セットアップを行う
     	       		setupIns_();

     	       		// 接続成功表示切り替え
     	       		$(".connectedState > .connected > .connectedText").text("接続成功");
     	       		$(".connectedState > .connected > .glyphicon").removeClass("glyphicon-remove");
     	       		$(".connectedState > .connected > .glyphicon").addClass("glyphicon-signal");
     	       		$(".connectedState > .connected").css("color","Blue");


     	       })
     	// 接続失敗したら
        .on('disconnect', function () {
              //self.nowState("切断");
});
}


function showAudioVolume(val){
	console.log(val);
	// あとからページに表示させる
	$("#pepperVolume").val(val);
}

function changeAudioVolume(){
	var volume = $("#pepperVolume").val();
	volume = Number(volume);
	console.log(Number(volume));
	self.alAudioDevice.setOutputVolume(volume);
	self.hello();

}


// 動作確認用Hello
function hello(){
	console.log("hello");
	this.alTextToSpeech.say("はろー");

}

// おしゃべり
function say(){
	console.log("say");
	var value = $("#sayText").val();
	this.alTextToSpeech.say(value);
}

function say_name(){
	console.log("say_name");
	var value = $("#name_input").val();
	this.alTextToSpeech.say(value+"さんっ！");
}

// 動きながらおしゃべり
function animatedSay(){
	console.log("say");
	var value = $("#animatedSayText").val();
	this.alAnimatedSpeech.say(value);
}



function thank(){
	console.log("arigato");
	this.alAnimatedSpeech.say("ありがとう");
}

// 移動
function move(to){
	if (self.alMotion){
		console.log("move to");
		switch (to){
			case 0:
				self.alMotion.moveTo(0, 0, 0.5).fail(function(err){console.log(err);});
				break;

			case 1:
				self.alMotion.moveTo(0, 0, -0.5).fail(function(err){console.log(err);});
				break;

			case 2:
				self.alMotion.moveTo(0.3, 0, 0).fail(function(err){console.log(err);});
				break;

			case 3:
				self.alMotion.moveTo(-0.3, 0, 0).fail(function(err){console.log(err);});
				break;
			case 4:
				self.alMotion.moveTo(0, 0, 0).fail(function(err){console.log(err);});
				break;

		}
	}
}

// ビヘイビアアクション
function eye_track(num){
	switch (num){
		case 0:
			self.alBehavior.stopAllBehaviors();
			break;
		case 1:
			self.alBehavior.runBehavior("yoshiki_master/eye_contact");
			break;		
	}
}
function monitor(){
	self.alBehavior.runBehavior("yoshiki_master/show");
}
function aiduchi(num){
	switch (num){
		case 0:
			self.alBehavior.stopAllBehaviors();
			break;
		case 1:
			self.alBehavior.runBehavior("yoshiki_master/hoo");
			break;	
		case 2:
			self.alBehavior.runBehavior("yoshiki_master/hee");
			break;	
		case 3:
			self.alBehavior.runBehavior("yoshiki_master/naruhodo");
			break;	
		case 4:
			self.alBehavior.runBehavior("yoshiki_master/unun");
			break;	
		case 5:
			self.alBehavior.runBehavior("yoshiki_master/sounanndesune");
			break;	
		case 6:
			self.alBehavior.runBehavior("yoshiki_master/un");
			break;
		case 7:
			self.alBehavior.runBehavior("yoshiki_master/unun2");
			break;		
	}
}
function aiduchi_np(num){
	switch (num){
		case 0:
			self.alBehavior.stopAllBehaviors();
			break;
		case 1:
			self.alBehavior.runBehavior("yoshiki_master/hoo_neutral");
			break;	
		case 2:
			self.alBehavior.runBehavior("yoshiki_master/hee_neutral");
			break;	
		case 3:
			self.alBehavior.runBehavior("yoshiki_master/naruhodo_neutral");
			break;	
		case 4:
			self.alBehavior.runBehavior("yoshiki_master/unun_neutral");
			break;	
		case 5:
			self.alBehavior.runBehavior("yoshiki_master/sounanndesune_neutral");
			break;	
		case 6:
			self.alBehavior.runBehavior("yoshiki_master/un_neutral");
			break;
		case 7:
			self.alBehavior.runBehavior("yoshiki_master/unun2_neutral");
			break;		
	}
}
function posture(num){
	switch (num){
		case 0:
			self.alBehavior.stopBehavior("boot-config");
			break;
		case 1:
			self.alBehavior.runBehavior("yoshiki_master/StandInit");
			break;	
		case 2:
			self.alBehavior.runBehavior("yoshiki_master/listening_style");
			break;	
		case 3:
			self.alBehavior.runBehavior("yoshiki_master/adoptive");
			break;
		case 4:
			self.alBehavior.runBehavior("yoshiki_master/nodding");
			break;
		case 5:
			self.alBehavior.runBehavior("yoshiki_master/nodding_double");
			break;
		case 6:
			self.alBehavior.runBehavior("yoshiki_master/nodding_fast");
			break;
		case 7:
			self.alBehavior.runBehavior("yoshiki_master/nodding_double_fast");
			break;
		case 8:
			self.alBehavior.runBehavior("boot-config");
			break;
		case 9:
			self.alBehavior.runBehavior("yoshiki_master/nodding_double2");
			break;
	}
}
function question(phrase){
	self.alBehavior.runBehavior("yoshiki_master/back_voice");
	self.alAnimatedSpeech.say("^mode(disabled)^start(yoshiki_master/start_talking)"+phrase);
}
function question_np(phrase){
	self.alBehavior.runBehavior("yoshiki_master/back_voice");
	self.alTextToSpeech.say(phrase);
}
function utterance_np(phrase){
	self.alBehavior.runBehavior("yoshiki_master/back_voice");
	self.alAnimatedSpeech.say("^mode(disabled)^start(yoshiki_master/start_talking2)"+phrase);
}

function utterance_spe(phrase){
	self.alBehavior.runBehavior("yoshiki_master/back_voice");
	self.alAnimatedSpeech.say("^mode(disabled)^start(yoshiki_master/Stand)"+phrase);
}

function utterance_spe2(phrase){
	self.alBehavior.runBehavior("yoshiki_master/back_voice");
	self.alAnimatedSpeech.say("^mode(disabled)^start(yoshiki_master/listening_style)"+phrase);
}

function trackmode(bl){
	var status;
	if (bl){
		self.alBasicAwarenessProxy.setTrackingMode("Head");
	}else
	{
		self.alBasicAwarenessProxy.stopAwareness();
	}
}
function autonomousSwitch(bl){
	var status;
	if (bl)
	{
		console.log("ON");
		self.alAutonomousLife.getState().done(function(val){console.log(val)});
		self.alAutonomousLife.setState("solitary");

	}else
	{
		console.log("OFF");
		self.alAutonomousLife.getState().done(function(val){console.log(val)});
		self.alAutonomousLife.setState("disabled");
	}
}

function sleepSwitch(bl){
	var status;
	if (bl)
	{
		console.log("ON");
		self.alMotion.wakeUp();

	}else
	{
		console.log("OFF");
		self.alMotion.rest();
	}
}


function qimessagingMemoryEvent(){
	console.log("push!");
	self.alMemory.raiseEvent("PepperQiMessaging/Hey", "1");
}

function qimessagingMemorySubscribe(){
	console.log("subscriber!");
	self.alMemory.subscriber("PepperQiMessaging/Reco").done(function(subscriber)
		{
            subscriber.signal.connect(toTabletHandler);
        }
    );
}


function toTabletHandler(value) {
        console.log("PepperQiMessaging/Recoイベント発生: " + value);
        $(".memory").text(value);
}
