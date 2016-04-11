var theMathGame = (function() {
	var byId = function( id ) {
		return document.getElementById( id );
		};
	"use strict";
	// Use the date.seconds to seed random number generator in doMath.
	var NumArIndx;
	var w = new Date();
	NumArIndx = w.getSeconds();
	
	// Handles all data going in and out of localStorage
	var localstore = (function() {
			var initcount = 0;
			var gmsettings = [];
			
		return {
			
			shop: function(itm) {
				var strtoarr = [];
				var p1 = [];
				var p2 = [];
				var p3 = "";
				if(localStorage.getItem(itm) !== null) {
					var itmstr = localStorage.getItem(itm);
					strtoarr = itmstr.split(" ");
					if(itm === "gmsettings") {
						gmsettings = strtoarr;
						}
					else {
						p1 = strtoarr.slice(0,4);
						p2 = strtoarr.slice(4);
						p3 = p2.join(" ");
						p1.push(p3);
						strtoarr = p1;
					}
					return strtoarr;
					}
				else {
					return undefined;
				}
			},
			stock: function(cat,dat) {
				var i = 0;
				var sets = gmsettings;
				var len = 0;
				var passer = "";
				sets[cat] = dat + " ";
				if(initcount>=2) {
					len = sets.length;
					for(i=0; i < len; i += 1) {
						passer += sets[i];
						}
					localStorage.setItem("gmsettings", passer);
				}
				gmsettings = sets;
				initcount += 1;
			},
			statstock: function(cat,dat) {
				var datas = dat.join(" ");
				localStorage.setItem(cat, datas);
			}
		};
	})();
	
	// Retrieve user settings when the application loads. Set game, level, and speed.
	var retrieveStorage = (function() {
		var settings = [];
		var gmSetAr = [];
		var game = "";
		var radgame = 0;
		var lengame = 0;
		var level = "";
		var radlevel = 0;
		var lenlevel = 0;
		var speed = "";
		var i =0;
		settings = localstore.shop("gmsettings");
		
		if (settings !== undefined) {
			game = settings[0];
			level = settings[1];
			speed = settings[2];
			
			radgame = document.getElementsByName('radio-game');
			lengame = radgame.length;
			for (i = 0; i < lengame; i += 1) {
				if (radgame[i].value === game) {
					radgame[i].checked = true;       
				}
			}
			radlevel = document.getElementsByName('radio-level');
			lenlevel = radlevel.length;
			for (i = 0; i < lenlevel; i += 1) {
				if (radlevel[i].value === level) {
					radlevel[i].checked = true;       
				}
			}
			byId('slidespeed').value = speed;
			byId('slidespeed2').value = speed;
		}
		else {
			return;
			}
	})();
	
	// This module displays the user's stats, presents options for clearing the stats, and executes the clearing of stats.
	var showstats = (function() {
			var thegame = "";
			var statext = "";
			var gamester = "";
			
			// Get stat model from stats and prepare html.
			function textstring(ebb,flo) {
				var statis = ebb;
				var a = 0;
				var b = 0;
				var c = "";
				var d = 0;
				var e = 0;
				var f = 0;
				var h = flo;
				var newstrngi = "";
				e = statis[0] * 1;
					f = statis[1] * 1;
					b = statis[2] * 1;
					a = statis[3] * 1;
					c = statis[4];
					if(a === 0){
						a = 0;
						e = 0;
						f = 0;
					}
					if(b === 0){
						b = 0;
						d = 0;
						c = 0;
					}
					else {
						d = Math.floor((a / b) * 100);
					}
					
					newstrngi = '<strong><span class="statstyle">Wins: </span>' + a + '<div class="clearstat" id="clrstat"><small>Clear Stats:<br />' + h + '</small></div><br /><span class="statstyle">Total Games: </span>' + b + '<br /><span class="statstyle">Percent Won:  </span>' + d + '%<br /><span class="statstyle">Best Game:  Level </span>' + e + '<span class="statstyle speedcent"> Speed </span>' + f + '<br /><span class="statstyle">Last 10 Games: </span><br /><span class="recentpad"><small>most recent</small>--\></span><span class="streakpad">' + c + '</span></strong>';
					return newstrngi;
			}
			
			return {
				
				// Display stat data to the user.
				displaystat: function(gname) {
					var p1 = gname;
					var g = "";
					var h = "";
					var textgett = "";
					var statis = [];
					var ge = Newgame.expogame();
					
					if(ge === "1"){
						statis = stats.currentstats(1);
						g = "Up or Down";
					}
					else if(ge === "2"){
						statis = stats.currentstats(2);
						g = "The Big Four";
					}
					gamester = ge;
					h = g;
					thegame = g;
					textgett = textstring(statis,g);
					statext = textgett;
					byId('stathead').innerHTML = "Game:  " + g;
					byId('stathead').style.display = "block";
					byId('statshow').innerHTML = textgett;
					if(p1 === "settings"){
						byId('re_view').className += ' displayno';
						byId('re_view1').className += ' displayno';
						byId('statsb').className += ' displayno';
						byId('statsb1').className += ' displayno';
					}
					else {
						byId('statsb').className += ' light';
						byId('statsb1').className += ' light';
					}
					byId('showstat').style.display = 'block';
				},
				
				// Functions for clearing stats for current game
				clearprompt: function() {
					byId('statshow').className += 'displayno';
					byId('statshow').innerHTML = '<div class="statisclear"><p>Clear stats for the game: </p><br /><span class="clrgmfont"><p>' + thegame + '</p></span><br /><div class="clearchoice" id="cancel1"><p>Cancel</p></div><div class="clearchoice" id="clear1"><p>Clear</p></div></div>';
					byId('statshow').className = 'statics';
				},
				cancelprompt: function() {
					byId('statshow').className += 'displayno';
					byId('statshow').innerHTML = statext;
					byId('statshow').className = 'statics';
				},
				executeclear: function() {
					var gme = gamester;
					var game = thegame;
					var gm = [0,0,0,0,""];
					var newtex = textstring(gm,game);
					statext = newtex;
					byId('statshow').className += 'displayno';
					byId('statshow').innerHTML = newtex;
					byId('statshow').className = 'statics';
					stats.clearunits(gme);
				}
			};
		})();
	
	// Displays a review of the last game
	var reviewproblem = (function(){
		
		function review() {
			var problem = interactWithUser.getproblem();
			var prob = problem[0];
			var c = prob.length;
			var resulted = problem[1];
			var x = 0;
			var y = "What is ";
			for(x=0;x<c;x+=1){
				y += prob[x] + '<br />';
			}
			y += '<span class="revstyle">The Answer is: </span>' + resulted;
			byId('levhead').style.display = 'block';
			byId('statshow').innerHTML = "<p>" + y + "</p>";
			byId('re_view').className += ' light';
			byId('re_view1').className += ' light';
			byId('showstat').style.display = 'block';
		}
		
		return {
			reviewgame: function() {
				review();
			}
		};
	})();
	
	/***************************************************************************************************/
	/* This module handles game play from the moment that the user clicks play until the correct answer	*
	/* is displayed. ShowProblem() shows the user the problem. Typeanswer() displays a number pad that 	*
	/* the user can use to input his or her answer. Answer() displays the correct answer and displays 	*
	/* a message. 		   																				*					
	/*   * Typeanswer() adds and removes its own event listeners for the number pad.					*																								   	*
	/***************************************************************************************************/
	var interactWithUser = (function() {
		var problemo = [];
		var resolve = 0;
		var game = 0;
		var message = "";
		
		return {
			
			getproblem: function() {
				var ret = [problemo,resolve];
				return ret;
			},
			// Display the correct answer along with a message provided by userProgress.
			answerQ: function(res){
				var userinp = res*1;
				var c = resolve;
				var d = "";
				var f = 0;
				var g = "";
				if(userinp === c){
					if(message !== "") {
						g = message;
						d = "<h2><br />The answer is " + c + "." + g + "</h2>";
					}
					else {
						d = "<h2><br />Correct!<br />The answer is " + c + ".</h2>";
					}
					f = 1;
				}
				else{
					d = "<h2><br />Incorrect<br />The answer is " + c + ".</h2>";
					f = 0;
				}
				byId('levhead').style.display = 'block';
				byId('statshow').innerHTML = d;
				byId('showstat').style.display = 'block';
				handlers.setanswer();
				stats.addstat(f);
				userProgress.streakupdate(f);
			},
			positivemessageset: function(mess) {
				message = mess;
			},
			unsetposmessage: function() {
				message = "";
			},
			// Display number pad, set click listeners, and capture user input.
			typeanswer: function(){
				var save_ans = "";
				var user_ans = "";
				var inpts = byId('main_pad');
				var digicount = 0;
				byId('comp').innerHTML = "Enter your Answer";
				byId('comp').className = "ptext";
				byId('main_pad').style.display = 'block';
				
				function numgrab(inp){
					var num = inp;
					var pen;
					if(digicount > 2){
						byId('comp').innerHTML = save_ans + "<br /><small>The max is 3 digits</small>";
						byId('comp').className = "ptext smtext";
					}
					else{
						digicount += 1;
						pen = save_ans + " " + num;
						save_ans = pen;
						user_ans = "" + user_ans + inp;
						byId('comp').innerHTML = pen;
						byId('comp').className = "ptext";
					}
				}
				
				function goback(){
					var c = 2;
					var rap = save_ans;
					var pap = user_ans;
					var tap = "";
					var lak = "";
					if(digicount === 1){
						c = 1;
					}
					if(digicount === 0){
						return;
					}
					digicount -= 1;
					tap = rap.slice(0,-c);
					save_ans = tap;
					lak = pap.slice(0,-1);
					user_ans = lak;
					if(digicount === 0){
						tap = "Enter your Answer";
					}
					byId('comp').innerHTML = tap;
					byId('comp').className = "ptext";
					
				}
				function removelist(){
					inpts.removeEventListener('click', pad);
				}
				function entered(){
					byId('play').style.display = '';
					byId('comp').className += " hidden";
					byId('main_pad').style.display = '';
					removelist();
					interactWithUser.answerQ(user_ans);
				}
				function pad(event){
					var tid = event.target.getAttribute("id");
					 if (event.target.classList.contains("num_ton")) {
						numgrab(tid);
						}
					if(event.target.classList.contains("num_bac")) {
						goback();	
						}
					if(event.target.classList.contains("num_ent")) {
						entered();	
						}
						return false;
				}
				inpts.addEventListener("click", pad);
			},
			// Display each computation to the user as part of a mental math problem.
			showProblem: function(w,z){
				var problem = w;
				var result = z;
				var count = problem.length;
				var delay = NewSpeed.expospeed("gsp");
				var i = 0;
				function doSetTimeout(wait) {
					  setTimeout(function() {
					  byId('comp').className += " hidden";
					  setTimeout(function() {
					  iterate();},500);}, wait);
					}
				function iterate(){
					i += 1;
					if(i<count){
						byId('comp').innerHTML = problem[i];
						byId('comp').className = "ptext";
						setTimeout(function() {
							doSetTimeout(delay);},500);
					}
					else{
						interactWithUser.typeanswer();
					}
				}
				function first_it() {
					byId('comp').innerHTML = "What is<br />" + problem[i];
					byId('comp').className = "ptext margtop";
					setTimeout(function() {
						doSetTimeout(delay);},500);
				}
				setTimeout(function(){
					byId('comp').innerHTML = "Ready?";
					byId('comp').className = "ptext";
						setTimeout(function(){
							byId('comp').className += " hidden";
							setTimeout(function() {
							first_it();},1200);
						},2500);},1000);
				problemo = problem;
				resolve = result;
			}
		};
	})();
	
	// This module contains two functions that create the math problems for their respective games.
	var doMath = (function() { 
		var Indx = NumArIndx;
		
		return {
			createProblem: function() {
				var prob = [];
				var answer = 0;
				var last = 0;
				var prev = 0;
				var lob = Indx;
				
				function getRandom(min, max) {
					return Math.floor(Math.random() * (max - min + 1)) + min;
				}
				
				function getRand(x,y){
					var a = 0;
					var b = 0;
					var c = x;
					var f = y;
					var i = lob;
					var numbers = [17,13,12,4,10,7,11,15,14,18,8,3,5,11,2,19,16,3,20,6,16,4,14,12,10,15,9,20,19,17,13,8,18,6,7,2,5,9,
						15,18,20,2,4,3,9,11,8,17,18,20,8,14,19,7,3,10,5,4,6,9,13,17,16,2,13,14,5,19,12,15,10,12,7,11,6,16,
						16,17,4,7,9,15,10,20,9,16,8,3,12,11,19,4,13,14,18,6,18,11,7,10,5,15,19,2,17,6,3,14,13,8,5,20,12,2,
						4,17,10,8,16,9,12,11,14,20,6,15,18,3,19,13,2,5,7]; //133
					
					if(i > 114){
						i = 0;
					}
					do{
						a = 0;
						b = numbers[i];
						i += 1;
						if(b < c || b > f){
							a = 1;
						}
						else if(b === last || b === prev){
							a = 1;
						}
					} while(a === 1);
					lob = i;
					return b;
				}
				
				function firstComp() {
					var a = 0;
					var b = 0;
					var c = 0;
					var m = "";
					var firstVars = NewLevel.expolevel("first");
					var s1 = firstVars[0];
					var s2 = firstVars[1];
					var s3 = firstVars[2];
					var s4 = firstVars[3];
					var s5 = firstVars[4];
					var s6 = firstVars[5];
					var s7 = firstVars[6];
					var s8 = firstVars[7];
					var s9 = firstVars[8];
					var ch = getRandom(1,2);
					
					switch(ch){
						case 1:
							a = getRandom(s1,s2);
							c = s9 - a;
							if(c > s4){
								c = s4;
							}
							b = getRand(s3,c);
							answer = a + b;
							m = a + " plus " + b;
							last = b;
							prev = a;
							break;
						case 2:
							a = getRandom(s5,s6);
							c = a - 1;
							if(c > s8) {
								c = s8;
							}
							b = getRand(s7,c);
							answer = a - b;
							m = a + " minus " + b;
							last = b;
							break;	
					}
					prob.push(m);
					compBuild();
				}
				function compBuild() {
					var b = 0;
					var c = 0;
					var allVars = NewLevel.expolevel("level");
					var g1 = allVars[0];
					var g2 = allVars[1];
					var g3 = allVars[2];
					var g4 = allVars[3];
					var g5 = allVars[4];
					var g6 = allVars[5];
					var g7 = allVars[6];
					var g8 = allVars[7];
					var g9 = allVars[8];
					var i = 0;
					var j = 0;
					var t = "";
					for(i = 0; i < g3; i += 1){
						j = getRandom(1,2);
						if(answer > g4){
							if(j % 2 === 0){
								b = getRand(g5,g6);
								t = "minus";
							}
							else {
								b = getRand(g9,g6);
								t = "minus";
							}
								
						}
						else if(answer < g7) {
							if(j % 2 === 0){
								if(g2 - answer > g8){
									c = g8;
								}
								else {
									c = g2 - answer;
								}
								b = getRand(g5,c);
								t = "add";
							}
							else {
								if(g2 - answer > g8){
									c = g8;
								}
								else {
									c = g2 - answer;
								}
								b = getRand(g9,c);
								t = "add";
							}
						}
						else if((last % 2) === 0) {
							if(g2 - answer > g8){
								c = g8;
							}
							else {
								c = g2 - answer;
							}
							b = getRand(g5,c);
							t = "add";
						}
						else {
							if(answer > g6){
								c = g6;
							}
							else {
								c = answer;
							}
							b = getRand(g5,c);
							t = "minus";
						}
						if(t === "add"){
							last = b;
							prev = answer;
							answer = answer + b;
							prob.push("plus " + b);
						}
						else if(t === "minus"){
							last = b;
							prev = 0;
							answer = answer - b;
							prob.push("minus " + b);
						}
					}
					interactWithUser.showProblem(prob,answer);
				}
				firstComp();
				Indx = lob;
			}, //close createproblem()
		
			complexProblem: function() {
				var prob = [];
				var answer = 0;
				var last = 0;
				var prev = 0;
				var d = 0;
				var e = 0;
				var lob = Indx;
				
				function getRandom(min, max) {
				return Math.floor(Math.random() * (max - min + 1)) + min;
				}
				function getRand(x,y){
					var a = 0;
					var b = 0;
					var c = x;
					var f = y;
					var numbers = [17,13,12,4,7,11,15,14,18,8,3,5,11,2,19,16,3,20,6,16,4,14,12,10,15,9,20,19,17,13,8,18,6,7,2,5,9,
						15,18,20,2,4,3,9,11,8,17,18,20,8,14,19,7,3,10,5,4,6,9,13,17,16,2,13,14,5,19,12,15,12,7,11,6,16,
						16,17,4,7,9,15,20,9,16,8,3,12,11,19,4,13,14,18,6,18,11,7,10,5,15,19,2,17,6,3,14,13,8,5,20,12,2,
						13,17,18,8,16,9,12,11,14,20,6,15,10,3,19,4,2,5,7]; //130 missing 3 10's
					var i = lob;
					if(i > 111){
						i = 0;
					}
					do{
						a = 0;
						b = numbers[i];
						i += 1;
						if(b < c || b > f){
							a = 1;
						}
						else if(b === last || b === prev){
							a = 1;
						}
					} while(a === 1);
					lob = i;
					return b;
				}
				
				function first() {
					var a = 0;
					var b = 0;
					var c = 0;
					var f = 0;
					var g = 0;
					var m = "";
					var cplxVars = NewLevel.expolevel("plexlevel");
					var f1 = cplxVars[0];
					var f2 = cplxVars[1];
					var f3 = cplxVars[2];
					var f4 = cplxVars[3];
					var f5 = cplxVars[4];
					var f6 = cplxVars[5];
					var f7 = cplxVars[6];
					var f8 = cplxVars[7];
					var f9 = cplxVars[8];
					var f10 = cplxVars[9];
					var f11 = cplxVars[10];
					
					var ch = getRandom(1,5);
					switch(ch){
						case 1:
							a = getRandom(f1,f2);
							b = getRand(f3,f4);
							answer = a + b;
							m = a + " plus " + b;
							last = b;
							prev = a;
							break;
						case 2:
							a = getRandom(f5,f6);
							b = getRand(f7,f8);
							answer = a - b;
							m = a + " minus " + b;
							last = b;
							prev = 2;
							break;
						case 3:
						case 4:
							a = getRand(f9,f10);
							c = f6/a;
							f = Math.floor(c);
							if(f > f10){
								f = f10;
							}
							b = getRand(f11,f);
							answer = a * b;
							m = a + " multiplied by " + b;
							prev = a;
							last = b;
							e += 1;
							break;
						case 5:
							b = getRand(f9,f10);
							c = f6/b;
							f = Math.floor(c);
							if(f > f10){
								f = f10;
							}
							g = getRand(f11,f);
							a = b * g;
							answer = a/b;
							m = a + " divided by " + b;
							last = b;
							prev = 0;
							d += 1;
							break;
					}
					prob.push(m);
					moreComplex();
				}
				function moreComplex() {
					var b = 0;
					var c = 0;
					var f = 0;
					var g = 0;
					var h = 0;
					var i = 0;
					var j = 0;
					var k = 0;
					var l = 0;
					var t = "";
					var moreVars = NewLevel.expolevel("morelevel");
					var k1 = moreVars[0];
					var k2 = moreVars[1];
					var k3 = moreVars[2];
					var k4 = moreVars[3];
					var k5 = moreVars[4];
					var k6 = moreVars[5];
					var k7 = moreVars[6];
					var k8 = moreVars[7];
					var k9 = moreVars[8];
					var k10 = moreVars[9];
					var k11 = moreVars[10];
					var k12 = moreVars[11];
					var k13 = moreVars[12];
					var k14 = moreVars[13];
					var q = 0;
					
					for(i=0; i < k1; i += 1){
						q = getRandom(1,2);
						if(answer > k2){
							if((last % 2 === 0) || (d === 0 && i > 1)) {
								if(answer > 30){
									c = Math.floor(answer / k4);
									if(c * k4 < answer){
										c = c + 1;
									}
								}
								else if(answer <= 30){
									c = k3;
								}
								h = getRand(c,k4);
								j = answer % h;
								if(answer % h === 0) {
									t = "divi";
									}
								else if(i !== k1-1){
									if((answer + (h - j) + h <= k6 && (answer + (h - j) + h) / h <= k4) && ((h - j) + h <= k7 && last !== (h - j) +h)){
										k = (h - j) +h;
										answer = answer + k;
										prob.push("plus " + k);
										i += 1;
										t = "divi";
									}
									else if((answer - (h + j) > h && last !== h + j) && (h + j <= k9)){
											k = h + j;
											answer = answer - k;
											prob.push("minus " + k);
											i += 1;
											t = "divi";
									}
									else if((h-j > j && (answer + h - j) / h <= k4) && (h - j >= k8 && last !== h - j)) {
											k = h - j;
											answer = answer + k;
											prob.push("plus " + k);
											i += 1;
											t = "divi";
									}
									else if(j >= k10 && j !== last){
										answer = answer - j;
										prob.push("minus " + j);
										i += 1;
										t = "divi";
									}
									else {
										t = "minus";
									}
								}
								else {
									t = "minus";
								}	
							}
							else {
								if(q % 2 === 0){
									if(answer > k13 && answer <=k5) {
										c = k6-answer;
										if(c > k7) {
											c = k7;
										}
										if(c - k8 > 5){
											f = c - 5;
										}
										else{ 
											f = k8;
										}
										b = getRand(f,c);
										t = "addi";
									}
									else if(answer <= k14){
										c = answer - 1;
										if(c >k9) { c = k9; }
										if(c - k10 > 5){
											f = c - 5;
										}
										else{
											f = k10;
										}
										h = getRand(f,c);
										t = "minus";
									}
									else {
										if(answer <=k5) {
											c = k6-answer;
											if(c > k7) {
												c = k7;
											}
											if(c - k8 > 5){
												f = c - 5;
											}
											else{ 
												f = k8;
											}
											b = getRand(f,c);
											t = "addi";
										}
										else {
											c = answer - 1;
											if(c >k9){ 
												c = k9;
											}
											if(c - k10 > 5){
												f = c - 5;
											}
											else{
												f = k10;
											}
											h = getRand(f,c);
											t = "minus";
										}
									}
								}
								else {
									if(answer <=k5) {
										c = k6-answer;
										if(c > k7) {
											c = k7;
										}
										b = getRand(k8,c);
										t = "addi";
									}
									else {
										c = answer - 1;
										if(c >k9) { c = k9; }
										h = getRand(k10,c);
										t = "minus";
									}
								}
							}
						}
						else {
							if(answer <= k11){
								if(e === 0 && i > 1){
									f = k6/answer;
									g = Math.floor(f);
									if(g > k11) {
										g = k11;
									}
									b = getRand(k12,g);
									t = "multi";
								}
								else if(last % 3 === 0 && q % 2 === 0){ 
									f = k6/answer;
									g = Math.floor(f);
									if(g > k11) {
										g = k11;
									}
									h = g - 3;
									if(h <= k12){
										h = k12;
									}
									b = getRand(h,g);
									t = "multi";
								}
								else if(prev < k2 && prev !== 0){
									f = k6/answer;
									g = Math.floor(f);
									if(g > k11) {
										g = k11;
									}
									h = g - 3;
									if(h <= k12){
										h = k12;
									}
									b = getRand(h,g);
									t = "multi";
								}
								else {
									b = getRand(k8,k7);
									t = "addi";
								}
							}
							else { 
								h = getRand(k10,k11);
								t = "minus";
							}
						}
						if(t === "divi"){
							prev = 0;
							answer = answer/h;
							last = h;
							prob.push("divided by " + h);
							d += 1;
							}
						else if(t === "minus"){
							last = h;
							prev = 2;
							answer = answer - h;
							prob.push("minus " + h);
						}
						else if(t === "addi"){
							last = b;
							prev = answer;
							answer = answer + b;
							prob.push("plus " + b);
						}
						else if(t === "multi"){
							last = b;
							prev = answer;
							e += 1;
							answer = answer * b;
							prob.push("multiplied by " + b);
						}
					}
					interactWithUser.showProblem(prob,answer);
				}
				first();
				Indx = lob;
			} //close coplexproblem()
		}; //end return object
	})(); //close do Math module
	
	// This module keeps track of and stores user stats in localStorage.
	var stats = (function(){
		var game = 0;
		var level = 0;
		var speed = 0;
		var bestalert = 0;
		var gmstats1 = [0,0,0,0,""];
		var gmstats2 = [0,0,0,0,""];
		
		// Determines if user is about to earn a Best Game
		function bestgame(){
			var slevel = 0;
			var sspeed = 0;
			bestalert = 0;
			
			if(game === 1){
				slevel = gmstats1[0];
				sspeed = gmstats1[1];
			}
			else {
				slevel = gmstats2[0];
				sspeed = gmstats2[1];
				
			}
			if(slevel === 0){
				bestalert = 1;
			}
			if(slevel === level && sspeed < speed){
				bestalert = 1;
			}
			if(slevel < level) {
				bestalert = 1;
			}
			if(bestalert === 1) {
				userProgress.possiblebest();
			}
			else {
				userProgress.notbest();
			}
		}
		
		// Sets new Best Game
		function setbest(){
				if(game === 1){
					gmstats1[0] = level;
					gmstats1[1] = speed;
					localstore.statstock("statsets1", gmstats1);
				}
				else{
					gmstats2[0] = level;
					gmstats2[1] = speed;
					localstore.statstock("statsets2", gmstats2);
				}
				bestalert = 0;
				userProgress.notbest();
				
			}
			
		// Get stats from localStorage
		function setArr(gme) {
			var temp = [];
			if(gme === 1 && gmstats1[2] === 0) {
				temp = localstore.shop("statsets1"); 
				if(temp !== undefined) {
					gmstats1 = temp;
				}
			}
			else if(gme === 2 && gmstats2[2] === 0) {
				temp = localstore.shop("statsets2");
				if(temp !== undefined) {
					gmstats2 = temp;
				}
			}
			else {
				return;
			}
		}
		
		return {
			
			// Clear stats
			clearunits: function(gm) {
				if(gm === "1") {
					gmstats1 = [0,0,0,0,""];
					localstore.statstock("statsets1", gmstats1);
				}
				else {
					gmstats2 = [0,0,0,0,""];
					localstore.statstock("statsets2", gmstats2);
				}
				bestgame();
			},
			
			// Return current stats.
			currentstats: function(inp) {
				if(inp === 1) {
					return gmstats1;
				}
				else {
					return gmstats2;
				}
			},
			
			// Set current level on game load
			currentlevel: function(x,y,z){
				var current = x;
				if(current === "1") {
					game = 1;
					setArr(1);
				}
				else {
					game = 2;
					setArr(2);
				}
				level = y;
				speed = z;
				bestgame();
			},
			
			// This function is called if the game, level or speed of play changes due to
			// the user interacting with the Settings page
			changeset: function(a,b){
				var x = a;
				var y = b;
				if(x === 1){
					if(y === "1"){
						game = 1;
						setArr(1);
					}
					else{
						game = 2;
						setArr(2);
					}
					userProgress.zerostreak();
				}
				if(x === 2){
					level = y;
				}
				if(x === 3){
					speed = y;
				}		
				bestgame();
			},
			
			// This function adds data to the stats data each time a game is played.
			addstat: function(gadd){
				var temp = "";
				var sw = "";
				var a = "";
				var sg = "";
				var streak = "";
				var len = 0;
				var x = gadd;
				var stat1 = [];
				var stat2 = [];
				if(game === 1){
					stat1 = gmstats1;
					if(stat1[2] !== 0){
						sg = gmstats1[2];
						sg = sg*1;
						sg += 1;
						
						stat1[2] = sg;
					}
					else {
						stat1[2] = 1;
					}
					if(x === 1){
						a = "W ";
						if(stat1[3] !== 0){
							sw = stat1[3];
							sw = sw*1;
							sw += 1;
							stat1[3] = sw;
						}
						else{
							stat1[3] = 1;
						}
					}
					else {
						a = "x ";
					}
					if(stat1[4] !== ""){
						streak = stat1[4];
						len = streak.length;
						if(len >= 20){
							temp = streak.slice(0,-2);
							stat1[4] = a + temp;
						}
						else {
							stat1[4] = a + streak;
						}
					}
					else{
						stat1[4] = a;
					}
					gmstats1 = stat1;
					if(x === 1 && bestalert === 1){
						setbest();
					}
					else {
						localstore.statstock("statsets1",gmstats1);
					}
				}
				if(game === 2){
					stat2 = gmstats2;
					if(stat2[2] !== 0){
						sg = stat2[2];
						sg = sg*1;
						sg += 1;
						stat2[2] = sg;
					}
					else {
						stat2[2] = 1;
					}
					if(x === 1){
						a = "W ";
						if(stat2[3] !== 0){
							sw = stat2[3];
							sw = sw*1;
							sw += 1;
							stat2[3] = sw;
						}
						else{
							stat2[3] = 1;
						}
					}
					else {
						a = "x ";
					}
					if(stat2[4] !== ""){
						streak = stat2[4];
						len = streak.length;
						if(len >= 20){
							temp = streak.slice(0,-2);
							stat2[4] = a + temp;
						}
						else {
							stat2[4] = a + streak;
						}
					}
					else{
						stat2[4] = a;
					}
					gmstats2 = stat2;
					if(x === 1 && bestalert === 1){
						setbest();
					}
					else {
						localstore.statstock("statsets2",gmstats2);
					}
				}
			}
		};
	})();
	
	// This module tracks user progress and delivers a message each time a Best Game is earned
	// or the user wins 3 games in a row.
	var userProgress = (function() {
		var best = 0;
		var streak = 0;
		var streakstate = 0;
		var i = getRandom(0,9);
		var posExclaim = ["Awesome!","Good Job!","Ka-Pow!","Rock On!","Super Job!","Shazam!","Wheeew Wee!","Great Going!","Bam!","All Right!","Holy Moly!","Wow!","Jumpin Junipers!","Yeah!","High Five!"];
		
		function getRandom(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}
		
		return {
			
			exclamation: function() {
				var exclaim = posExclaim[i];
				if(i == 9) {
					i = 0;
				}
				else {
					i++;
				}
				return exclaim;
			},
			possiblebest: function() {
				var exclaim = userProgress.exclamation();
				var message = "<br />" + exclaim + " You just earned a<br />Best Game!";
				interactWithUser.positivemessageset(message);
				best = 1;
			},
			notbest: function() {
				if(best === 1) {
					interactWithUser.unsetposmessage();
					best = 0;
				}
			},
			streakupdate: function(bool) {
				var exclaim = "";
				var message = "";
				var num = 0;
				if(bool === 1) {
					streak += 1;
				}
				else {
					streak = 0;
				}
				if(streakstate === 1 && best !== 1) {
						interactWithUser.unsetposmessage();
						streakstate = 0;
				}
				if((streak + 1) % 3 === 0) {
					if(best !== 1) {
						num = streak + 1;
						exclaim = userProgress.exclamation();
						message = "<br />" + exclaim + "<br />That's " + num + " wins in a row!";
						interactWithUser.positivemessageset(message);
						streakstate = 1;
					}
				}
			},
			zerostreak: function() {
				streak = 0;
				if(streakstate === 1) {
						interactWithUser.unsetposmessage();
						streakstate = 0;
				}
			}
		};
	})();
	
	// Sets the current game
	function GameSet() {
		this.game = "";
		GameSet.prototype.Setgame = function(ind) {
			var rac = ind;
			var radgame = document.getElementsByName('radio-game');
			var gval = 0;
			var i = 0;
			for (i = 0; i < 2; i += 1) {
				if (radgame[i].checked) {
					gval = radgame[i].value;       
				}
			}
			this.game = gval;
			localstore.stock(0, gval);
			if(rac === 1){
				userProgress.zerostreak();
				stats.changeset(1, gval);
			}
		};
		GameSet.prototype.playgame = function(){
			if(this.game === "1"){
				doMath.createProblem();
			}
			else {
				doMath.complexProblem();
			}
		};
		GameSet.prototype.expogame = function() {
			return this.game;
		};
	}
	var Newgame = new GameSet();
	Newgame.Setgame(0);
	
	// Returns variables for current level with respect to the current game
	function LevelSet() {
		this.first = [];
		this.level = [];
		this.plexlevel = [];
		this.morelevel = [];
		this.res;
		var chnge;
		
		LevelSet.prototype.SetLevel = function(ind) {
			var mac = ind;
			var radlevel = document.getElementsByName('radio-level');
			var val = "";
			var i = 0;
			var gameNow = Newgame.expogame();
			for (i = 0; i < 5; i += 1) {
				if (radlevel[i].checked) {
					val = radlevel[i].value;       
				}
			}
			if(gameNow === "1"){
				if(val === 'ch1'){
					this.first = [3, /*min for initial add*/
					7, /*max for initial add*/
					2, /*min for numb to be added*/
					7, /*max numb to be added*/
					5, /*min for initial subtract*/
					10, /*max for initial subtract*/
					3, /*min for numb to be subtract*/
					7, /*max for numb to be subtract*/
					10]; /*ceiling*/
					this.level = [2, /*min for initial rand number*/
					10, /*ceiling for initial rand number*/
					5, /*number of iterations total = it + 1*/
					7, /*cutoff above which subtraction will always result*/
					2, /*min for rand numbers being added or subtracted*/
					7, /*max for rand number being subtracted*/
					4, /*cutoff below which addition will always result*/
					7, /*max possible number that could be added*/
					4]; /*min for push function*/
					
				}
				if(val === 'ch2'){
					this.first = [5,10,5,10,7,15,5,10,15];
					this.level = [3,15,5,11,3,10,5,10,5];
				}
				if(val === 'ch3'){
					this.first = [5,15,5,12,15,25,7,12,25];
					this.level = [3,25,5,20,3,12,5,12,7];	
				}
				if(val === 'ch4'){
					this.first = [9,20,7,15,21,35,9,15,35];
					this.level = [4,35,6,29,5,15,12,15,10];	
				}
				if(val === 'ch5'){
					this.first = [11,30,11,20,35,50,11,20,50];
					this.level = [5,50,6,43,5,15,15,20,11];
				}
			}
			else {
				if(val === 'ch1'){
					this.plexlevel = [5, //first min random for add
					12, // first max random for add
					3, //first min number to add
					10, //first max for number to add
					10, // first min for sub
					25, //first max for sub
					3, //first min for number to be sub
					9, //first max for number to be sub
					3, //first min for multi and div
					8, //first max for multi and div
					2]; //first min for number to be multi or div
					this.morelevel = [5, //number of iterations
					10, //cutoff above which we will first attempt divide
					3, //min for divisor
					8, //max for divisor
					18, //cutoff above which will subtract
					25, //ceiling
					12, //max to be added
					3, //min to be added
					12, //max to be sub
					3, //min to be sub
					8, //max to be multi
					2, //min to be multi
					10, //above which you will add for first add
					25]; //below which you will subtract first sub
				}
				if(val ==='ch2'){
					this.plexlevel = [10,30,5,15,15,45,5,12,4,9,4];
					this.morelevel = [5,15,3,9,33,45,15,5,15,5,9,3,25,20];
				}
				if(val === 'ch3'){
					this.plexlevel = [25,50,5,15,25,65,7,15,5,10,5];
					this.morelevel = [5,20,5,10,55,65,15,5,15,5,10,3,35,20];	
				}
				if(val === 'ch4'){
					this.plexlevel = [35,60,5,15,30,81,7,15,5,11,6];
					this.morelevel = [6,20,5,11,70,81,18,7,18,7,11,3,45,25];	
				}
				if(val === 'ch5'){
					this.plexlevel = [45,80,5,20,30,100,9,20,6,12,7];
					this.morelevel = [6,20,5,12,90,100,20,7,20,7,12,3,60,25];
				}
			}
			this.res = val.charAt(2);
			byId('levelhead').innerHTML = "Level " + this.res;
			byId('levhead').innerHTML = "Level " + this.res;
			localstore.stock(1, val);
			if(mac === 2){
			stats.changeset(mac,this.res);
			}
		};
		LevelSet.prototype.expolevel = function(arname) {
			var ret = "";
			switch(arname) {
				case "first":
					ret = this.first;
					break;
				case "level":
					ret = this.level;
					break;
				case "plexlevel":
					ret = this.plexlevel;
					break;
				case "morelevel":
					ret = this.morelevel;
					break;
				case "res":
					ret = this.res;
					break;
			}
			return ret;
		};
	}
	var NewLevel = new LevelSet();
	NewLevel.SetLevel(0);
	
	// Sets the current speed
	function SetSpeed() {
		this.newsp = "";
		this.gsp = "";
		SetSpeed.prototype.speed = function(spe,ind) {
			var spd = spe;
			var mac = ind;
			var val = byId(spd).value;
			switch(val){
				case "100":
					this.gsp = 8000;
					break;
				case "150":
					this.gsp = 7000;
					break;
				case "200":
					this.gsp = 6000;
					break;
				case "250":
					this.gsp = 5000;
					break;
				case "300":
					this.gsp = 4200;
					break;
				case "350":
					this.gsp = 3400;
					break;
				case "400":
					this.gsp = 2600;
					break;
				case "450":
					this.gsp = 1800;
					break;
				case "500":
					this.gsp = 1000;
					break;
			}
		this.newsp = val;
		byId('speedout').innerHTML = val;
		byId('slideout').innerHTML = val;
		localstore.stock(2, val);
		if(mac === 3){
			stats.changeset(3,val);
		}
		};
		SetSpeed.prototype.expospeed = function(amp) {
			if(amp === "newsp") {
				return this.newsp;
			}
			if(amp === "gsp") {
				return this.gsp;
			}
		};
	}
	var NewSpeed = new SetSpeed();
	NewSpeed.speed("slidespeed",0);
	
	 // This module contains handlers for all buttons on pages other than the Settings and About pages.
	var handlers = (function() {
		var p1 = "settings";
		var p2 = 0;
		
		function statdefault() {
			byId('statsb').className = 'stat2 btn1';
			byId('statsb1').className = 'stat2 btn1';
		}
		function reviewdefault() {
			byId('re_view').className = 'rev btn1';
			byId('re_view1').className = 'rev btn1';
		}
		
		
		return {
			
			setanswer: function() {
				p1 = 'p_lay';
				init.setlistening();
				init.set_rev();
				init.set_stat();
			},
			
			setgam: function() {
				var callback = p1;
				byId('showstat').style.display = '';
				byId('settings').style.display = 'block';
				init.setsettings();
				init.removelist();
				var actions = {
					stats: function() {
						byId('stathead').style.display = '';
						statdefault();
						byId('slide').style.display = '';
						init.un_set_rev();
						init.unset_clear();
						if(p2 === 1) {
							init.unset_clearuserstat();
						}
					},
					p_lay: function() {
						init.un_set_stat();
						init.un_set_rev();
						byId('levhead').style.display = '';
					},
					review: function() {
						byId('levhead').style.display = '';
						reviewdefault();
						init.un_set_stat();
					},
					settings: function() {
						byId('stathead').style.display = '';
						reviewdefault();
						statdefault();
						init.unset_clear();
						if(p2 === 1) {
							init.unset_clearuserstat();
						}
					}
				};
				actions[callback]();
				p1 = "settings";
				return false;
			},
			
			playgm: function() {
				var callback = p1;
				byId('showstat').style.display = '';
				byId('play').style.display = 'block';
				init.removelist();
				
				var actions = {
					stats: function() {
						byId('stathead').style.display = '';
						statdefault();
						init.un_set_rev();
						init.unset_clear();
						if(p2 === 1) {
							init.unset_clearuserstat();
						}
					},
					p_lay: function(){
						init.un_set_stat();
						init.un_set_rev();
					},
					review: function() {
						reviewdefault();
						init.un_set_stat();
					},
					settings: function() {
						byId('stathead').style.display = '';
						reviewdefault();
						statdefault();
						init.unset_clear();
						if(p2 === 1) {
							init.unset_clearuserstat();
						}
					}
				};
				actions[callback]();
				Newgame.playgame();
				return false;
			},
		
			rear_view: function() {
				byId('showstat').style.display = '';
				if(p1 === "stats"){
					byId('stathead').style.display = '';
					statdefault();
					init.set_stat();
					init.unset_clear();
					if(p2 === 1) {
						init.unset_clearuserstat();
					}
				}
				init.un_set_rev();
				reviewproblem.reviewgame();
				p1 = "review";
				return false;
			},
		
			seestats: function() {
				byId('showstat').style.display = '';
				byId('levhead').style.display = '';
				if(p1 === "review"){
					reviewdefault()
					init.set_rev();
				}
				showstats.displaystat(p1);
				init.un_set_stat();
				init.set_clear();
				p1 = "stats";
				return false;
			},
			
			promptclear: function() {
				showstats.clearprompt();
				init.set_clearuserstat();
				p2 = 1;
			},
			promptcancel: function() {
				showstats.cancelprompt();
				p2 = 0;
				init.unset_clear();
				init.set_clear();
			},
			clearstats: function() {
				showstats.executeclear();
				p2 = 0;
				init.unset_clear();
				init.set_clear();
			}
		};
	})();
	
	/******************************************************************************
	/* This module adds and removes all of the app's event listeners except for the
	/* listener in typeanswer(). The module also contains handlers for the Settings
	/* page and the About page (the page you see when the app loads).
	/*******************************************************************************/	
	var init = (function() {
		
		function levelHandler() {
			var levelrad = document.getElementsByName('radio-level');
			var i;
			function handle(){
				NewLevel.SetLevel(2);
			}
			for(i = 0; i < 5; i += 1) {
				levelrad[i].onclick = handle;
			}
		}
		function gameHandler() {
			var gamerad = document.getElementsByName('radio-game');
			var gamelen = gamerad.length;
			var i;
			function handle(){
				Newgame.Setgame(1);
				NewLevel.SetLevel(0);
			}
			for(i = 0; i < 2; i += 1) {
				gamerad[i].onclick = handle;
			}
		}
		function levelremove(){
			var levelrad = document.getElementsByName('radio-level');
			var levellen = levelrad.length;
			var i;
			function handle(){
				NewLevel.SetLevel(2);
			}
			for(i = 0; i < 5; i += 1) {
				levelrad[i].removeEventListener('click', handle);
			}
		}
		function gameremove(){
			var gamerad = document.getElementsByName('radio-game');
			var gamelen = gamerad.length;
			var i;
			function handle(){
				Newgame.Setgame(1);
				NewLevel.SetLevel(0);
			}
			for(i = 0; i < 2; i += 1) {
				gamerad[i].removeEventListener('click', handle);
			}
		}
		function setspeed1(){
			var sp = 0;
			NewSpeed.speed("slidespeed",3);
			sp = byId('slidespeed').value;
			byId('slidespeed2').value = sp;
		}
		function setspeed2(){
			var sp;
			NewSpeed.speed("slidespeed2",3);
			sp = byId('slidespeed2').value;
			byId('slidespeed').value = sp;
		}
		function startgame() {
			byId('aboutpage').style.display = 'none';
			byId('settings').style.display = 'block';
			init.unsetabout();
			init.setsettings();
			return false;
		}
		function goabout() {
			byId('settings').style.display = '';
			byId('aboutpage').style.display = 'block';
			init.un_setsettings();
			init.setabout();
			return false;
		}
		function goplay(){
			byId('settings').style.display = '';
			byId('play').style.display = 'block';
			Newgame.playgame();
			init.un_setsettings();
			return false;
		}
		function gostats(){
			byId('settings').style.display = '';
			showstats.displaystat("settings");
			init.setlistening();
			init.un_setsettings();
			init.set_clear();
			return false;
		}
		
		return {
			
			setabout: function() {
				byId('begingame').addEventListener("click", startgame);
			},
			unsetabout: function() {
				byId('begingame').removeEventListener('click', startgame);
			},
			set_clear: function() {
				byId('clrstat').addEventListener("click", handlers.promptclear);
			},
			unset_clear: function() {
				byId('clrstat').removeEventListener('click', handlers.promptclear);
			},
			set_clearuserstat: function() {
				byId('cancel1').addEventListener("click", handlers.promptcancel);
				byId('clear1').addEventListener("click", handlers.clearstats);
			},
			unset_clearuserstat: function() {
				byId('cancel1').removeEventListener('click', handlers.promptcancel);
				byId('clear1').removeEventListener('click', handlers.clearstats);
			},
			setlistening: function(){
				byId('setup').addEventListener("click", handlers.setgam);
				byId('setup1').addEventListener("click", handlers.setgam);
				byId('pgame').addEventListener("click", handlers.playgm);
				byId('pgame1').addEventListener("click", handlers.playgm);
				byId('slidespeed2').addEventListener("change", setspeed2);
			},
			removelist: function(){
				byId('setup').removeEventListener('click', handlers.setgam);
				byId('setup1').removeEventListener("click", handlers.setgam);
				byId('pgame').removeEventListener('click', handlers.playgm);
				byId('pgame1').removeEventListener('click', handlers.playgm);
				byId('slidespeed2').removeEventListener('change', setspeed2);
			},	
			setsettings: function(){
				levelHandler();
				gameHandler();
				byId('about').addEventListener("click", goabout);
				byId('status').addEventListener("click", gostats);
				byId('go').addEventListener("click", goplay);
				byId('slidespeed').addEventListener("change", setspeed1);
			},
			un_setsettings: function(){
				levelremove();
				gameremove();
				byId('about').removeEventListener('click', goabout);
				byId('status').removeEventListener('click', gostats);
				byId('go').removeEventListener('click', goplay);
				byId('slidespeed').removeEventListener('change', setspeed1);
			},
			set_stat: function() {
				byId('statsb').addEventListener("click", handlers.seestats);
				byId('statsb1').addEventListener("click", handlers.seestats);
			},
			un_set_stat: function(){
				byId('statsb').removeEventListener("click", handlers.seestats);
				byId('statsb1').removeEventListener("click", handlers.seestats);
			},
			set_rev: function(){
				byId('re_view').addEventListener("click", handlers.rear_view);
				byId('re_view1').addEventListener("click", handlers.rear_view);
			},
			un_set_rev: function(){
				byId('re_view').removeEventListener('click', handlers.rear_view);
				byId('re_view1').removeEventListener('click', handlers.rear_view);
				},
			set_stats: function(){
				var a = Newgame.expogame();
				var b = NewLevel.expolevel("res");
				var c = NewSpeed.expospeed("newsp");
				stats.currentlevel(a,b,c);
			} 
		};
	})();
	
	// Set event listener for the landing page which is also the About page.
	init.setabout();
	
	// Send current game levels to the Stats module.
	init.set_stats();
	
})();


