declare interface Player {
	town_center: {
		entity: any;
		entity_id: EntityID;
		position: Position;
	},
	scarModel: {
		show_actual_score: boolean;
	}
}

declare function Core_CallDelegateFunctions(name: string, val: boolean): void;
declare function Entity_Create(ebp: EntityBlueprint, player: PlayerID, pos: Position, toward: Position | false): EntityID;
declare function Annihilation_LoserPresentation(playerID: PlayerID): void;
declare function Player_IsSurrendered(player: Player | PlayerID): any;
declare function Rule_RemoveAll(max_priority?: number): void;

declare let WinCondition_CheckSurrender: Function;
declare let Mod_WinCondition_OnKingDeath: (context: any) => any
