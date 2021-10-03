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
			qimessagingCurrentSentenceSubscribe();
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
   	 	        	tts.say("");
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

// 名前を呼ぶ関数
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
			self.alBehavior.runBehavior("yoshiki_master_oct/00_posture/03_eye_contact");
			break;		
	}
}

function aiduchi(num){
	self.alAudioDevice.setOutputVolume(50);
	switch (num){
		case 0:
			if (Math.random()>0.5){
				self.alBehavior.runBehavior("yoshiki_master_oct/02_motion/00_nodding_diagonal")
			}else{
				self.alAudioDevice.setOutputVolume(40);
				self.alBehavior.runBehavior("yoshiki_master_oct/01_aiduchi/00_un")
			};
			break;
		case 1:
			self.alBehavior.runBehavior("yoshiki_master_oct/01_aiduchi/01_naruhodo");
			break;	
		case 2:
			self.alBehavior.runBehavior("yoshiki_master_oct/01_aiduchi/02_sounandesune");
			break;	
		case 3:
			self.alBehavior.runBehavior("yoshiki_master_oct//01_aiduchi/03_naruhodo_sounandesune");
			break;	
		case 4:
			self.alBehavior.runBehavior("yoshiki_master_oct/01_aiduchi/04_a_naruhodo");
			break;
		case 5:
			self.alBehavior.runBehavior("yoshiki_master_oct/01_aiduchi/05_arigatogozaimasu");
			break;
		case 6:
			self.alBehavior.runBehavior("yoshiki_master_oct/01_aiduchi/06_a_hai");
			break;
		case 7:
			self.alBehavior.runBehavior("yoshiki_master_oct/01_aiduchi/07_soudesune");
			break;
		case 8:
			self.alBehavior.runBehavior("yoshiki_master_oct/01_aiduchi/08_zyaa");
			break;
		case 9:
			self.alBehavior.runBehavior("yoshiki_master_oct/01_aiduchi/09_a_ano");
			break;
		case 10:
			self.alBehavior.runBehavior("yoshiki_master_oct/01_aiduchi/10_ha_arigatougozaimasu");
			break;
		case 11:
			self.alBehavior.runBehavior("yoshiki_master_oct/01_aiduchi/11_naruhodo_mousukoshi");
			break;
		case 12:
			self.alBehavior.runBehavior("yoshiki_master_oct/01_aiduchi/12_soudattandesune");
			break;
	}
}
function aiduchi_np(num){
	self.alAudioDevice.setOutputVolume(50);
	switch (num){
		case 0:
			self.alBehavior.runBehavior("yoshiki_master_oct/02_motion/00_nodding_diagonal")
			break;
		case 1:
			self.alBehavior.runBehavior("yoshiki_master_oct/01_aiduchi_np/01_naruhodo");
			break;	
		case 2:
			self.alBehavior.runBehavior("yoshiki_master_oct/01_aiduchi_np/02_sounandesune");
			break;	
		case 3:
			self.alBehavior.runBehavior("yoshiki_master_oct//01_aiduchi_np/03_naruhodo_sounandesune");
			break;	
		case 4:
			self.alBehavior.runBehavior("yoshiki_master_oct/01_aiduchi_np/04_a_naruhodo");
			break;
		case 5:
			self.alBehavior.runBehavior("yoshiki_master_oct/01_aiduchi_np/05_arigatogozaimasu");
			break;
		case 6:
			self.alBehavior.runBehavior("yoshiki_master_oct/01_aiduchi_np/06_a_hai");
			break;
		case 7:
			self.alBehavior.runBehavior("yoshiki_master_oct/01_aiduchi_np/07_soudesune");
			break;
		case 8:
			self.alBehavior.runBehavior("yoshiki_master_oct/01_aiduchi_np/08_zyaa");
			break;
	}
}
function posture(num){
	switch (num){
		case 0:
			self.alBehavior.runBehavior("yoshiki_master_oct/00_posture/00_sit_down")
			break;
		case 1:
			self.alBehavior.runBehavior("yoshiki_master_oct/00_posture/01_lean_sit");
			break;	
	}
}
function question(phrase){
	// 手を動かして話始める
	self.alBehavior.runBehavior("yoshiki_master_oct/00_posture/02_back_voice");
	self.alBehavior.runBehavior("yoshiki_master_oct/02_motion/01_start_talking_diagonal");
	self.alTextToSpeech.say(phrase);
}
function question_np(phrase){
	// 手を動かさず話し始める
	self.alBehavior.runBehavior("yoshiki_master_oct/00_posture/02_back_voice");
	self.alTextToSpeech.say(phrase);
}

function utterance_spe(phrase){
	self.alBehavior.runBehavior("yoshiki_master_oct/00_posture/04_lean_sit_neck");
	self.alTextToSpeech.say(phrase);
}

function utterance_spe2(phrase){
	self.alBehavior.runBehavior("yoshiki_master_oct/00_posture/01_lean_sit");
	self.alTextToSpeech.say(phrase);
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

function name_saying(num){
	var value = $("#name_input").val();
	switch(num){
		case 1:
			self.alTextToSpeech.say("そんな素敵な" +value+"さんだからこそ、そんな体験ができたんですね！");
			break;
		case 2:
			self.alTextToSpeech.say("謙虚で人に感謝を忘れないところが、" +value+"さんの良いところ、ですね！");
			break;
		case 3:
			self.alTextToSpeech.say("それでも頑張った" +value+"さんは素晴らしいと思います。");
			break;
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

function qimessagingCurrentSentenceSubscribe(){
	self.alMemory.subscriber("ALTextToSpeech/CurrentSentence").done(function(subscriber) {
		subscriber.signal.connect(toLogHandler);
	  });
}

function start_set(){
	self.alAutonomousLife.getState().done(function(val){console.log(val)});
	self.alAutonomousLife.setState("disabled");
	sleep(10000)
	self.alMotion.wakeUp();
}

function toTabletHandler(value) {
        console.log("PepperQiMessaging/Recoイベント発生: " + value);
        $(".memory").text(value);
}
function sleep(waitMsec) {
	var startMsec = new Date();
   
	// 指定ミリ秒間だけループさせる（CPUは常にビジー状態）
	while (new Date() - startMsec < waitMsec);
}
function toLogHandler(value) {
	var value = value.replace(/、/g,'');
	var value = value.replace(/　/g,'');
	if (value != ""){
		var previous = $("#dialog").val()
		// $("#dialog").val(previous+value);
		$("#dialog").val(previous+"\n"+ value);
	}
}