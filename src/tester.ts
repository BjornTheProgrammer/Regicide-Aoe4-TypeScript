// Import Utility Scripts
importScar("cardinal.scar")
importScar("ScarUtil.scar")

// Import Gameplay Systems
importScar("gameplay/score.scar")					// Tracks player score
importScar("gameplay/diplomacy.scar")				// Manages Tribute

// Import Win Conditions
importScar("winconditions/annihilation.scar")		// Support for eliminating a player when they can no longer fight or produce units
importScar("winconditions/elimination.scar")		// Support for player quitting or dropping (through pause menu or disconnection)
importScar("winconditions/surrender.scar")			// Support for player surr}er (through pause menu)

// Import UI Support
importScar("gameplay/chi/current_dynasty_ui.scar")	// Displays Chinese Dynasty UI
importScar("gameplay/event_cues.scar")
importScar("gameplay/currentageui.scar")

declare let _mod: {
	module: string;
	options: any;
	objective_title: string;
	objective_requirement: number;
	icons: {
		objective: string;
	}
}

_mod = {
	module: "Mod",
	options: {},
	objective_title: "$fe3b1288b0cd4c17a3022e39f7acad94:29", 
	objective_requirement: 1,
	icons: {
		objective: "icons\\objectives\\objectives_leader",
	},
}

Mod_OnGameSetup(() => {
	print("Game setup")
})

Mod_PreInit(() => {
	Core_CallDelegateFunctions("TributeEnabled", true)
})

Mod_OnInit(() => {
	// Store the local player so we can reference them later
	const localPlayer = Core_GetPlayersTableEntry(Game_GetLocalPlayer())
	
	// CALLING FUNCTIONS: The following calls the Mod_FindTownCenter() and Mod_SpawnBuilding() functions directly and immediately.
	Mod_FindTownCenter()
	//Mod_SpawnBuilding()
	Mod_SpawnUnits()
	
	// Get the host-selected Options configured in the mod's .rdo file
	Setup_GetWinConditionOptions(_mod.options)
	
	// StandardMode_Start();
	
	// Activate the losing condition on King Death
	Rule_AddGlobalEvent(Mod_WinCondition_OnKingDeath, GE_EntityKilled)
	
	Core_CallDelegateFunctions("DiplomacyEnabled", false)
	Core_CallDelegateFunctions("TributeEnabled", true)
})

// This function finds the starting Town Center for all players in the match, reveals it to all other players, and increases its production speed
function Mod_FindTownCenter() {
	
	// This is a for loop that does something for each player in the match.
	// PLAYERS is a table that contains all of the players in the match.
	// If there are two players it will run twice, if there are eight players it will run eight times, etc.
	PLAYERS.forEach((player, i) => {
		// Get the player's entities and place them into an ENTITY GROUP
		const eg_player_entities = Player_GetEntities(player.id)
		// Filter out everything in the ENTITY GROUP except for the Town Center
		EGroup_Filter(eg_player_entities, "town_center", FILTER_KEEP)
		// Get the Town Center ENTITY by getting the first entry in the ENTITY GROUP we just filtered
		const entity =	EGroup_GetEntityAt(eg_player_entities, 1)
		// Get the Town Center's ENTITY ID
		// Some functions require the ENTITY ID to perform an action on the ENTITY
		const entity_id = Entity_GetID(entity) 
		// Get the Town Center's position
		const position = Entity_GetPosition(entity)
		
		// Store the player's Town Center information so it can be referenced later
		player.town_center = {
			entity: entity,
			entity_id: entity_id,
			position: position,
		}
			
		// Reveal Town Center locations for the first 30 seconds of the match
		//FOW_RevealArea(player.town_center.position, 40, 30)
	})
}


// This function spawns a group of Spearmen next each player's Town Center
function Mod_SpawnUnits() {
	// This is a for loop that does something for each player in the match.
	// PLAYERS is a table that contains all of the players in the match.
	// If there are two players it will run twice, if there are eight players it will run eight times, etc.
	PLAYERS.forEach((player, i) => {
		// Get player's Civilization name
		const player_civ = Player_GetRaceName(player.id)
		
		// Create a local variable for the Spearman BLUEPRINT (BP) we are going to find below
		// The local variable needs to be established before the below IF statement so it can be referenced outside of it within the function
		let sbp_spearman
		
		// This checks which Civilization the player is using and gets the appropriate BLUEPRINTS for the Spearmen unit
		// BLUEPRINTS are the instructions needed to create a SQUAD, ENTITY, or UPGRADE
		switch (player_civ) {
			case 'english':
				// Get the Age 4 English Spearman Blueprint
				sbp_spearman = BP_GetSquadBlueprint("unit_king_1_eng");
				break;
			case 'chinese':
				// Get the Age 4 Chinese Spearman Blueprint
				sbp_spearman = BP_GetSquadBlueprint("unit_king_1_chi");
				break;
			case 'french':
				// Get the Age 4 French Spearman Blueprint
				sbp_spearman = BP_GetSquadBlueprint("unit_king_1_fre");
				break;
			case 'hre':
				// Get the Age 4 HRE Spearman Blueprint
				sbp_spearman = BP_GetSquadBlueprint("unit_king_1_hre");
				break;
			case 'mongol':
				// Get the Age 4 Mongol Spearman Blueprint
				sbp_spearman = BP_GetSquadBlueprint("unit_king_1_mon");
				break;
			case 'rus':
				// Get the Age 4 Rus Spearman Blueprint
				sbp_spearman = BP_GetSquadBlueprint("unit_king_1_rus");
				break;
			case 'sultanate':
				// Get the Age 4 Delhi Sultanate Spearman Blueprint
				sbp_spearman = BP_GetSquadBlueprint("unit_king_1_sul");
				break;
			case 'abbasid':
				// Get the Age 4 Abbasid Spearman Blueprint
				sbp_spearman = BP_GetSquadBlueprint("unit_king_1_abb");
				break;
			case 'ottoman':
				// Get the Age Ottoman King Blueprint
				sbp_spearman = BP_GetSquadBlueprint("unit_king_1_ott");
				break;
			case 'malian':
				// Get the Age 4 Malian King Blueprint
				sbp_spearman = BP_GetSquadBlueprint("unit_king_1_mal");
				break;
			case 'byzantine':
				// Get the Age Byzantine King Blueprint
				sbp_spearman = BP_GetSquadBlueprint("unit_king_1_byz");
				break;
			case 'japanese':
				// Get the Age Japanese King Blueprint
				sbp_spearman = BP_GetSquadBlueprint("unit_king_1_jpn");
				break;
			case 'abbasid_ha_01':
				// Get the Age Abbasid Historic King Blueprint
				sbp_spearman = BP_GetSquadBlueprint("unit_king_1_abb_ha_01");
				break;
			case 'chinese_ha_01':
				// Get the Age Chinese Historic King Blueprint
				sbp_spearman = BP_GetSquadBlueprint("unit_king_1_chi_ha_01");
				break;
			case 'french_ha_01':
				// Get the Age French Historic King Blueprint
				sbp_spearman = BP_GetSquadBlueprint("unit_king_1_fre_ha_01");
				break;
			case 'hre_ha_01':
				// Get the Age HRE Historic King Blueprint
				sbp_spearman = BP_GetSquadBlueprint("unit_king_1_hre_ha_01");
				break;
		}

		
		// Get a position offset from the player's Town Center
		const spawn_position = Util_GetOffsetPosition(player.town_center.position, 20, 10)
		
		// Create a unique sgroup name for this player's spearmen units
		const sgroup_name = "sg_player_spearmen_" + tostring(player.id)
		// Create a SQUAD GROUP (SGROUP) that will act as a container for the spawned SQUADS
		// SGROUPS are useful for controlling all of the spawned units at once via scripted commands.
		const sg_player_spearmen = SGroup_CreateIfNotFound(sgroup_name)
		
		// This function spawns 16 Spearmen of the player's Civilization near their starting Town Center
		// You can hover over the function to view the parameters it requires. From left to right:
		// player = The player that the spawned units will belong to.
		// sgroup = The SQUAD GROUP (SG) that the units will be spawned into.
		// units = A table of data that contains the SQUAD BLUEPRINT (SBP) and the number of SQUADS (aka units) to spawn.
		// spawn = The location the units will be spawned at.
		UnitEntry_DeploySquads(player.id, sg_player_spearmen, { sbp: sbp_spearman, numSquads: 1 }, spawn_position)
		
		// Get a position offset from the Town Center position
		const move_position = Util_GetOffsetPosition(player.town_center.position, 20, 15)
		// Command the SGROUP to enter into a formation
		Cmd_Ability(sg_player_spearmen, BP_GetAbilityBlueprint("core_formation_line"))
		// Command the SGROUP to Move to that position
		Cmd_FormationMove(sg_player_spearmen, move_position, false)	
	})
}


function Mod_SpawnBuilding() {
	for (let i = 0; i < PLAYERS.length; i++) {
		const player = PLAYERS[i];
		const player_civ = Player_GetRaceName(player.id);
		let ebp_building;

		switch (player_civ) {
			case "english":
				ebp_building = BP_GetEntityBlueprint("building_defense_outpost_eng");
				break;
			case "chinese":
				ebp_building = BP_GetEntityBlueprint("building_defense_outpost_chi");
				break;
			case "french":
				ebp_building = BP_GetEntityBlueprint("building_defense_outpost_fre");
				break;
			case "hre":
				ebp_building = BP_GetEntityBlueprint("building_defense_outpost_hre");
				break;
			case "mongol":
				ebp_building = BP_GetEntityBlueprint("building_defense_outpost_mon");
				break;
			case "rus":
				ebp_building = BP_GetEntityBlueprint("building_defense_wooden_fort_rus");
				break;
			case "sultanate":
				ebp_building = BP_GetEntityBlueprint("building_defense_outpost_control_sul");
				break;
			case "abbasid":
				ebp_building = BP_GetEntityBlueprint("building_defense_outpost_control_abb");
				break;
			case "ottoman":
				ebp_building = BP_GetEntityBlueprint("building_defense_outpost_control_ott");
				break;
			case "malian":
				ebp_building = BP_GetEntityBlueprint("building_defense_outpost_control_mal");
				break;
			case "byzantine":
				ebp_building = BP_GetEntityBlueprint("building_defense_outpost_byz");
				break;
			case "japanese":
				ebp_building = BP_GetEntityBlueprint("building_defense_outpost_jpn");
				break;
			case "abbasid_ha_01":
				ebp_building = BP_GetEntityBlueprint("building_defense_outpost_control_abb_ha_01");
				break;
			case "chinese_ha_01":
				ebp_building = BP_GetEntityBlueprint("building_defense_outpost_chi_ha_01");
				break;
			case "french_ha_01":
				ebp_building = BP_GetEntityBlueprint("building_defense_outpost_fre_ha_01");
				break;
			case "hre_ha_01":
				ebp_building = BP_GetEntityBlueprint("building_defense_outpost_hre_ha_01");
				break;
			default:
				ebp_building = BP_GetEntityBlueprint("building_defense_outpost_hre_ha_01");
				break;
		}

		const spawn_position = Util_GetOffsetPosition(player.town_center.position, 10, 20);
		const entity = Entity_Create(ebp_building, player.id, spawn_position, false);
		Entity_Spawn(entity);
		Entity_ForceConstruct(entity);
		Entity_SnapToGridAndGround(entity, false);
	}
}

Mod_WinCondition_OnKingDeath = (context: any) => {
	if (Entity_IsOfType(context.victim, "King")) {
		Core_SetPlayerDefeated(context.victimOwner, Annihilation_LoserPresentation, WR_ANNIHILATION)
	}
}

WinCondition_CheckSurrender = () => {
	const results: {
		[key: number]: {
			surrender_count: number
		}
	} = {}
	for (let i = 1; i < World_GetPlayerCount(); i++) {
		const player = World_GetPlayerAt(i)
		const team = Player_GetTeam(player)	
		
		results[team] = results[team] || { surrender_count: 0 }
		
		// If any player on a team has surrendered, that team loses.
		if (Player_IsSurrendered(player)) {
			results[team].surrender_count = results[team].surrender_count + 1
		}
	}
	
	// Check if any team has surrendered.
	for (const [team, result] of pairs(results)) {
		if (result.surrender_count > 0) {
			Rule_RemoveAll()
			
			// We have a winner!
			const losingTeam = team
			const winningTeam = Team_GetEnemyTeam(losingTeam)
			
			// @ts-ignore
			World_SetTeamWin(winningTeam, -1)
		}
	}
}

function InitWinCondition() {
	// Add a rule that will get called periodically to check if the win condition has been met.
	Rule_AddInterval(WinCondition_CheckSurrender, 3)
}

// Add our win condition to the initialization list.
Scar_AddInit(InitWinCondition)

// Callback invoked by OnInit() in core.scar
function StandardMode_OnInit() {

	//UI_AllTerritoryHide()

	//Core_CallDelegateFunctions("DiplomacyEnabled", _match.is_diplomacy_enabled)
	//Core_CallDelegateFunctions("TributeEnabled", _match.is_tribute_enabled)
}

// Explored options
function StandardMode_Start() {
	// Fog of war options
	if (_mod.options.section_starting_conditions && _mod.options.section_starting_conditions.option_fow) {
		if (_mod.options.section_starting_conditions.option_fow.enum_value == _mod.options.section_starting_conditions.option_fow.enum_items.option_fow_explore) { 
			FOW_ExploreAll()
		} else if (_mod.options.section_starting_conditions.option_fow.enum_value == _mod.options.section_starting_conditions.option_fow.enum_items.option_fow_reveal) {
			FOW_ForceRevealAllUnblockedAreas()
		}
	}

	// UI Options
	if (_mod.options.section_starting_conditions && _mod.options.section_starting_conditions.option_score) {
		PLAYERS.forEach(player => {
			player.scarModel.show_actual_score = true
			UI_SetPlayerDataContext(player.id, player.scarModel)
		})
	}
}
