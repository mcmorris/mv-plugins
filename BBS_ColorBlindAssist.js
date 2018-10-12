//=============================================================================
// Bluebooth Plugins - Color Blind Assist
// BBS_ColorBlindAssist.js
//=============================================================================

//=============================================================================
 /*:
 * @title Color Blind Assist
 * @author Michael Morris (https://www.patreon.com/bluebooth)
 * @date May 5, 2017
 * @filename BBS_ColorBlindAssist.js
 *
 * @plugindesc v1.01 Includes a number of small fixes to make RPGMaker MV
 * games easier to play for people with color blindness.
 * Special Thanks to 'Ramza' Michael Sweeney for all the support.
 * 
 * ============================================================================
 * Terms of Use
 * ============================================================================
 *  - Free for use in non-commercial projects with credits
 *  - Free for commercial use with credits
 * 
 * ============================================================================
 * Parameters
 * ============================================================================
 * @param Override Damage Popups
 * @desc Show a + and - in front of damage popups (default relies on color to identify
 * healing vs. damage).
 * Default: true
 * @default true
 * 
 * @help
 * ============================================================================
 * Description
 * ============================================================================
 *
 * Includes a number of small fixes to make RPGMaker MV games easier to play 
 * for people with color blindness.
 * 
 * ============================================================================
 * Change Log
 * ============================================================================
 * 1.01 - Plugin finished.
 * 
 */
//=============================================================================

//=============================================================================
var Imported = Imported || {} ;
var BBS = BBS || {};
Imported.ColorBlindAssist = 1;
BBS.ColorBlindAssist = BBS.ColorBlindAssist || {};

(function() {
	
	//=============================================================================
	// Parameter Variables
	//=============================================================================
	var parameters = PluginManager.parameters('BBS_FlashOption');
	var pOverrideDmg = String(parameters['Override Damage Popups'] || 'true');
	var pDebugging = false;

	//=============================================================================
	// Sprite_Damage
	//=============================================================================	
	Sprite_Damage.prototype.createDigits = function(baseRow, value) {
		var temp = Math.abs(value).toString();
		var string = temp;
		
		// Make damage popups color-blind friendly.
		//if (pOverrideDmg === true) {
			if (value > 0) {
				string = "-" + temp;
			}
			else if (value < 0) {
				string = "+" + temp;
			}
			
			if (pDebugging === true) {
				console.log(string);
			}
		//}
		
		// Resume default function.
		
		var row = baseRow + (value < 0 ? 1 : 0);
		var w = this.digitWidth();
		var h = this.digitHeight();
		for (var i = 0; i < string.length; i++) {
			var sprite = this.createChildSprite();
			
			// Added custom digit indices for +, -.
			var n = -1;
			
			//console.log(string[i]);
			
			if(string[i] === '+') {
				n = 10;
			}
			else if(string[i] === '-') {
				n = 11;
			}
			else {
				n = Number(string[i]);
			}
			
			sprite.setFrame(n * w, row * h, w, h);
			sprite.x = (i - (string.length - 1) / 2) * w;
			sprite.dy = -i;
		}
	};
	
	// +, - columns mean new bitmap width.
	Sprite_Damage.prototype.digitWidth = function() {
		return this._damageBitmap ? this._damageBitmap.width / 12 : 0;
	};

})(BBS.ColorBlindAssist);
//=============================================================================
// End of File
//=============================================================================
