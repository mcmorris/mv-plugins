//=============================================================================
// Bluebooth Plugins - Transition History
// BBS_TransitionHistory.js
//=============================================================================

//=============================================================================
 /*:
 * @plugindesc v1.04 Stores a list of previous player transition positions.
 * @author Michael Morris
 * 
 * @param History Length
 * @desc How many transitions should be remembered?  If the number of transitions is
 * larger than the history length size than the oldest transition will be removed from
 * the list.
 * @default 8
 *
 * @param Last Map Id
 * @desc Choose the variable ID that stores the player's last map ID.
 * @default 1
 * 
 * @param Last Player Map X
 * @desc Choose the variable ID that stores the player's last map X.
 * -1 do not remember last Player X.
 * @default 2
 *  
 * @param Last Player Map Y
 * @desc Choose the variable ID that stores the player's last map Y.
 * -1 do not remember last Player Y.
 * @default 3
 * 
 * @param Last Player Facing Direction
 * @desc Choose the variable ID that stores the player's last facing direction.
 * -1 do not remember last facing direction.
 * @default 4
 *
 * @param Next Map Id
 * @desc Choose the variable ID that stores the player's next map ID.
 * @default 5
 * 
 * @param Next Player Map X
 * @desc Choose the variable ID that stores the player's next map X.
 * -1 do not remember last Player X.
 * @default 6
 *  
 * @param Next Player Map Y
 * @desc Choose the variable ID that stores the player's next map Y.
 * -1 do not remember last Player Y.
 * @default 7
 * 
 * @param Next Player Facing Direction
 * @desc Choose the variable ID that stores the player's next facing direction.
 * -1 do not remember last facing direction.
 * @default 8
 * 
 * @param Debug Mode
 * @desc Enable to activate console variable logging.  Use for debugging odd behaviour.
 * true to enable console variable logging.
 * @default false
 *  
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * To be used in more complicated scripts, this tracks a list of last player map positions
 * before transition.  It is intended to be used for things like daisy chaining world maps.
 * If the player transfers back to the previous map, then use pop.  Should not be used for
 * data you want to be saved to disk.  This is for the current session only.
 *
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 *
 * Use the following plugin commands to manipulate world map nodes.
 *
 * Plugin Commands:
 * 	 
 *	 TransitionHistory init 						# Initialize Transition History.
 *	 TransitionHistory saveMapPos mapId, x, y, dir	# Stores in $gameVariables map Id, player coordinates, and facing direction.
 *   TransitionHistory setNext mapId, x, y, dir		# Stores in next $gameVariables map Id, player coordinates, and facing direction.
 *	 TransitionHistory storeCurrent			 		# Stores current map Id, player coordinates, and facing direction.
 *	 TransitionHistory store mapId, x, y, dir		# Stores map Id, player coordinates, and facing direction.
 *   TransitionHistory getHead						# Gets the head element from the history array.  Sadly not sexual.
 *	 TransitionHistory pop 							# Removes most recent map Id, player coordinate, and facing direction.
 *	 TransitionHistory clear						# Frees all memory allocated by Transition History.
 * 
 * ============================================================================
 * Versions
 * ============================================================================
 * 1.04 - Fixed bad logic error where changing maps would break transition history.  Ouch.
 * 1.03 - Added store current function as store ... was cumbersome.
 * 1.02 - If history array is empty, getHead will return saved map pos (see: saveMapPos).  Can't pop if history array empty.
 * 1.01 - Plugin finished.
 * 
 */
//=============================================================================

//=============================================================================
var Imported = Imported || {} ;
var BBS = BBS || {};
Imported.TransitionHistory = 1;
BBS.TransitionHistory = BBS.TransitionHistory || {};

(function() {

	//=============================================================================
	// Parameter Variables
	//=============================================================================
	var parameters = PluginManager.parameters('BBS_TransitionHistory');
	var historyMaxSize	  = Number(parameters['History Length'] || '8');
	var lastMapVar		  = Number(parameters['Last Map Id'] || '1');
	var lastXVar		  = Number(parameters['Last Player Map X'] || '2');
	var lastYVar		  = Number(parameters['Last Player Map Y'] || '3');
	var lastFDirVar		  = Number(parameters['Last Player Facing Direction'] || '4');
	var nextMapVar		  = Number(parameters['Next Map Id'] || '5');
	var nextXVar		  = Number(parameters['Next Player Map X'] || '6');
	var nextYVar		  = Number(parameters['Next Player Map Y'] || '7');
	var nextFDirVar		  = Number(parameters['Next Player Facing Direction'] || '8');
	var debugging		  = eval(String(parameters['Debug Mode'] || 'false'));
	
	//=============================================================================
	// Game_Interpreter
	//=============================================================================
    var BBS_TH_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        if (command === 'TransitionHistory') {
            switch (args[0]) {
			case 'init':
				$gameTemp.THhistoryInit();
				break;
			case 'saveMapPos':
				$gameTemp.THsaveMapPos();
				break;
			case 'setNext':
				$gameTemp.THsetNext(Number(args[1]), Number(args[2]), Number(args[3]), Number(args[4]));
				break;
			case 'storeCurrent':
				$gameTemp.THstoreCurrent();
				break;
			case 'store':
				$gameTemp.THstoreMapPos(Number(args[1]), Number(args[2]), Number(args[3]), Number(args[4]));
				break;
			case 'getHead':
				$gameTemp.THgetHead();
				break;
			case 'pop':
				$gameTemp.THpopMapPos();
				break;
			case 'clear':
				$gameTemp.THclearHistory();
				break;
			};
        }
		else {
			BBS_TH_Game_Interpreter_pluginCommand.call(this, command, args);
		}
    };
	
	//=============================================================================
	// LastPosition Class
	//=============================================================================	
	function LastPosition(mapId, x, y, faceDir) {
		this.mapId = mapId;
		this.x = x;
		this.y = y;
		this.faceDir = faceDir;
	};

	//=============================================================================
	// Game Temp
	//=============================================================================
	Game_Temp.prototype.THhistoryInit = function() {
		this._history = new Array();
	};

	Game_Temp.prototype.THsaveMapPos = function() {
		$gameVariables.setValue(lastMapVar, $gameMap.mapId());
		$gameVariables.setValue(lastXVar, 0);
		$gameVariables.setValue(lastYVar, 0);
		$gameVariables.setValue(lastFDirVar, 2);
		
		// Override defaults with values, if they were provided.
		if (lastXVar > 0) {
			$gameVariables.setValue(lastXVar, $gamePlayer.x);
		}
		
		if (lastYVar > 0) {
			$gameVariables.setValue(lastYVar, $gamePlayer.y);
		}
		
		if (lastFDirVar > 0) {
			$gameVariables.setValue(lastFDirVar, $gamePlayer.direction());
		}
		
		if (debugging) {
			console.log("Saved: ");
			console.log($gameMap.mapId());
			console.log($gamePlayer.x);
			console.log($gamePlayer.y);
			console.log($gamePlayer.direction());
		}		
		
	};
	
	Game_Temp.prototype.THstoreMapPos = function(mapId, x, y, faceDir) {
		if (this._history === undefined) this.THhistoryInit();
		
		if (this._historySize >= historyMaxSize) {
			this._historySize = this._historySize - 1;
			this._history.shift();
		}
		
		var newItem = new LastPosition(mapId, x, y, faceDir);
		this._historySize = this._history.push(newItem);
		
		if (debugging) {
			console.log("Pushed: ");
			console.log(mapId);
			console.log(x);
			console.log(y);
			console.log(faceDir);
		}
	};
	
	Game_Temp.prototype.THstoreCurrent = function() {
		if ($gameMap === undefined) return;
		if ($gamePlayer === undefined) return;
		
		this.THstoreMapPos($gameMap._mapId, $gamePlayer.x, $gamePlayer.y, $gamePlayer._direction);
		
		if (debugging) {
			console.log("Pushed: ");
			console.log($gameMap._mapId);
			console.log($gamePlayer.x);
			console.log($gamePlayer.y);
			console.log($gamePlayer._direction);
		}
	};

	Game_Temp.prototype.THpopMapPos = function() {
		if (this._historySize > 0) {
			this._historySize = this._historySize - 1;
			this._history.pop();
		}
	};
	
	Game_Temp.prototype.THgetHead = function() {
		if (this._historySize > 0) {
			var headIndex = this._historySize - 1;
					
			var nextMapId = this._history[headIndex].mapId;
			var nextX = this._history[headIndex].x;
			var nextY = this._history[headIndex].y;
			var nextFD = this._history[headIndex].faceDir;
		}
		else {
			// If no entries in history, revert to saved co-ordinates.
			var nextMapId = $gameVariables.value(lastMapVar);
			var nextX = $gameVariables.value(lastXVar);
			var nextY = $gameVariables.value(lastYVar);
			var nextFD = $gameVariables.value(lastFDirVar);		
		}
		
		$gameVariables.setValue(nextMapVar, nextMapId);
		$gameVariables.setValue(nextXVar, 0);
		$gameVariables.setValue(nextYVar, 0);
		$gameVariables.setValue(nextFDirVar, 2);
		
		// Override defaults with values, if they were provided.
		if (nextXVar > 0) {
			$gameVariables.setValue(nextXVar, nextX);
		}
		
		if (nextYVar > 0) {
			$gameVariables.setValue(nextYVar, nextY);
		}
		
		if (nextFDirVar > 0) {
			$gameVariables.setValue(nextFDirVar, nextFD);
		}
		
		if (debugging) {
			console.log("Dest: ");
			console.log(nextMapId);
			console.log(nextX);
			console.log(nextY);
			console.log(nextFD);
		}
	};
	
	Game_Temp.prototype.THsetNext = function(mapId, x, y, faceDir) {	
		$gameVariables.setValue(nextMapVar, mapId);
		$gameVariables.setValue(nextXVar, 0);
		$gameVariables.setValue(nextYVar, 0);
		$gameVariables.setValue(nextFDirVar, 2);
		
		// Override defaults with values, if they were provided.
		if (nextXVar > 0) {
			$gameVariables.setValue(nextXVar, x);
		}
		
		if (nextYVar > 0) {
			$gameVariables.setValue(nextYVar, y);
		}
		
		if (nextFDirVar > 0) {
			$gameVariables.setValue(nextFDirVar, faceDir);
		}
		
	};
	
	Game_Temp.prototype.THclearHistory = function() {
		while (this._historySize > 0) {
			this._historySize = this._historySize - 1;
			this._history.pop();
		}
	}

})(BBS.TransitionHistory);
//=============================================================================
// End of File
//=============================================================================
