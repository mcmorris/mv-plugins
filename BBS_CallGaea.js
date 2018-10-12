//=============================================================================
// Bluebooth Plugins - CallGaea
// BBS_CallGaea.js
//=============================================================================

//=============================================================================
 /*:
 * @title Call Gaea
 * @author Michael Morris (https://www.patreon.com/bluebooth)
 * @date Oct 20, 2016
 * @filename BBS_CallGaea.js
 *
 * @plugindesc v1.01 Enables a button that calls Gaea, disables until Common Event
 * processing is over, makes a button appear on screen with Gaea (reminder), etc.
 * Special Thanks to 'Ramza' Michael Sweeney for all the support.
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
 * @param Common Event Id
 * @desc Id of the common event to call when the button is pressed.
 * @default 0
 * 
 * @param Common Event Button
 * @desc Name of button to check for.  Will crash if not a valid button name.
 * @default pageup
 * 
 * @param Debug Mode
 * @desc Enable to activate console variable logging.  Use for debugging odd behaviour.
 * true to enable console variable logging.
 * @default false
 * 
 * @help
 * ============================================================================
 * Description
 * ============================================================================
 *
 * Enables a button that calls Gaea, disables until Common Event
 * processing is over, makes a button appear on screen with Gaea (reminder), etc.
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
Imported.CallGaea = 1;
BBS.CallGaea = BBS.CallGaea || {};

(function() {

   	//=============================================================================
	// Parameter Variables
	//=============================================================================
	var parameters = PluginManager.parameters('BBS_CallGaea');
	var pCommonEventId	  = Number(parameters['Common Event Id'] || '0');
	var pCommonEventBtn	  = String(parameters['Common Event Button'] || 'pageup');
	var pDebugging		  = eval(String(parameters['Debug Mode'] || 'false'));
	
	var systemEnabled = true;	
	
	//=============================================================================
    // Game_Temp
    //=============================================================================
	Game_Temp.prototype.isGaeaActive = function() {
		if(this.gaeaActive === undefined) {
			this.gaeaActive = false;
		}
		
		return this.gaeaActive;
	};
	
    //=============================================================================
    // Game_Player
    //=============================================================================	
	var BBS_CG_Game_Player_Update = Game_Player.prototype.update;
	Game_Player.prototype.update = function(sceneActive) {
		BBS_CG_Game_Player_Update.call(this, sceneActive);
		this.updateEventBtn();
	};

	Game_Player.prototype.updateEventBtn = function() {
		if (this.isMoving()) {
			return;
		}
		if (!this.isInVehicle()) {
			this.isEventButtonPressed();
		}
	};

	Game_Player.prototype.isEventButtonPressed = function() {
		// Do not trigger during dialogue; this button used for term window at that time.
		if ($gameMessage.isBusy()) return;
		
		if(Input.isTriggered(pCommonEventBtn) || Input.isTriggered("F1")) {
			if($gameTemp.isGaeaActive() === false) {
				$gameTemp.gaeaActive = true;
				$gameTemp.reserveCommonEvent(pCommonEventId);
				$gameTemp.gaeaActive = false;
			}
		}
		
	};
		
})(BBS.CallGaea);
//=============================================================================
// End of File
//=============================================================================
