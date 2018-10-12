//=============================================================================
// Bluebooth Plugins - Stat Bonuses
// BBS_StatBonuses.js
//=============================================================================

//=============================================================================
 /*:
 * @title Stat Bonuses
 * @author Michael Morris (https://www.patreon.com/bluebooth)
 * @date Nov 6, 2017
 * @filename BBS_OrgOptionsMenu.js
 * 
 * @plugindesc v1.01a Properly handles Actor/Monster bonuses.
 * Special Thanks to Smjjames for discovering the need for  this plugin.
 * Special Thanks to 'Ramza' Michael Sweeney for helping so much with testing.
 * 
 * ============================================================================
 * Terms of Use
 * ============================================================================
 *  - Free for use in non-commercial projects with credits
 *  - Contact me for commercial use
 * 
 * ============================================================================
 * Parameters
 * ============================================================================
 * @param Graphics Option Text
 * @desc Text to display for the graphics option item.  Default: Graphics
 * @default Graphics
 * 
 * @help
 * ============================================================================
 * Description
 * ============================================================================
 *
 * Properly handles Actor/Monster bonuses.
 * 
 * ============================================================================
 * Change Log
 * 
 * 1.01 - Plugin finished.
 * 
 */
//=============================================================================

//=============================================================================
var Imported = Imported || {} ;
var BBS = BBS || {};
Imported.StatBonuses = 1;
BBS.StatBonuses = BBS.StatBonuses || {};

(function() {

	//=============================================================================
	// Parameter Variables
	//=============================================================================
	var parameters = PluginManager.parameters('BBS_StatBonuses');
	var pDebugging	  = eval(String(parameters['Debug Mode'] || 'false'));
	

	var achBonuses = [
		{ id:"warlord", stat:2, bonus:0.01, remState:125, isXParam:true },
		{ id:"loremaster", stat:2, bonus:0.02, remState:142, isXParam:true },
		{ id:"scholar", stat:3, bonus:0.02, remState:141, isXParam:true },
		{ id:"revenant", stat:0, bonus:0.05, remState:130, isXParam:false },
		{ id:"immortal", stat:0, bonus:0.10, remState:143, isXParam:false },
		{ id:"indestructible", stat:1, bonus:0.05, remState:144, isXParam:false },
		{ id:"great", stat:2, bonus:0.01, remState:102, isXParam:false },
		{ id:"butcher", stat:2, bonus:0.01, remState:106, isXParam:false },
		{ id:"warrior", stat:2, bonus:0.01, remState:107, isXParam:false },
		{ id:"hero", stat:2, bonus:0.01, remState:108, isXParam:false },
		{ id:"exemplar", stat:2, bonus:0.01, remState:109, isXParam:false },
		{ id:"veilPiercer", stat:4, bonus:0.01, remState:129, isXParam:false },
		{ id:"teamPlayer", stat:4, bonus:0.01, remState:139, isXParam:false },
		{ id:"brawler", stat:0, bonus:0.01, remState:103, isXParam:true },
		{ id:"pauper", stat:7, bonus:-0.01, remState:104, isXParam:false },
		{ id:"benefactor", stat:7, bonus:0.01, remState:105, isXParam:false },
		{ id:"merciful", stat:7, bonus:0.01, remState:113, isXParam:false },		
		{ id:"bloodhound", stat:7, bonus:0.01, remState:121, isXParam:false },
		{ id:"goodSamaritian", stat:7, bonus:0.01, remState:135, isXParam:false },
		{ id:"legend", stat:7, bonus:0.01, remState:136, isXParam:false },
		{ id:"wolfbane", stat:3, bonus:0.01, remState:114, isXParam:false },
		{ id:"avenger", stat:3, bonus:0.01, remState:115, isXParam:false },
		{ id:"stalwart", stat:3, bonus:0.01, remState:117, isXParam:false },
		{ id:"giantSlayer", stat:5, bonus:0.01, remState:110, isXParam:false },
		{ id:"demonSlayer", stat:5, bonus:0.01, remState:111, isXParam:false },
		{ id:"paladin", stat:5, bonus:0.01, remState:112, isXParam:false },
		{ id:"catSavior", stat:6, bonus:0.01, remState:123, isXParam:false },
		{ id:"ghost", stat:1, bonus:0.01, remState:119, isXParam:true }
	];	
	
	/*
	// FIXME: Add Element/Status bonuses here!
	{ id:"resourceful", stat:"mcr", bonus:-0.05, remState:128, isXParam:true },
	{ name:"investor", unlocked:false, index:"GOLD", bonus:2.0 },						// +200% total
	{ name:"honoraryToledan", unlocked:false, index:"Stun", bonus:-0.05 },				// -5% total
	{ name:"heroOfWhisperingFalls", unlocked:false, index:"Blind", bonus:-0.05 },		// -5% total
	{ name:"honoraryParisian", unlocked:false, index:"Attack Down", bonus:-0.05 },		// -5% total
	{ name:"honoraryVenetian", unlocked:false, index:"Defense Down", bonus:-0.05 },		// -5% total
	{ name:"sleuth", unlocked:false, index:"Blind", bonus:-0.05 },						// -5% total
	{ name:"charismatic", unlocked:false, index:"Silence", bonus:-0.25 },				// -25% total
	{ name:"trueSeeing", unlocked:false, index:"Confuse", bonus:-0.10 },				// -10% total
	{ name:"charmer", unlocked:false, index:"Infatuated", bonus:-0.10 },				// -10% total
	{ name:"serpentSlayer", unlocked:false, index:"Bleed", bonus:-0.05 },				// -5% total
	{ name:"brave", unlocked:false, index:"Fear", bonus:-0.05 },						// -5% total
	{ name:"fearless", unlocked:false, index:"Fear", bonus:-0.05 },						// -10% total
	{ name:"unstoppable", unlocked:false, index:"Fear", bonus:-1.00 }					// -100% total
	*/		
		
	var sklBonuses = [	
		{ id:313, stat:2, bonus:0.01, remState:0, isXParam:false },
		{ id:314, stat:2, bonus:0.02, remState:0, isXParam:false },
		{ id:316, stat:9, bonus:0.05, remState:52, isXParam:true },
		{ id:317, stat:9, bonus:0.10, remState:53, isXParam:true },
		{ id:318, stat:0, bonus:0.05, remState:0, isXParam:false },
		{ id:319, stat:0, bonus:0.10, remState:0, isXParam:false },
		{ id:320, stat:0, bonus:0.20, remState:0, isXParam:false },
		{ id:321, stat:1, bonus:0.01, remState:0, isXParam:true },
		{ id:322, stat:1, bonus:0.02, remState:0, isXParam:true },
	/*	{ id:325, stat:"rec", bonus:0.05, remState:36, isXParam:true },
		{ id:326, stat:"rec", bonus:0.10, remState:37, isXParam:true },
		{ id:327, stat:"rec", bonus:0.15, remState:38, isXParam:true },
			
		{ id:330, stat:"pha", bonus:0.10, remState:41, isXParam:true },
		{ id:331, stat:"pha", bonus:0.20, remState:42, isXParam:true },
		{ id:332, stat:"pha", bonus:0.25, remState:43, isXParam:true }, */
		{ id:333, stat:2, bonus:0.01, remState:44, isXParam:true },
		{ id:334, stat:2, bonus:0.02, remState:45, isXParam:true },
		{ id:335, stat:2, bonus:0.03, remState:46, isXParam:true },
			
		{ id:338, stat:6, bonus:0.02, remState:0, isXParam:false },
		{ id:339, stat:6, bonus:0.04, remState:0, isXParam:false },
		{ id:340, stat:1, bonus:0.10, remState:0, isXParam:false },
		{ id:341, stat:1, bonus:0.05, remState:0, isXParam:false },
		{ id:342, stat:1, bonus:0.15, remState:0, isXParam:false },
		{ id:343, stat:3, bonus:0.01, remState:0, isXParam:false },
		{ id:344, stat:3, bonus:0.02, remState:0, isXParam:false },
		{ id:345, stat:6, bonus:0.05, remState:49, isXParam:true },
		{ id:346, stat:8, bonus:0.03, remState:50, isXParam:true },
		{ id:347, stat:8, bonus:0.05, remState:51, isXParam:true }
	];

	/*
	// FIXME: ADD STATUS AILMENTS ATK / ELEMENT DEFENSE HERE
	this.heroBonuses.add({ skillId:"Exorcist I", unlocked:false, index:"Evil", bonus:-0.05 });					// -5% total
	this.heroBonuses.add({ skillId:"Exorcist II", unlocked:false, index:"Evil", bonus:-0.10 });					// -10% total

	this.heroBonuses.add({ skillId:311, unlocked:false, index:"STUN ATK", bonus:0.05 });	// +5% total
	this.heroBonuses.add({ skillId:312, unlocked:false, index:"STUN ATK", bonus:0.10 });	// +10% total

	this.heroBonuses.add({ skillId:"Wrench I", unlocked:false, index:"STUN ATK", bonus:0.02 });					// +2% total
	this.heroBonuses.add({ skillId:"Wrench II", unlocked:false, index:"STUN ATK", bonus:0.05 });				// +5% total

	this.heroBonuses.add({ skillId:"Fight Dirty I", unlocked:false, index:"BLIND ATK", bonus:0.05 });			// +5% total
	this.heroBonuses.add({ skillId:"Fight Dirty II", unlocked:false, index:"BLIND ATK", bonus:0.10 });			// +10% total
	*/
		
	
	//=============================================================================
	// Game_Party
	//=============================================================================	
	var BBS_SB_Game_Party_initialize = Game_Party.prototype.initialize;
	Game_Party.prototype.initialize = function() {
        BBS_SB_Game_Party_initialize.call(this);
    };
		
	// CONFIRMED: Works.
	Game_Party.prototype.checkBonuses = function() {
		if (this.unlockedBonuses === undefined) {
			this.unlockedBonuses = [];	
		}
		
		// Apply all relevant bonuses now.	
		var trimmedAchBonuses = [];
		for (var i = 0; i < achBonuses.length; i++) {			
			// CONFIRMED: By omission, this element will not be present in the final this.achBonuses array.
			if (IAVRA.ACHIEVEMENT.isCompleted(achBonuses[i].id) === true && this.unlockedBonuses.contains(achBonuses[i]) === false) {
				this.unlockedBonuses.push(achBonuses[i]);
				this.addPartyBonus(i);
			} else {
				trimmedAchBonuses.push(achBonuses[i]);
			}
		}
		
		console.log(trimmedAchBonuses);
		achBonuses = trimmedAchBonuses;
		console.log("Check Bonuses() completed");
	};
	
	// CONFIRMED: Works.
	Game_Party.prototype.addPartyBonus = function(index) {
		var unlockedBonus = achBonuses[index];
						
		// Remove related state from all members in party and replace with paramPlus.
		if (this.members().length === 0) { return; }
		for(var i = 0; i < this.members().length; i++) {			
			this.members()[i].applyBonus(unlockedBonus);
			this.members()[i].removeState(unlockedBonus.remState);
		}
	};
	
	// Check all actor skill bonuses.
	Game_Party.prototype.checkActorBonuses = function() {
		if (this.members().length === 0) { return; }
		for (var i = 0; i < this.members().length; i++) {
			this.members()[i].checkSkillBonuses();
		}
	};
	
	// Applies all achievement bonuses to new party members without state dependency.
	Game_Party.prototype.applyNewMemberBonuses = function(actorId) {
		var actor = this.members()[actorId];
		
		if (this.members().length === 0) { return; }
		for (var i = 0; i < this.unlockedBonuses.length; i++) {
			actor.applyBonus(this.unlockedBonus[i]);
			actor.removeState(oldState);
		}
	};
	
	
	//=============================================================================
	// Game_Actor
	//=============================================================================	
	var BBS_SB_Game_Actor_initialize = Game_Actor.prototype.initialize;
	Game_Actor.prototype.initialize = function(actorId) {
        BBS_SB_Game_Actor_initialize.call(this, actorId);
		if (this.bonusesUnapplied === undefined) {
			this.createNewSkillArray();
		}
    };
	
	Game_Actor.prototype.getParam = function(id, isXParam) {
		var paramValue = 0;
		
		if (isXParam === false) {
			paramValue = this.paramBase(id);
		}
		else {
			paramValue = this.xparamFlat(id);
		}
		
		return paramValue;
	};
	
	Game_Actor.prototype.createNewSkillArray = function() {
		// Track which skill bonuses have already been applied.
		this.bonusesUnapplied = [
			313, 314, 316, 317, 318, 319, 320, 321, 322, 
			333, 334, 335, 338, 339, 340, 341, 342, 343, 
			344, 345, 346, 347
		];
	};
	
	// Based on an actor and paramId return the new value of the param with bonuses applied.
	Game_Actor.prototype.calcBonus = function(oldTotal, newBonus) {
		var totalBonus = 0;
		
		// XParams don't use multiplier bonuses.
		if (newBonus.isXParam === false) {
			this.multiplyBonuses[id] += newBonus.bonus;
			totalBonus = Math.ceil(newBonus.bonus * oldTotal);
			totalBonus += this.addBonuses[id];
		}
		else {		
			var offsetId = id + 8;		// Offset index for xParams (come after base params).
			totalBonus = this.addBonuses[offsetId];
			this.addBonuses[offsetId] += newBonus.bonus;
		}
				
		return totalBonus;
	};
	
	// Apply an unlocked actor bonus.
	Game_Actor.prototype.applyBonus = function(unlockedBonus) {
		var oldState = unlockedBonus.remState;
		var isXParam = unlockedBonus.isXParam;
 		var bonusIndex = unlockedBonus.stat;

		console.log("Game_Actor.prototype.applyBonus(" + unlockedBonus + ")");
		
		var oldTotal = this.getParam(bonusIndex, isXParam);
		var paramBonus = this.calcBonus(oldTotal, unlockedBonus);
		console.log("param bonus = " + paramBonus);
		
		if (isXParam === false) {				
			if (this._paramPlus === undefined) {
				this._paramPlus = [0, 0, 0, 0, 0, 0, 0, 0];
			}
			
			this._paramPlus[bonusIndex] += paramBonus;
			this._baseParamCache[bonusIndex] += paramBonus;
		}
		else {
			if (this._xparamPlus === undefined) {
				this._xparamPlus = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			}
			
			this._xparamPlus[bonusIndex] += paramBonus;
		}
		
		console.log("Removed state; " + oldState + ", from member; " + this);
	};
	
		
	// Apply any and all unlocked actor bonuses, and remove them from this actors arrays.
	Game_Actor.prototype.checkSkillBonuses = function() {	
		if (this.multiplyBonuses === undefined || this.addBonuses === undefined) {
			this.multiplyBonuses = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
			this.addBonuses = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
		}
		
		if (this.bonusesUnapplied === undefined) {
			this.createNewSkillArray();
		}
		
		// Remove ids of skills that get applied from this.bonusesUnapplied.
		var trimmedBonuses = [];
		for (var i = 0; i < this.bonusesUnapplied.length; i++) {
			var unlocked = this._skills.contains(sklBonuses[i].id);		
			
			// Remove assigned bonuses by omission.
			if (unlocked === true && this.bonusesUnapplied.contains(sklBonuses[i].id) === true) {
				var oldState = sklBonuses[i].remState;
				this.applyBonus(sklBonuses[i]);
				if (oldState > 0) {
					this.removeState(oldState);
				}
			}
			else {
				trimmedBonuses.push(this.bonusesUnapplied[i]);
			}
		}
		
		this.bonusesUnapplied = trimmedBonuses;
	};
	
	// Skill override - add skill bonus when new skill learnt.
	var BBS_SB_Game_Actor_LearnSkill = Game_Actor.prototype.learnSkill;
	Game_Actor.prototype.learnSkill = function(skillId) {
		BBS_SB_Game_Actor_LearnSkill.call(this, skillId);
		this.checkSkillBonuses();
	};
	
		
	//=============================================================================
	// Scene_Map
	//=============================================================================
	var BBS_SB_Scene_Map_start = Scene_Map.prototype.start;
	Scene_Map.prototype.start = function() {
		BBS_SB_Scene_Map_start.call(this);
		$gameParty.checkActorBonuses();
		$gameParty.checkBonuses();
		
		
		if (OrangeGreenworks.getScreenName() === "casazampieri") {
			IAVRA.ACHIEVEMENT.complete("lionTamer");
		}
	};

	/*	
		// -5 PASSIVES DIFFICULTY SETTINGS
				
		// = checks - 51 x 4 = 204 statuses at full party size
		// Max Reprieve = 64 * 4 = 256 statuses 
		// Need addition to change elemental resistances +2 passives
	*/
	
	
})(BBS.StatBonuses);

// Needs hook-in is with Yanfly Learn Skill


//=============================================================================
// End of File
//=============================================================================